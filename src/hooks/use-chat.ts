'use client'

import { useState, useCallback } from 'react'
import type { Message } from '@/lib/chat-data'
import { getResponse } from '@/lib/chat-data'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setHasStarted(true)
    setIsTyping(true)

    // Simulate typing delay between 1–2s
    const delay = 1000 + Math.random() * 800

    await new Promise((resolve) => setTimeout(resolve, delay))

    const { content, followUpChips } = getResponse(text)

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      followUpChips: followUpChips.length > 0 ? followUpChips : undefined,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }, [isTyping])

  return { messages, isTyping, hasStarted, sendMessage }
}
