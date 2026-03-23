'use client'

interface WelcomeScreenProps {
  onChipClick: (text: string) => void
}

const chips = [
  { emoji: '🕐', label: 'Wann ist der nächste Gottesdienst?' },
  { emoji: '🙏', label: 'Was glaubt ihr als Gemeinde?' },
  { emoji: '👥', label: 'Wie finde ich eine Kleingruppe?' },
  { emoji: '🎉', label: 'Welche Events stehen an?' },
  { emoji: '💬', label: 'Wie kann ich mich taufen lassen?' },
  { emoji: '📍', label: 'Wo finde ich euch?' },
]

export function WelcomeScreen({ onChipClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 text-center">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#111111] mb-3 text-balance">
          Hallo! 👋
        </h1>
        <p className="font-serif text-[#555555] text-lg leading-relaxed max-w-sm text-balance">
          Ich bin der digitale Assistent des Gospel Forums. Stell mir eine Frage — ich helfe dir gerne weiter.
        </p>
      </div>

      {/* Quick chips */}
      <div className="w-full max-w-md">
        <p className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-3">
          Häufige Fragen
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chips.map((chip, index) => (
            <button
              key={index}
              onClick={() => onChipClick(chip.label)}
              className="flex items-center gap-2.5 text-left bg-white border border-[#C8102E]/30 hover:bg-[#C8102E]/5 hover:border-[#C8102E] rounded-xl px-4 py-3 text-sm text-[#111111] font-medium transition-all duration-150 shadow-sm hover:shadow-md"
              style={{
                animationDelay: `${index * 60}ms`,
              }}
            >
              <span className="text-base flex-shrink-0">{chip.emoji}</span>
              <span className="leading-snug">{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
