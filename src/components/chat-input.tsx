'use client'

import { useState, useRef, type KeyboardEvent, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    // Clamp to ~4 lines (approx 96px)
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`
  }

  return (
    <div className="bg-[#FAFAF7] border-t border-[#E5E5E0]">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Textarea */}
          <div className="flex-1 bg-white border border-[#E5E5E0] rounded-2xl px-4 py-3 focus-within:border-[#C8102E] transition-colors shadow-sm">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Stell mir eine Frage..."
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-transparent text-[#111111] placeholder:text-[#AAAAAA] text-base focus:outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: '96px' }}
              aria-label="Nachricht eingeben"
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="w-11 h-11 flex-shrink-0 rounded-full bg-[#C8102E] hover:bg-[#a50d26] text-white flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label="Nachricht senden"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-[#AAAAAA] mt-2">
          Dieser Assistent basiert auf KI. Antworten können ungenau sein.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E5E5E0] py-2 px-4">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[#AAAAAA]">
          <span>Gospel Forum Stuttgart · Junghansstr. 9, 70469 Stuttgart</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.gospel-forum.de/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#555555] transition-colors"
          >
            Impressum
          </a>
          <a
            href="https://www.gospel-forum.de/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#555555] transition-colors"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </div>
  )
}
