import React from 'react';

interface BrandLogoProps {
  onClick?: () => void;
  size?: 'normal' | 'large';
  theme?: 'dark' | 'light';
  className?: string;
}

export function BrandLogo({ onClick, size = 'large', theme = 'dark', className = '' }: BrandLogoProps) {
  const iconDimensions = size === 'large' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-12 sm:h-12';
  const svgDimensions = size === 'large' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6';
  const textDimensions = size === 'large' ? 'text-2xl sm:text-[28px]' : 'text-xl sm:text-2xl';

  const isLight = theme === 'light';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 sm:gap-3.5 group cursor-pointer focus:outline-none transition-transform hover:scale-105 text-left ${className}`}
      aria-label="Hutchforge Home"
    >
      {/* Fluid stylized double-arc logo badge */}
      <div
        className={`${iconDimensions} rounded-full ${
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
        } lowercase font-sans`}
      >
        hutchforge
      </span>
    </button>
  );
}
