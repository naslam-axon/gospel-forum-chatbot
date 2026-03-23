@AGENTS.md

# Gospel Forum Chatbot — Project Context

## What is this project?

A Next.js chatbot for Gospel Forum Stuttgart, one of Germany's largest evangelical free churches. It answers questions from church members and visitors about services, groups, events, beliefs, and more. The target audience is German-speaking users on mobile and desktop.

## Architecture

### Frontend (Client-Side)

- **React Components** in `src/components/` — custom chat UI, no shadcn/ui dependencies for core chat
- **Page** (`src/app/page.tsx`) — client component using the `useChat` hook
- **Streaming UX** — messages appear token-by-token via SSE from the API route
- **Styling** — Tailwind CSS 4 with Gospel Forum brand colors (red `#C8102E`, warm white `#FAFAF7`)
- **Fonts** — Inter (sans) + Lora (serif) via `next/font/google`

### Backend (API Route)

- **Single endpoint:** `POST /api/chat` at `src/app/api/chat/route.ts`
- **Anthropic SDK** — uses `client.messages.stream()` for streaming responses
- **Model:** `claude-haiku-4-5-20251001`
- **System Prompt** contains a strict knowledge base — the bot must ONLY answer from this data
- **SSE format** — streams `data: {"text": "..."}` chunks, ends with `data: [DONE]`

### State Management

- **`src/hooks/use-chat.ts`** — manages messages array, streaming state, API calls
- **Conversation history** — full message history is sent with each request for multi-turn context

## Critical: Strict Knowledge Base

The bot operates under strict rules defined in the system prompt (`src/app/api/chat/route.ts`):

- It may ONLY answer based on the embedded knowledge base
- It must NOT use external knowledge, opinions, or theological discussion
- For unknown topics: redirect to `info@gospel-forum.de`
- For pastoral concerns: redirect to the in-person team
- Always respond in German, friendly tone, with Markdown formatting

**To update the knowledge base:** Edit the `SYSTEM_PROMPT` constant in `src/app/api/chat/route.ts`. Add new sections using the `=== SECTION NAME ===` format.

## Key Files

| File | Purpose |
|---|---|
| `src/app/api/chat/route.ts` | API route with Anthropic SDK, system prompt, knowledge base |
| `src/hooks/use-chat.ts` | Client-side chat state, fetch + SSE streaming logic |
| `src/lib/chat-data.ts` | TypeScript types (`Message`), quick chip definitions |
| `src/components/chat-area.tsx` | Scrollable message container with auto-scroll |
| `src/components/chat-input.tsx` | Textarea with auto-resize, send button, footer |
| `src/components/chat-message.tsx` | Message bubbles with timestamps and follow-up chips |
| `src/components/markdown-text.tsx` | Simple Markdown renderer (bold, links, bullet lists) |
| `src/app/globals.css` | Tailwind config, CSS variables, brand colors, animations |

## Coding Conventions

- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 — utility classes, no CSS modules
- **Package Manager:** pnpm (do not use npm or yarn)
- **Router:** Next.js App Router (not Pages Router)
- **Components:** Functional components with `'use client'` directive where needed
- **Imports:** Use `@/` path alias (maps to `src/`)
- **Formatting:** Single quotes, no semicolons, 2-space indent

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude. Set in `.env.local` (never commit) |

## Commands

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```
