import React from 'react';
import { useMouseParallax } from './useMouseParallax';

interface SavedBackgroundProps {
  hasSavedItems?: boolean;
}

export const SavedBackground: React.FC<SavedBackgroundProps> = ({ hasSavedItems = false }) => {
  const { x, y } = useMouseParallax(6, 4);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* 1. Subtle Archival Ledger Grid & Shelf Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="saved-ledger-pattern" width="120" height="90" patternUnits="userSpaceOnUse">
            {/* Shelf line */}
            <line x1="0" y1="89" x2="120" y2="89" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
            {/* Ledger divider ticks */}
            <line x1="20" y1="84" x2="20" y2="89" stroke="currentColor" strokeWidth="1" />
            <line x1="80" y1="84" x2="80" y2="89" stroke="currentColor" strokeWidth="1" />
            {/* Tiny archival coordinate dot */}
            <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="80" cy="50" r="1" fill="currentColor" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#saved-ledger-pattern)" />
      </svg>

      {/* 2. Top-Right: Curated Dossier Folder Outline */}
      <div
        className={`absolute top-[8%] right-[4%] sm:right-[7%] w-64 sm:w-80 h-44 sm:h-52 transition-opacity duration-700 animate-saved-dossier ${
          hasSavedItems ? 'opacity-[0.08] dark:opacity-[0.11]' : 'opacity-[0.14] dark:opacity-[0.09]'
        }`}
      >
        <svg viewBox="0 0 320 200" fill="none" className="w-full h-full text-[#064E3B] dark:text-emerald-400">
          {/* Back folder tab */}
          <path
            d="M 20 50 L 100 50 L 120 70 L 300 70 A 8 8 0 0 1 308 78 L 308 190 A 8 8 0 0 1 300 198 L 20 198 A 8 8 0 0 1 12 190 L 12 58 A 8 8 0 0 1 20 50 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="currentColor"
            fillOpacity="0.04"
          />
          {/* Front folder flap angled */}
          <path
            d="M 12 90 L 308 85 L 298 198 L 22 198 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            fill="currentColor"
            fillOpacity="0.02"
          />
          {/* Document sheets inside */}
          <rect x="35" y="30" width="220" height="150" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" fill="none" />
          <line x1="55" y1="55" x2="160" y2="55" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="55" y1="70" x2="220" y2="70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="55" y1="85" x2="195" y2="85" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          {/* Gold foil paperclip */}
          <path
            d="M 200 20 L 200 45 C 200 50, 212 50, 212 45 L 212 16 C 212 9, 192 9, 192 16 L 192 48"
            stroke="#D97706"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 3. Top-Left: Bookmark Satin Ribbon with Gold Foil Tip */}
      <div
        className="absolute top-[4%] left-[6%] sm:left-[9%] w-16 sm:w-20 h-48 transition-opacity duration-500 animate-saved-ribbon text-amber-600 dark:text-amber-400 opacity-[0.14] dark:opacity-[0.10]"
      >
        <svg viewBox="0 0 60 180" fill="none" className="w-full h-full">
          {/* Ribbon body */}
          <path
            d="M 10 0 L 50 0 L 50 145 L 30 125 L 10 145 Z"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          {/* Ribbon stitching detail */}
          <line x1="16" y1="6" x2="16" y2="128" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="44" y1="6" x2="44" y2="128" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          {/* Gold star seal at ribbon tip */}
          <circle cx="30" cy="50" r="12" fill="#D97706" fillOpacity="0.18" stroke="#D97706" strokeWidth="1.2" />
          <path
            d="M 30 42 L 32.5 48 L 38 48.5 L 34 52.5 L 35 58 L 30 55 L 25 58 L 26 52.5 L 22 48.5 L 27.5 48 Z"
            fill="#D97706"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* 4. Bottom-Left: Open Archive Ledger & Index Tabs */}
      <div
        className="absolute bottom-[10%] left-[3%] sm:left-[6%] w-56 sm:w-72 h-44 transition-opacity duration-700 animate-saved-dossier text-[#064E3B] dark:text-emerald-400 opacity-[0.09] dark:opacity-[0.10]"
        style={{ animationDelay: '-6s' }}
      >
        <svg viewBox="0 0 280 180" fill="none" className="w-full h-full">
          {/* Ledger spine and pages */}
          <path
            d="M 140 160 C 90 155, 30 145, 15 130 L 15 25 C 30 40, 90 50, 140 55 C 190 50, 250 40, 265 25 L 265 130 C 250 145, 190 155, 140 160 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="currentColor"
            fillOpacity="0.03"
          />
          {/* Center spine */}
          <line x1="140" y1="55" x2="140" y2="160" stroke="currentColor" strokeWidth="1.8" />
          {/* Page lines left */}
          <line x1="35" y1="55" x2="120" y2="65" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          <line x1="35" y1="75" x2="120" y2="85" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          <line x1="35" y1="95" x2="110" y2="105" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          <line x1="35" y1="115" x2="115" y2="125" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          {/* Page lines right */}
          <line x1="160" y1="65" x2="245" y2="55" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          <line x1="160" y1="85" x2="245" y2="75" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          <line x1="160" y1="105" x2="235" y2="95" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
          {/* Index marker tab sticking out */}
          <rect x="250" y="55" width="22" height="18" rx="2" fill="#D97706" fillOpacity="0.25" stroke="#D97706" strokeWidth="1" />
        </svg>
      </div>

      {/* 5. Center-Right: Secondary Bookmark Ribbon */}
      <div
        className="absolute top-[48%] right-[10%] sm:right-[15%] w-12 sm:w-14 h-32 transition-opacity duration-500 animate-saved-ribbon text-stone-500 dark:text-emerald-500 opacity-[0.08] dark:opacity-[0.07]"
        style={{ animationDelay: '-8s' }}
      >
        <svg viewBox="0 0 40 120" fill="none" className="w-full h-full">
          <path
            d="M 5 0 L 35 0 L 35 105 L 20 90 L 5 105 Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* 6. Curated Golden Star Pins (★) Marking Saved Coordinates */}
      <div className="absolute top-[22%] left-[28%] animate-saved-star text-amber-500/50 dark:text-amber-400/40">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>

      <div className="absolute bottom-[28%] right-[24%] animate-saved-star text-amber-500/45 dark:text-amber-400/35" style={{ animationDelay: '-4s' }}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>

      <div className="absolute top-[68%] left-[14%] animate-saved-star text-amber-500/30 dark:text-amber-400/25" style={{ animationDelay: '-2s' }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
      </div>

      {/* 7. Ambient Gold Glow Particles */}
      <div className="absolute top-[18%] left-[45%] w-2 h-2 rounded-full bg-amber-400/35 dark:bg-amber-300/25 blur-[1px] animate-gold-glow" style={{ animationDuration: '14s' }} />
      <div className="absolute top-[60%] right-[35%] w-2.5 h-2.5 rounded-full bg-amber-400/30 dark:bg-amber-300/20 blur-[1px] animate-gold-glow" style={{ animationDuration: '18s', animationDelay: '-5s' }} />
      <div className="absolute bottom-[16%] left-[38%] w-1.5 h-1.5 rounded-full bg-emerald-400/30 dark:bg-emerald-300/20 blur-[1px] animate-gold-glow" style={{ animationDuration: '12s', animationDelay: '-9s' }} />
    </div>
  );
};
