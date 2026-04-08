const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings'
const MODEL = 'voyage-3'

type VoyageResponse = {
  data: { embedding: number[] }[]
  usage?: { total_tokens: number }
}

async function embed(
  texts: string[],
  inputType: 'query' | 'document'
): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) throw new Error('Missing VOYAGE_API_KEY')

  const res = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: texts,
      model: MODEL,
      input_type: inputType,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Voyage API ${res.status}: ${body}`)
  }

  const json = (await res.json()) as VoyageResponse
  return json.data.map((d) => d.embedding)
}

export async function embedQuery(text: string): Promise<number[]> {
  const [v] = await embed([text], 'query')
  return v
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return embed(texts, 'document')
}
