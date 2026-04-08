import { readFile } from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'
import { PDFParse } from 'pdf-parse'
import { embedDocuments } from '../src/lib/voyage'

const PDF_PATH = path.resolve(process.cwd(), 'data/glaube-101.pdf')
const SOURCE = 'Glaube 101 - Markus Wenz'
const EMBED_MODEL = 'voyage-3'
const EMBED_BATCH = 128
const INSERT_BATCH = 50
const TARGET_WORDS = 650
const MIN_WORDS = 250
const MAX_WORDS = 850
const OVERLAP_WORDS = 50
// voyage-3 pricing ~ $0.06 per 1M tokens (document)
const PRICE_PER_MTOK = 0.06

type Section = {
  chapter: string
  section: string
  text: string
}

type Chunk = {
  content: string
  metadata: {
    chapter: string
    section: string
    chunk_index: number
    source: string
  }
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function cleanText(raw: string): string {
  return raw
    .replace(/\f/g, '\n')
    .replace(/\r/g, '\n')
    // Drop standalone page numbers
    .replace(/^\s*\d+\s*$/gm, '')
    // Common header/footer artefacts
    .replace(/^(Glaube\s*101|Markus\s*Wenz|Gospel\s*Forum)[^\n]*$/gim, '')
    // De-hyphenate line breaks: "Wort-\nfortsetzung" -> "Wortfortsetzung"
    .replace(/(\w)-\n(\w)/g, '$1$2')
    // Collapse single newlines (within paragraphs) but keep blank lines
    .replace(/([^\n])\n(?!\n)/g, '$1 ')
    // Collapse runs of blank lines into one paragraph break
    .replace(/\n{2,}/g, '\n\n')
    // Collapse repeated whitespace
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

const CHAPTER_RE = /^\s*(\d{1,2})\.\s+([A-ZÄÖÜ][^\n]{2,80})$/
const SECTION_RE = /^\s*([A-Z])\.\s+([A-ZÄÖÜ][^\n]{2,120})$/

function splitIntoSections(text: string): Section[] {
  const lines = text.split('\n')
  const sections: Section[] = []
  let chapter = 'Einleitung'
  let section = ''
  let buf: string[] = []

  const flush = () => {
    const t = buf.join('\n').trim()
    if (t.length > 0) sections.push({ chapter, section, text: t })
    buf = []
  }

  for (const line of lines) {
    const cm = line.match(CHAPTER_RE)
    const sm = line.match(SECTION_RE)
    if (cm) {
      flush()
      chapter = `${cm[1]}. ${cm[2].trim()}`
      section = ''
      continue
    }
    if (sm) {
      flush()
      section = `${sm[1]}. ${sm[2].trim()}`
      continue
    }
    buf.push(line)
  }
  flush()
  return sections
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

function sliceWords(words: string[], start: number, end: number): string {
  return words.slice(start, end).join(' ')
}

function chunkSection(section: Section, startIndex: number): Chunk[] {
  const paragraphs = section.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const chunks: Chunk[] = []

  // Build paragraph groups close to TARGET_WORDS
  const groups: string[] = []
  let current: string[] = []
  let currentWords = 0
  for (const p of paragraphs) {
    const wc = wordCount(p)
    if (currentWords + wc > MAX_WORDS && currentWords >= MIN_WORDS) {
      groups.push(current.join('\n\n'))
      current = [p]
      currentWords = wc
    } else {
      current.push(p)
      currentWords += wc
    }
  }
  if (current.length > 0) groups.push(current.join('\n\n'))

  // For very long groups (single huge paragraph), split by words with overlap
  const finalTexts: string[] = []
  for (const g of groups) {
    const words = g.split(/\s+/)
    if (words.length <= MAX_WORDS) {
      finalTexts.push(g)
      continue
    }
    let i = 0
    while (i < words.length) {
      const end = Math.min(i + TARGET_WORDS, words.length)
      finalTexts.push(sliceWords(words, i, end))
      if (end === words.length) break
      i = end - OVERLAP_WORDS
    }
  }

  let idx = startIndex
  for (let i = 0; i < finalTexts.length; i++) {
    let content = finalTexts[i]
    // Add overlap from previous chunk for context continuity
    if (i > 0) {
      const prevWords = finalTexts[i - 1].split(/\s+/)
      const tail = prevWords.slice(-OVERLAP_WORDS).join(' ')
      content = `${tail} ${content}`
    }
    chunks.push({
      content,
      metadata: {
        chapter: section.chapter,
        section: section.section,
        chunk_index: idx++,
        source: SOURCE,
      },
    })
  }
  return chunks
}

function buildChunks(sections: Section[]): Chunk[] {
  // Merge tiny adjacent sections under same chapter
  const merged: Section[] = []
  for (const s of sections) {
    const last = merged[merged.length - 1]
    if (
      last &&
      last.chapter === s.chapter &&
      wordCount(last.text) < MIN_WORDS &&
      wordCount(s.text) < MIN_WORDS
    ) {
      last.text = `${last.text}\n\n${s.text}`
      if (!last.section && s.section) last.section = s.section
    } else {
      merged.push({ ...s })
    }
  }

  const chunks: Chunk[] = []
  for (const s of merged) {
    if (wordCount(s.text) === 0) continue
    chunks.push(...chunkSection(s, chunks.length))
  }
  return chunks
}

async function embedBatches(texts: string[]): Promise<number[][]> {
  const out: number[][] = []
  const total = Math.ceil(texts.length / EMBED_BATCH)
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    const batch = texts.slice(i, i + EMBED_BATCH)
    const vectors = await embedDocuments(batch)
    out.push(...vectors)
    console.log(`  Embedded batch ${i / EMBED_BATCH + 1}/${total}`)
  }
  return out
}

async function main() {
  const SUPABASE_URL = requireEnv('SUPABASE_URL')
  const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  requireEnv('VOYAGE_API_KEY')

  console.log(`Reading PDF: ${PDF_PATH}`)
  const buf = await readFile(PDF_PATH)
  const parser = new PDFParse({ data: buf })
  const parsed = await parser.getText()
  const cleaned = cleanText(parsed.text)
  const totalWords = wordCount(cleaned)
  console.log(`Extracted words: ${totalWords}`)

  const sections = splitIntoSections(cleaned)
  console.log(`Detected sections: ${sections.length}`)

  const chunks = buildChunks(sections)
  console.log(`Created chunks: ${chunks.length}`)
  if (chunks.length === 0) throw new Error('No chunks produced — aborting.')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  console.log('Embedding chunks via Voyage AI...')
  const embeddings = await embedBatches(chunks.map((c) => c.content))
  if (embeddings.length !== chunks.length) {
    throw new Error(
      `Embedding count mismatch: ${embeddings.length} vs ${chunks.length}`,
    )
  }

  // Cost estimate (rough: ~1.3 tokens per word)
  const approxTokens = Math.round(
    chunks.reduce((sum, c) => sum + wordCount(c.content), 0) * 1.3,
  )
  const estCost = (approxTokens / 1_000_000) * PRICE_PER_MTOK
  console.log(
    `Approx tokens: ${approxTokens.toLocaleString()} — est. Voyage cost: $${estCost.toFixed(4)}`,
  )

  console.log(`Deleting existing rows for source="${SOURCE}"...`)
  const { error: delErr } = await supabase
    .from('documents')
    .delete()
    .eq('metadata->>source', SOURCE)
  if (delErr) throw delErr

  console.log('Inserting chunks into Supabase...')
  let inserted = 0
  for (let i = 0; i < chunks.length; i += INSERT_BATCH) {
    const slice = chunks.slice(i, i + INSERT_BATCH).map((c, j) => ({
      content: c.content,
      metadata: c.metadata,
      embedding: embeddings[i + j],
    }))
    const { error } = await supabase.from('documents').insert(slice)
    if (error) throw error
    inserted += slice.length
    console.log(`  Inserted ${inserted}/${chunks.length}`)
  }

  console.log(`\nDone. Stored ${inserted} chunks in Supabase.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
