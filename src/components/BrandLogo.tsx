import React from 'react';

interface BrandLogoProps {
  onClick?: () => void;
  size?: 'compact' | 'nav' | 'normal' | 'large';
  theme?: 'dark' | 'light';
  className?: string;
}

export function BrandLogo({ onClick, size = 'large', theme = 'dark', className = '' }: BrandLogoProps) {
  let iconDimensions = 'w-12 h-12 sm:w-14 sm:h-14';
  let svgDimensions = 'w-6 h-6 sm:w-7 sm:h-7';
  let textDimensions = 'text-xl sm:text-2xl';
  let gapClass = 'gap-2.5 sm:gap-3';

  if (size === 'nav') {
    iconDimensions = 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10';
    svgDimensions = 'w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5';
    textDimensions = 'text-[15px] sm:text-lg md:text-xl';
    gapClass = 'gap-2 sm:gap-2.5';
  } else if (size === 'compact') {
    iconDimensions = 'w-7 h-7 sm:w-8 sm:h-8';
    svgDimensions = 'w-3.5 h-3.5 sm:w-4 sm:h-4';
    textDimensions = 'text-sm sm:text-base';
    gapClass = 'gap-1.5 sm:gap-2';
  } else if (size === 'normal') {
    iconDimensions = 'w-10 h-10 sm:w-11 sm:h-11';
    svgDimensions = 'w-5 h-5 sm:w-5.5 sm:h-5.5';
    textDimensions = 'text-lg sm:text-xl';
    gapClass = 'gap-2 sm:gap-2.5';
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={onClick}
      className={`flex items-center ${gapClass} group cursor-pointer focus:outline-none transition-transform hover:scale-105 text-left flex-shrink-0 whitespace-nowrap ${className}`}
      aria-label="Hutchforge Home"
    >
      {/* Fluid stylized double-arc logo badge */}
      <div
        className={`${iconDimensions} rounded-full flex-shrink-0 ${
          isLight
            ? 'bg-[#111111] border border-black/10 text-white shadow-md group-hover:bg-[#1368e6]'
            : 'bg-[#0d0d0d] border border-white/20 text-white group-hover:border-[#1368e6] group-hover:bg-[#1368e6]/15 shadow-xl'
        } flex items-center justify-center transition-all duration-300`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${svgDimensions} text-white group-hover:text-white transition-colors`}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14c2-4 5-6 8-6s6 2 8 6" />
          <path d="M4 18c2-4 5-6 8-6s6 2 8 6" />
        </svg>
      </div>
      <span
        className={`font-black ${textDimensions} tracking-[-0.04em] ${
          isLight ? 'text-[#111111]' : 'text-white'
        } lowercase font-sans select-none`}
      >
        hutchforge
      </span>
    </button>
  );
}
