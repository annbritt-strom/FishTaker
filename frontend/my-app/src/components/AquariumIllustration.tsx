const AquariumIllustration = () => {
  return (
    <svg
      viewBox="0 0 240 180"
      className="h-40 w-auto sm:h-48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* tank glass */}
      <rect x="20" y="30" width="200" height="120" rx="14" className="fill-sky-50" />
      <rect x="20" y="30" width="200" height="120" rx="14" className="stroke-sky-200" strokeWidth="2" />

      {/* water surface line */}
      <path
        d="M28 46 Q45 40 62 46 T96 46 T130 46 T164 46 T198 46 T212 46"
        className="stroke-sky-300"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* substrate */}
      <path
        d="M20 138 Q60 128 100 136 T180 134 T220 138 V150 H20 Z"
        className="fill-sky-100"
      />

      {/* soft plant fronds */}
      <path d="M52 138 C48 120 58 108 50 92" className="stroke-emerald-200" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M60 138 C64 122 56 112 62 98" className="stroke-emerald-200" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M182 138 C186 118 176 106 184 90" className="stroke-emerald-200" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* fish silhouette - accent */}
      <g transform="translate(118 78)">
        <path
          d="M0 8s16-15 32-4c-16 15-32 4-32 4"
          className="fill-orange-400"
          opacity="0.9"
        />
      </g>

      {/* fish silhouette - muted */}
      <g transform="translate(66 108) scale(0.75)">
        <path
          d="M0 8s16-15 32-4c-16 15-32 4-32 4"
          className="fill-sky-300"
        />
      </g>

      {/* bubbles */}
      <circle cx="150" cy="60" r="3" className="fill-sky-200" />
      <circle cx="158" cy="50" r="2" className="fill-sky-200" />
      <circle cx="145" cy="52" r="1.5" className="fill-sky-200" />
      <circle cx="90" cy="64" r="2" className="fill-sky-200" />

      {/* tank stand */}
      <rect x="30" y="150" width="180" height="8" rx="2" className="fill-sky-200" />
    </svg>
  )
}

export default AquariumIllustration
