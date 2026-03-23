# Gospel Forum Stuttgart — KI-Assistent

Der digitale Assistent des Gospel Forum Stuttgart. Ein Chat-Interface, das Fragen von Gemeindemitgliedern und Besuchern zu Gottesdiensten, Gruppen, Veranstaltungen, Glaubensgrundlagen und mehr beantwortet — basierend auf einer kuratierten Wissensdatenbank.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS 4
- **KI:** Claude API (Haiku 4.5) via Anthropic SDK
- **Streaming:** Server-Sent Events (SSE) für Echtzeit-Antworten
- **Package Manager:** pnpm
- **Fonts:** Inter + Lora (Google Fonts)
- **Analytics:** Vercel Analytics

## Features

- **Chat-UI** — Moderne, responsive Chat-Oberfläche im Gospel Forum Branding
- **Streaming-Antworten** — Antworten erscheinen Token für Token in Echtzeit
- **Strikte Wissensdatenbank** — Der Bot antwortet ausschließlich auf Basis geprüfter Inhalte
- **Quick-Chips** — Vordefinierte Fragen auf dem Willkommensscreen für schnellen Einstieg
- **Follow-up Vorschläge** — Kontextbezogene Folgefragen nach jeder Antwort
- **Mobile-first** — Optimiert für Smartphones, funktioniert auf allen Geräten
- **Markdown-Rendering** — Fettschrift, Links und Listen in Bot-Antworten
- **Konversationshistorie** — Mehrstufige Gespräche mit Kontextverständnis

## Setup

### Voraussetzungen

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Anthropic API Key ([console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
git clone https://github.com/naslam-axon/gospel-forum-chatbot.git
cd gospel-forum-chatbot
pnpm install
```

### Environment Variables

Erstelle eine `.env.local` Datei im Projektroot:

```bash
cp .env.example .env.local
```

Trage deinen Anthropic API Key ein:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Entwicklung starten

```bash
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur

```
src/
├── app/
│   ├── api/chat/
│   │   └── route.ts          # Claude API Endpoint mit System Prompt + Wissensdatenbank
│   ├── globals.css            # Tailwind Config, Brand Colors, Animationen
│   ├── layout.tsx             # Root Layout mit Fonts und Metadata
│   └── page.tsx               # Hauptseite mit Chat-UI
├── components/
│   ├── chat-area.tsx          # Scrollbarer Nachrichtenbereich
│   ├── chat-header.tsx        # Header mit Logo und Online-Status
│   ├── chat-input.tsx         # Textarea mit Send-Button und Footer
│   ├── chat-message.tsx       # Nachrichten-Bubbles (User + Bot)
│   ├── gospel-forum-logo.tsx  # SVG Logo-Komponente
│   ├── info-modal.tsx         # Info-Dialog über den Assistenten
│   ├── markdown-text.tsx      # Markdown-Renderer für Bot-Antworten
│   ├── typing-indicator.tsx   # Animierte Tipp-Anzeige
│   └── welcome-screen.tsx     # Willkommensscreen mit Quick-Chips
├── hooks/
│   ├── use-chat.ts            # Chat-State, API-Calls, Streaming-Logik
│   └── use-mobile.ts          # Mobile-Breakpoint Detection
└── lib/
    ├── chat-data.ts           # Message-Types und Quick-Chip Definitionen
    └── utils.ts               # cn() Utility (clsx + tailwind-merge)
```

## Deployment

### Vercel (empfohlen)

1. Repository mit Vercel verbinden: [vercel.com/new](https://vercel.com/new)
2. Environment Variable setzen: `ANTHROPIC_API_KEY`
3. Deploy — fertig

### Environment Variables für Produktion

| Variable | Beschreibung | Erforderlich |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API Key für Claude | Ja |

## Wissensdatenbank erweitern

Die Wissensdatenbank liegt direkt im System Prompt in:

```
src/app/api/chat/route.ts
```

### So fügst du neue Inhalte hinzu:

1. Öffne `src/app/api/chat/route.ts`
2. Finde den `SYSTEM_PROMPT` String
3. Füge einen neuen Abschnitt im Format hinzu:

```
=== NEUER BEREICH ===
Hier die Informationen zum neuen Bereich...
```

4. Speichern — der Dev-Server übernimmt die Änderung per Hot Reload

### Wichtig:
- Nur geprüfte, aktuelle Informationen eintragen
- Links immer im Format `gospel-forum.de/seite` angeben
- Daten regelmäßig aktualisieren (Termine, Events, etc.)

## Geplante Features

- **RAG mit PDF-Upload** — Automatisches Einlesen von Gemeinde-Dokumenten (Flyer, Berichte, etc.) als Wissensbasis
- **Salesforce Integration** — Anbindung an das CRM für personalisierte Antworten und Kontaktweiterleitung
- **Mehrsprachigkeit** — Automatische Spracherkennung und Antworten in der Sprache des Nutzers
- **Admin-Dashboard** — Verwaltung der Wissensdatenbank über eine Web-Oberfläche

## Lizenz

Privates Projekt des Gospel Forum Stuttgart.
