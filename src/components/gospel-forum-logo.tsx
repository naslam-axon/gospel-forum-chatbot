// Gospel Forum Logo — SVG recreation matching the brand
export function GospelForumLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      {/* Icon mark — stylised "G" */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="4" fill="#111111" />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fill="white"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          G
        </text>
      </svg>

      {/* Wordmark */}
      <span className="text-[#111111] text-sm tracking-widest uppercase leading-none select-none">
        <span className="font-normal">Gospel</span>
        <span className="font-bold">Forum</span>
      </span>
    </div>
  )
}
