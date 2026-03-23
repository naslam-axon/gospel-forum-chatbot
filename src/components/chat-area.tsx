'use client'

import { useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/chat-message'
import { TypingIndicator } from '@/components/typing-indicator'
import { WelcomeScreen } from '@/components/welcome-screen'
import type { Message } from '@/lib/chat-data'

interface ChatAreaProps {
  messages: Message[]
  isTyping: boolean
  hasStarted: boolean
  onChipClick: (text: string) => void
}

export function ChatArea({ messages, isTyping, hasStarted, onChipClick }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto chat-scroll">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {!hasStarted ? (
          <WelcomeScreen onChipClick={onChipClick} />
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onFollowUpClick={onChipClick}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  )
}
