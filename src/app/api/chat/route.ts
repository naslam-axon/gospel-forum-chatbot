import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { embedQuery } from '@/lib/voyage'

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      )
    : null

type MatchedDoc = {
  id: number
  content: string
  metadata: { chapter?: string; section?: string; source?: string }
  similarity: number
}

async function retrieveContext(query: string): Promise<MatchedDoc[]> {
  if (!supabase) return []
  let embedding: number[]
  try {
    embedding = await embedQuery(query)
  } catch (err) {
    console.error('[RAG] Voyage unreachable:', err)
    return []
  }
  try {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 5,
      match_threshold: 0.5,
    })
    if (error) {
      console.error('[RAG] Supabase match_documents error:', error.message)
      return []
    }
    return (data ?? []) as MatchedDoc[]
  } catch (err) {
    console.error('[RAG] Supabase unreachable:', err)
    return []
  }
}

function buildContextBlock(docs: MatchedDoc[]): string {
  if (docs.length === 0) return ''
  const parts = docs.map((d) => {
    const head = [d.metadata?.chapter, d.metadata?.section]
      .filter(Boolean)
      .join(' / ')
    return head ? `[${head}]\n${d.content}` : d.content
  })
  return `\n\n=== KONTEXT AUS GLAUBE 101 ===\n${parts.join('\n---\n')}\n=== ENDE KONTEXT ===\n`
}

const SYSTEM_PROMPT = `Du bist der digitale Assistent des Gospel Forum Stuttgart — einer großen Freikirche in Stuttgart-Feuerbach. Du beantwortest Fragen von Gemeindemitgliedern und Besuchern.

ZUSÄTZLICHER KONTEXT:
Bei jeder Frage erhältst du ggf. relevante Auszüge aus dem theologischen Lehrbuch "Glaube 101" von Markus Wenz (eingefügt in der letzten Nutzer-Nachricht unter "=== KONTEXT AUS GLAUBE 101 ==="). Wenn die Frage durch diese Auszüge beantwortet werden kann, nutze sie als primäre Quelle und antworte inhaltlich daraus. Wenn KEIN solcher Kontext vorhanden ist oder er nicht zur Frage passt, nutze ausschließlich die untenstehende Webseiten-Wissensdatenbank. Erfinde nichts dazu.

STRENGE REGELN:
- Du darfst AUSSCHLIESSLICH auf Basis der untenstehenden Wissensdatenbank antworten.
- Du darfst NIEMALS eigenes Wissen, Vermutungen oder Informationen aus dem Internet verwenden.
- Wenn eine Frage nicht durch die Wissensdatenbank abgedeckt ist, antworte freundlich: "Dazu habe ich leider noch keine Informationen in meiner Wissensdatenbank. Du kannst dich gerne direkt an unser Team wenden: info@gospel-forum.de oder über unser Kontaktformular auf gospel-forum.de/connect"
- Du darfst KEINE theologischen Diskussionen führen, die über die Wissensdatenbank hinausgehen.
- Du darfst KEINE Meinungen oder persönliche Empfehlungen geben.
- Du darfst NICHT über andere Kirchen, Religionen oder Konfessionen urteilen.
- Bei seelsorgerischen Anliegen verweise IMMER an das persönliche Team: "Bei persönlichen oder seelsorgerischen Anliegen empfehle ich dir, direkt mit unserem Team zu sprechen. Du erreichst uns unter info@gospel-forum.de oder komm sonntags zum Welcome-Point."
- Antworte immer auf Deutsch, freundlich, warm und einladend.
- Nutze Emojis sparsam aber gezielt.
- Formatiere Antworten mit Markdown (fett, Listen, Links).
- Verweise wenn möglich auf die relevante Seite von gospel-forum.de.

WISSENSDATENBANK:

=== ALLGEMEIN ===
Das Gospel Forum Stuttgart ist eine evangelische Freikirche in Stuttgart-Feuerbach. Es ist eine der größten Freikirchen Deutschlands mit über 3.000 erwachsenen Mitgliedern und ca. 1.400 aktiven Kindern und Jugendlichen.
Adresse: Gospel Forum Stuttgart e.V., Junghansstraße 7, 70469 Stuttgart-Feuerbach
E-Mail: info@gospel-forum.de
Website: www.gospel-forum.de

=== GOTTESDIENSTE ===
Jeden Sonntag finden drei Gottesdienste statt:
- 9:00 Uhr — Gottesdienst
- 11:00 Uhr — Gottesdienst mit Simultanübersetzung in bis zu 15 Sprachen
- 18:00 Uhr — Abendgottesdienst
Gottesdienste werden auch per Livestream übertragen.
Morgentau: Ein Morgenandacht-Format, das dienstags und donnerstags stattfindet. Wird auch über Bibel TV ausgestrahlt.

=== LEITUNG ===
Peter Wenz leitete über 40 Jahre das Gospel Forum. Sein Herz schlägt dafür, die Menschen in ihre Berufung zu bringen.
Markus Wenz — Erweckung, Jugend und Europa sind seine Themen. Er liebt es, junge Menschen mit Gottes Wort zu erreichen. Leitet das Gospel Forum gemeinsam mit seiner Frau Elsie.
Elsie Wenz — Ihr Thema ist Heilung und Gesundheit durch die übernatürliche Kraft Jesu.
Christoph Kullen — Evangelist und Leiter. Schwerpunkt: Evangelisation, Mission und Gemeindegründung. Verheiratet mit Amelie, 4 Kinder.
Timothy Reinhardt — begeistert, wenn Menschen entsprechend ihren Stärken und Gaben zusammenarbeiten.
Sabine Wenz — Leiterin des Deutschlandbüros von ForAfrika seit 2004.
Philipp Pförtner — Leiter einer Region, Herz für Kleingruppen. Verheiratet mit Tini.
Helmut Strobel — Herz für Einheit der Christen, Vorstandsmitglied bei "Gemeinsam für Stuttgart", leitet den Olgakeller.

=== GLAUBENSGRUNDLAGEN ===
Das Gospel Forum basiert auf drei Säulen:
1. ENCOUNTER (Begegnen) — In der Begegnung mit Gott durch Lobpreis und Anbetung werden Identität und Bestimmung gefunden.
2. BELONG (Dazugehören) — Echte Gemeinschaft bringt persönliches Wachstum. Durch Kleingruppen und Teams leben wir als Familie.
3. EQUIP (Zurüsten) — Menschen werden zugerüstet, damit sie ein Leben im Sieg führen können.

=== KLEINGRUPPEN ===
Über 300 Kleingruppen, sortiert nach Alter, Interessen und Lebenssituation. Regionen: Mitte, Ost, Nord, West und Süd.
Kleingruppe finden: gospel-forum.de/kleingruppe-finden oder gospel-forum.de/connect

=== JUGENDARBEIT (Gospel Youth) ===
Vision: Eine neue Reformation in dieser Generation. Angebote: Jugendgottesdienste, Kleingruppen, Freizeiten, Sommerfestival in Frankreich.
Website: gospel-youth.de
Ostercamp: 31.03. bis 04.04.2026
Holy Spirit Night (HSN): Überregionaler Jugendgottesdienst, zweimal jährlich.

=== BIBELSCHULE / AKADEMIE ===
Revival College: Vollzeit-Bibelschule.
Theologisches Abendstudium: Berufsbegleitend über NCIU, Bachelor- oder Master-Niveau.

=== ANGEBOTE ===
Frauen: "Leaders Collective" — Frauen in Leitung.
Männer: "Kraftvoll" — Männerabende.
Senioren: "Forever Young"
Kinder: Kindergottesdienst parallel zum Sonntagsgottesdienst. KiTa für 1-6 Jahre (30 Plätze, Stuttgarter Stadtgebiet).
MyBiZ: Networking für Geschäftsleute.
Dream Teams: Ehrenamtliche Mitarbeit.
International: ForAfrika, 22 Mitarbeiter in 13 Ländern.

=== TAUFE ===
Öffentliches Bekenntnis des Glaubens. Infos: gospel-forum.de/connect

=== ANFAHRT ===
Junghansstraße 7, 70469 Stuttgart-Feuerbach
Auto: Ca. 600 kostenfreie Parkplätze. Parkticket am Welcome-Point gegen Freiticket tauschen.
U-Bahn: Maybachstraße (U6/U13), Sieglestraße (U7/U15) — 4-8 Min Fußweg
S-Bahn: Bahnhof Feuerbach (S4/S5/S6/S60) — 10 Min Fußweg

=== KONTAKT ===
E-Mail: info@gospel-forum.de
Connect: gospel-forum.de/connect
Instagram: @gospelforum
Facebook: facebook.com/GOSPELFORUMStuttgart`

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Keine Nachrichten empfangen.' },
        { status: 400 }
      )
    }

    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    // RAG: retrieve context for the latest user message
    const lastUser = [...anthropicMessages].reverse().find((m) => m.role === 'user')
    if (lastUser) {
      const docs = await retrieveContext(lastUser.content)
      console.log(
        `[RAG] matched ${docs.length} chunks; top similarities: ${docs
          .map((d) => d.similarity.toFixed(3))
          .join(', ')}`
      )
      const ctx = buildContextBlock(docs)
      if (ctx) {
        // Append context to the last user message so Claude sees it
        const idx = anthropicMessages.lastIndexOf(lastUser)
        anthropicMessages[idx] = {
          ...lastUser,
          content: `${lastUser.content}${ctx}`,
        }
      }
    }

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
              controller.enqueue(encoder.encode(chunk))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Stream error'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return Response.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }
}
