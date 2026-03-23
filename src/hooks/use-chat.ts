'use client'

import { useState, useCallback, useRef } from 'react'
import type { Message } from '@/lib/chat-data'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

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

    // Build conversation history for the API
    const apiMessages = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const assistantId = crypto.randomUUID()

    try {
      abortRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Kein Stream verfügbar')

      const decoder = new TextDecoder()
      let accumulated = ''

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)

          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)

            if (parsed.error) {
              throw new Error(parsed.error)
            }

            if (parsed.text) {
              accumulated += parsed.text
              const currentContent = accumulated
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, content: currentContent }
                    : msg
                )
              )
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue
            throw e
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return

      const errorContent =
        'Es tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es erneut oder wende dich direkt an unser Team unter **info@gospel-forum.de**.'

      setMessages((prev) => {
        const existing = prev.find((msg) => msg.id === assistantId)
        if (existing) {
          return prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: errorContent } : msg
          )
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: 'assistant' as const,
            content: errorContent,
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsTyping(false)
      abortRef.current = null
    }
  }, [isTyping, messages])

  return { messages, isTyping, hasStarted, sendMessage }
}
