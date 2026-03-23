'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { GospelForumLogo } from '@/components/gospel-forum-logo'
import { InfoModal } from '@/components/info-modal'

export function ChatHeader() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E5E5E0]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <GospelForumLogo />

          {/* Center: Title + online indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-sm font-semibold text-[#111111] hidden sm:block">
              Gospel Forum Assistent
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" aria-hidden="true" />
              <span className="text-xs text-[#C8102E] font-medium">Online</span>
            </span>
          </div>

          {/* Info button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F0F0EC] text-[#555555] hover:text-[#111111] transition-colors"
            aria-label="Informationen zum Assistenten"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      <InfoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
