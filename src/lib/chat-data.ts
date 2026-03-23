export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  followUpChips?: string[]
}

export type QuickChip = {
  label: string
  emoji: string
}

export const quickChips: QuickChip[] = [
  { emoji: '🕐', label: 'Wann ist der nächste Gottesdienst?' },
  { emoji: '🙏', label: 'Was glaubt ihr als Gemeinde?' },
  { emoji: '👥', label: 'Wie finde ich eine Kleingruppe?' },
  { emoji: '🎉', label: 'Welche Events stehen an?' },
  { emoji: '💬', label: 'Wie kann ich mich taufen lassen?' },
  { emoji: '📍', label: 'Wo finde ich euch?' },
]

type MockResponse = {
  content: string
  followUpChips: string[]
}

const mockResponses: Record<string, MockResponse> = {
  gottesdienst: {
    content: `Unsere Gottesdienste finden **jeden Sonntag** statt:

• **9:00 Uhr** — Gottesdienst
• **11:00 Uhr** — Gottesdienst mit Übersetzung in bis zu 13 Sprachen
• **18:00 Uhr** — Abendgottesdienst mit Übersetzung

📍 Gospel Forum, Junghansstr. 9, 70469 Stuttgart

[Alle Termine ansehen](https://www.gospel-forum.de/termine)`,
    followUpChips: ['Gibt es Kindergottesdienst?', 'Wie komme ich zu euch?'],
  },
  glaube: {
    content: `Das Gospel Forum basiert auf drei Grundsäulen:

**Encounter (Begegnen)** — Wir glauben, dass in der Begegnung mit Gott durch Lobpreis und Anbetung Identität und Bestimmung gefunden wird.

**Belong (Dazugehören)** — Echte Gemeinschaft bringt persönliches Wachstum. Durch Kleingruppen und Teams leben wir als Familie.

**Equip (Zurüsten)** — Wir rüsten Menschen zu, damit sie ein Leben im Sieg führen können.

[Mehr über uns erfahren](https://www.gospel-forum.de/ueber-uns)`,
    followUpChips: ['Wer leitet die Gemeinde?', 'Gibt es eine Bibelschule?'],
  },
  kleingruppe: {
    content: `Klasse, dass du Anschluss suchst! 🙌

Wir haben über **300 Kleingruppen** — sortiert nach Alter, Interessen und Lebenssituation. Am einfachsten findest du deine Gruppe über unsere Connect-Seite:

[Kleingruppe finden](https://www.gospel-forum.de/connect)

Oder komm einfach sonntags vorbei und sprich unser Welcome-Team an — wir helfen dir persönlich weiter!`,
    followUpChips: ['Was ist Deep Talk?', 'Gibt es Männer-/Frauengruppen?'],
  },
  events: {
    content: `Hier ein Überblick der nächsten Events:

🎉 **Ostercamp** — 30. März – 4. April 2026 (Jugend)
🙏 **Deep Talk** — Jeden Mittwoch, 18:30 Uhr (Jugendforum)
👩 **Become Night** (Frauen) — 13. März, 18:00 Uhr
💪 **Kraftvoll** (Männerabend) — 27. Februar, 18:30 Uhr
👴 **Forever Young** (Senioren) — 26. März, 15:00 Uhr

[Alle Termine entdecken](https://www.gospel-forum.de/termine)`,
    followUpChips: ['Wie melde ich mich zum Ostercamp an?', 'Was kostet die Teilnahme?'],
  },
  taufe: {
    content: `Wie schön, dass du diesen Schritt gehen möchtest! 🙏

Die Taufe ist ein öffentliches Bekenntnis deines Glaubens an Jesus. Unsere nächste **Taufe findet am 12. April 2026 um 18:00 Uhr** statt.

Zur Anmeldung und für mehr Infos:
[Taufe — Anmeldung & Infos](https://www.gospel-forum.de/connect)

Wenn du Fragen hast, komm gerne auf unser Team zu — wir begleiten dich auf diesem Weg!`,
    followUpChips: ['Was ist Deep Talk?', 'Wie werde ich Mitglied?'],
  },
  adresse: {
    content: `Du findest uns hier:

📍 **Gospel Forum Stuttgart**
Junghansstr. 9
70469 Stuttgart (Feuerbach)

🚗 Parkplätze sind direkt am Gebäude verfügbar.
🚌 ÖPNV: Haltestelle Feuerbach Bahnhof, dann ca. 10 Min. zu Fuß.

[Auf Google Maps öffnen](https://maps.google.com/?q=Gospel+Forum+Stuttgart)`,
    followUpChips: ['Wann ist der nächste Gottesdienst?', 'Gibt es barrierefreien Zugang?'],
  },
}

const fallbackResponse: MockResponse = {
  content: `Danke für deine Frage! Dazu habe ich leider noch keine Informationen in meiner Wissensdatenbank. 🤔

Du kannst dich gerne direkt an unser Team wenden:
📧 info@gospel-forum.de
📞 oder über unser [Kontaktformular](https://www.gospel-forum.de/connect)

Wir helfen dir persönlich weiter!`,
  followUpChips: [],
}

export function getResponse(input: string): MockResponse {
  const lower = input.toLowerCase()

  if (
    lower.includes('gottesdienst') ||
    lower.includes('sonntag') ||
    lower.includes('uhrzeit') ||
    lower.includes('wann') && lower.includes('gottes')
  ) {
    return mockResponses.gottesdienst
  }
  if (
    lower.includes('glaubt') ||
    lower.includes('glaube') ||
    lower.includes('glauben') ||
    lower.includes('theologie') ||
    lower.includes('was glaubt')
  ) {
    return mockResponses.glaube
  }
  if (
    lower.includes('kleingruppe') ||
    lower.includes('gruppe') ||
    lower.includes('anschluss') ||
    lower.includes('connect')
  ) {
    return mockResponses.kleingruppe
  }
  if (
    lower.includes('event') ||
    lower.includes('veranstaltung') ||
    lower.includes('termine') ||
    lower.includes('programm') ||
    lower.includes('ostercamp') ||
    lower.includes('deep talk') ||
    lower.includes('welche')
  ) {
    return mockResponses.events
  }
  if (
    lower.includes('taufe') ||
    lower.includes('taufen') ||
    lower.includes('taufk')
  ) {
    return mockResponses.taufe
  }
  if (
    lower.includes('adresse') ||
    lower.includes('wo findet') ||
    lower.includes('wo finde ich') ||
    lower.includes('junghans') ||
    lower.includes('anfahrt') ||
    lower.includes('kommen') ||
    lower.includes('stuttgart') ||
    lower.includes('location')
  ) {
    return mockResponses.adresse
  }

  return fallbackResponse
}
