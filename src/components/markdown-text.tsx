'use client'

// Renders chat message content with basic markdown:
// **bold**, [link](url), bullet lists, line breaks

import type { ReactNode } from 'react'

interface MarkdownTextProps {
  content: string
}

export function MarkdownText({ content }: MarkdownTextProps) {
  const lines = content.split('\n')

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line === '') return <div key={i} className="h-1" />

        // Bullet point
        if (line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-[#C8102E] mt-0.5 flex-shrink-0">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          )
        }

        return <p key={i} className="leading-relaxed">{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string): ReactNode {
  // Process: [text](url), **bold**
  const parts: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for link [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

    const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity

    if (!linkMatch && !boldMatch) {
      parts.push(remaining)
      break
    }

    if (linkIndex <= boldIndex && linkMatch) {
      // Text before the link
      if (linkIndex > 0) {
        parts.push(remaining.slice(0, linkIndex))
      }
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C8102E] hover:underline font-medium"
        >
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkIndex + linkMatch[0].length)
    } else if (boldMatch) {
      // Text before bold
      if (boldIndex > 0) {
        parts.push(remaining.slice(0, boldIndex))
      }
      parts.push(
        <strong key={key++} className="font-semibold text-[#111111]">
          {boldMatch[1]}
        </strong>
      )
      remaining = remaining.slice(boldIndex + boldMatch[0].length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return <>{parts}</>
}
