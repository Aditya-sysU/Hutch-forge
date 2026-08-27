import React from 'react';

interface VyvhrLookbookBannerProps {
  className?: string;
}

export function VyvhrLookbookBanner({ className = '' }: VyvhrLookbookBannerProps) {
  return (
    <div className={`relative w-full h-full bg-[#FFFFFF] overflow-hidden flex items-center justify-between px-2 sm:px-6 select-none ${className}`}>
      {/* Studio Lighting Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(240,240,240,0.8)_100%)]" />

      {/* SVG Canvas depicting the 3 Lookbook Models */}
      <svg
        viewBox="0 0 1000 400"
        className="w-full h-full object-contain relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="tealTee" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="40%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>

          <linearGradient id="darkTee" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>

          <linearGradient id="denimJeans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="skinTone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7b99a" />
            <stop offset="100%" stopColor="#c89270" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* MODEL 1: LEFT - Profile with Headphones in Oversized Turquoise/Teal Tee   */}
        {/* ========================================================================= */}
        <g filter="url(#softShadow)" className="transition-transform duration-500 hover:scale-[1.02] origin-bottom-left">
          {/* Hair & Head Profile */}
          <path
            d="M 60 120 C 40 80, 70 30, 110 30 C 145 30, 165 70, 155 110 C 145 140, 125 150, 105 145 Z"
            fill="#111827"
          />
          {/* Profile Face & Neck */}
          <path
            d="M 125 80 Q 145 85 140 105 Q 135 115 142 120 Q 130 125 130 145 L 120 160 L 95 160 Z"
            fill="url(#skinTone)"
          />
          {/* Over-ear Headphone Band & Ear Cup */}
          <path
            d="M 75 60 C 65 30, 115 15, 125 45"
            stroke="#1f2937"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="75" y="45" width="28" height="42" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />

          {/* Turquoise Oversized Tee Body */}
          <path
            d="M 40 150 L 110 140 L 165 170 L 155 350 L 15 350 L 15 280 L 35 165 Z"
            fill="url(#tealTee)"
          />
          {/* Tee Sleeve with Graphic Pattern */}
          <path
            d="M 15 170 L 65 170 L 55 290 L 5 280 Z"
            fill="#0f766e"
            opacity="0.8"
          />
          {/* Graphic Screenprint on sleeve (VYVHR Pixel Grid) */}
          <g opacity="0.4" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3">
            <line x1="15" y1="200" x2="45" y2="200" />
            <line x1="15" y1="210" x2="50" y2="210" />
            <line x1="20" y1="220" x2="48" y2="220" />
            <line x1="18" y1="230" x2="42" y2="230" />
          </g>
          {/* Arm extending below */}
          <path d="M 5 280 L 45 280 L 55 380 L 25 380 Z" fill="url(#skinTone)" />
        </g>

        {/* ========================================================================= */}
        {/* MODEL 2: CENTER - Rear View in Black Streetwear Graphic Tee & Jeans       */}
        {/* ========================================================================= */}
        <g filter="url(#softShadow)" className="transition-transform duration-500 hover:scale-[1.02] origin-bottom">
          {/* Head & Curly Hair from behind */}
          <circle cx="500" cy="140" r="22" fill="#09090b" />
          <path d="M 480 135 C 475 120, 525 120, 520 135 C 525 155, 475 155, 480 135 Z" fill="#18181b" />

          {/* Black Oversized Tee Body */}
          <path
            d="M 455 170 C 475 162, 525 162, 545 170 L 565 240 L 545 275 L 455 275 L 435 240 Z"
            fill="url(#darkTee)"
          />

          {/* White Matrix/Digital Graphic Art on Back */}
          <g transform="translate(470, 185)" opacity="0.85">
            <rect x="10" y="5" width="40" height="45" rx="3" fill="none" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4 2" />
            <path
              d="M 15 15 L 45 15 M 15 22 L 35 22 M 20 30 L 45 30 M 15 38 L 40 38 M 25 45 L 35 45"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx="30" cy="27" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Mint/Sage Shirt Wrapped at Waist */}
          <path
            d="M 452 270 L 548 270 L 542 320 L 460 330 L 452 310 Z"
            fill="#a7f3d0"
            opacity="0.9"
          />
          <path d="M 452 285 L 440 350 L 455 355 L 462 295 Z" fill="#6ee7b7" />

          {/* Baggy Denim Jeans */}
          <path
            d="M 462 315 L 495 320 L 493 395 L 465 395 Z"
            fill="url(#denimJeans)"
          />
          <path
            d="M 505 320 L 538 315 L 535 395 L 507 395 Z"
            fill="url(#denimJeans)"
          />

          {/* Sneaker Soles */}
          <rect x="460" y="390" width="30" height="8" rx="4" fill="#f4f4f5" />
          <rect x="508" y="390" width="30" height="8" rx="4" fill="#f4f4f5" />
        </g>

        {/* ========================================================================= */}
        {/* MODEL 3: RIGHT - Close-up with Headphones in Black Tee with Floral Graphic */}
        {/* ========================================================================= */}
        <g filter="url(#softShadow)" className="transition-transform duration-500 hover:scale-[1.02] origin-bottom-right">
          {/* Over-ear Headphones Large Angle */}
          <ellipse cx="780" cy="80" rx="45" ry="60" fill="#09090b" stroke="#27272a" strokeWidth="4" />
          <path d="M 760 30 C 760 0, 840 0, 850 30" stroke="#18181b" strokeWidth="14" fill="none" strokeLinecap="round" />

          {/* Large Black Streetwear Shirt Silhouette */}
          <path
            d="M 710 130 C 760 80, 880 70, 990 100 L 1000 400 L 680 400 L 695 240 Z"
            fill="#09090b"
          />

          {/* Blue-Grey Illustrative Graphic Florals / Tribal Art Print on Chest */}
          <g transform="translate(710, 140)" opacity="0.9">
            {/* Organic Floral Print Curves */}
            <path
              d="M 20 40 C 40 10, 80 30, 90 60 C 100 90, 70 120, 40 100 C 20 90, 10 60, 20 40 Z"
              fill="#27272a"
              stroke="#93c5fd"
              strokeWidth="2.5"
            />
            <path
              d="M 70 70 C 90 50, 130 60, 140 90 C 150 120, 120 150, 90 130 C 70 120, 60 90, 70 70 Z"
              fill="#3f3f46"
              stroke="#60a5fa"
              strokeWidth="2.5"
            />
            <path
              d="M 40 120 C 60 90, 110 110, 120 140 C 130 170, 90 200, 60 180 C 40 160, 30 140, 40 120 Z"
              fill="#18181b"
              stroke="#93c5fd"
              strokeWidth="2"
            />
            <path
              d="M 90 140 C 120 110, 160 130, 170 170 C 180 200, 140 230, 110 210 Z"
              fill="#27272a"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <path
              d="M 30 200 C 60 170, 100 190, 110 220 C 120 250, 80 280, 50 260 Z"
              fill="#18181b"
              stroke="#93c5fd"
              strokeWidth="1.5"
            />
          </g>
        </g>

        {/* Minimalist Lookbook Watermark / Metadata in Studio Corner */}
        <text x="30" y="380" fill="#9ca3af" fontSize="11" fontFamily="monospace" letterSpacing="2">
          VYVHR // OFFICIAL COLLECTION LOOKBOOK
        </text>
      </svg>

      {/* Floating Modern Editorial Pill */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-black/10 text-[10px] font-mono text-white tracking-widest uppercase z-20">
        AUTUMN / WINTER DROP
      </div>
    </div>
  );
}
