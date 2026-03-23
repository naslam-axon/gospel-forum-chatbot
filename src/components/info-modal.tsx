'use client'

import { X } from 'lucide-react'
import { GospelForumLogo } from '@/components/gospel-forum-logo'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F0] text-[#555555] hover:text-[#111111] transition-colors"
          aria-label="Modal schließen"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <GospelForumLogo />
        </div>

        <h2
          id="info-modal-title"
          className="text-lg font-bold text-[#111111] mb-3"
        >
          Was kann ich für dich tun?
        </h2>

        <p className="text-[#555555] text-sm leading-relaxed mb-4">
          Ich bin der digitale Assistent des Gospel Forums. Ich kann dir bei Fragen zu unserer Gemeinde, Veranstaltungen, Gruppen und Glaubensthemen helfen.
        </p>

        <div className="bg-[#FAFAF7] border border-[#E5E5E0] rounded-xl p-3 mb-5">
          <p className="text-[#555555] text-xs leading-relaxed">
            <strong className="text-[#111111]">Hinweis:</strong> Ich bin eine KI und ersetze kein persönliches Gespräch. Bei seelsorgerischen Anliegen wende dich bitte direkt an unser Team.
          </p>
        </div>

        <a
          href="https://www.gospel-forum.de/connect"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[#C8102E] text-sm font-medium hover:underline mb-4"
        >
          Kontakt aufnehmen →
        </a>

        <button
          onClick={onClose}
          className="w-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          Verstanden
        </button>
      </div>
    </div>
  )
}
