'use client'

import type { Message } from '@/lib/chat-data'
import { MarkdownText } from '@/components/markdown-text'

interface ChatMessageProps {
  message: Message
  onFollowUpClick?: (text: string) => void
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)

  if (diffSec < 10) return 'gerade eben'
  if (diffMin < 1) return `vor ${diffSec} Sek.`
  if (diffMin === 1) return 'vor 1 Min.'
  if (diffMin < 60) return `vor ${diffMin} Min.`
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ message, onFollowUpClick }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 message-enter ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar — only for assistant */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
          aria-hidden="true"
        >
          G
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-base leading-relaxed ${
            isUser
              ? 'bg-[#EDEDEA] text-[#111111] rounded-tr-sm'
              : 'bg-white text-[#111111] rounded-tl-sm shadow-sm border border-[#E5E5E0]'
          }`}
        >
          {isUser ? (
            <p className="leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownText content={message.content} />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-[#999999] px-1">
          {formatTimestamp(message.timestamp)}
        </span>

        {/* Follow-up chips */}
        {!isUser && message.followUpChips && message.followUpChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 px-1">
            {message.followUpChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => onFollowUpClick?.(chip)}
                className="text-xs bg-white border border-[#C8102E]/30 hover:bg-[#C8102E]/5 hover:border-[#C8102E] text-[#111111] rounded-lg px-3 py-1.5 transition-all duration-150 font-medium shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
