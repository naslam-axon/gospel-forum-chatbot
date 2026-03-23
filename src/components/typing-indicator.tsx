'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-enter">
      {/* Bot avatar */}
      <div
        className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
        aria-hidden="true"
      >
        G
      </div>

      {/* Bubble */}
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#E5E5E0]">
        <div className="flex items-center gap-1.5 h-5" aria-label="Assistent schreibt...">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#C8102E]"
              style={{
                animation: `typingBounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
