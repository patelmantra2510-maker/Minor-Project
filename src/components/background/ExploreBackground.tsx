import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const ExploreBackground: React.FC = () => {
  const { x, y } = useMouseParallax(5, 3);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* 1. FAINT AMBIENT RADIANT GLOWS */}
      <div className="absolute top-[6%] left-[10%] w-[380px] h-[380px] bg-emerald-500/[0.04] dark:bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[8%] w-[420px] h-[420px] bg-amber-500/[0.03] dark:bg-amber-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[12%] w-[400px] h-[400px] bg-emerald-600/[0.03] dark:bg-emerald-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* 2. DISCOVERY CURVED EXPLORATION PATHWAYS (SVG, 90% Static / 10% Slow Drift) */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 2400"
      >
        {/* Winding Exploration Route */}
        <path
          d="M 150,140 Q 420,280 620,180 T 1050,420 T 780,850 T 220,1280 T 920,1650 T 450,2150"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          className="animate-explore-path"
        />

        {/* Discovery Milestones along the catalog */}
        <circle cx="150" cy="140" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="150" cy="140" r="4" fill="currentColor" />

        <circle cx="620" cy="180" r="10" stroke="currentColor" strokeWidth="1" />
        <circle cx="620" cy="180" r="3" fill="currentColor" />

        <circle cx="1050" cy="420" r="16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
        <polygon points="1050,412 1054,418 1061,420 1054,422 1050,428 1046,422 1039,420 1046,418" fill="currentColor" />

        <circle cx="780" cy="850" r="12" stroke="currentColor" strokeWidth="1" />
        <circle cx="780" cy="850" r="3.5" fill="currentColor" />

        <circle cx="220" cy="1280" r="15" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="220" cy="1280" r="4.5" fill="currentColor" />

        <circle cx="920" cy="1650" r="14" stroke="currentColor" strokeWidth="1" />
        <circle cx="920" cy="1650" r="4" fill="currentColor" />

        <circle cx="450" cy="2150" r="18" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
        <circle cx="450" cy="2150" r="6" fill="currentColor" />

        {/* Delicate Coordinates Grid Dots */}
        <circle cx="340" cy="480" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="480" cy="620" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="860" cy="310" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="650" cy="1120" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="140" cy="1600" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="820" cy="1980" r="1.5" fill="currentColor" opacity="0.5" />
      </svg>

      {/* 3. SUBTLE FLOATING SCHOLARSHIP DOCUMENT OUTLINES (18–22s Slow Drift) */}

      {/* Document 1: Top Left (Near Hero Title) */}
      <div
        className="absolute top-[8%] left-[4%] sm:left-[6%] opacity-[0.08] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-explore-drift-1"
        style={{ animationDuration: '18s' }}
      >
        <svg width="64" height="84" viewBox="0 0 64 84" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 2,2 L 44,2 L 62,20 L 62,82 L 2,82 Z" strokeLinejoin="round" />
          <path d="M 44,2 L 44,20 L 62,20" strokeLinejoin="round" />
          <line x1="10" y1="28" x2="42" y2="28" strokeLinecap="round" />
          <line x1="10" y1="38" x2="52" y2="38" strokeLinecap="round" />
          <line x1="10" y1="48" x2="46" y2="48" strokeLinecap="round" />
          <line x1="10" y1="58" x2="34" y2="58" strokeLinecap="round" />
          <circle cx="44" cy="68" r="7" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Document 2: Upper Right (Near Filters & Search) */}
      <div
        className="absolute top-[18%] right-[4%] sm:right-[7%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-explore-drift-2 hidden sm:block"
        style={{ animationDuration: '22s' }}
      >
        <svg width="72" height="90" viewBox="0 0 72 90" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="2" y="2" width="68" height="86" rx="4" strokeLinejoin="round" />
          <rect x="6" y="6" width="60" height="78" rx="2" strokeDasharray="3 3" strokeWidth="0.8" />
          {/* Certificate Seal & Ribbon */}
          <circle cx="36" cy="30" r="10" />
          <path d="M 36,24 L 38,28 L 43,28 L 39,31 L 41,36 L 36,33 L 31,36 L 33,31 L 29,28 L 34,28 Z" fill="currentColor" />
          <line x1="16" y1="50" x2="56" y2="50" strokeLinecap="round" />
          <line x1="20" y1="58" x2="52" y2="58" strokeLinecap="round" />
          <line x1="24" y1="66" x2="48" y2="66" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Document 3: Mid-Left (Near Scholarship Card Grid) */}
      <div
        className="absolute top-[48%] left-[3%] sm:left-[5%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-explore-drift-1"
        style={{ animationDuration: '20s', animationDelay: '3s' }}
      >
        <svg width="60" height="76" viewBox="0 0 60 76" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Open Catalog / Booklet Silhouette */}
          <path d="M 4,8 Q 30,2 30,12 Q 30,2 56,8 L 56,68 Q 30,62 30,72 Q 30,62 4,68 Z" strokeLinejoin="round" />
          <line x1="30" y1="12" x2="30" y2="72" strokeLinecap="round" />
          <line x1="10" y1="22" x2="24" y2="22" strokeLinecap="round" />
          <line x1="10" y1="32" x2="24" y2="32" strokeLinecap="round" />
          <line x1="10" y1="42" x2="20" y2="42" strokeLinecap="round" />
          <line x1="36" y1="22" x2="50" y2="22" strokeLinecap="round" />
          <line x1="36" y1="32" x2="50" y2="32" strokeLinecap="round" />
          <line x1="36" y1="42" x2="46" y2="42" strokeLinecap="round" />
        </svg>
      </div>

      {/* Document 4: Lower Right (Near Bottom Cards) */}
      <div
        className="absolute top-[75%] right-[5%] sm:right-[8%] opacity-[0.08] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-explore-drift-2 hidden md:block"
        style={{ animationDuration: '21s', animationDelay: '1.5s' }}
      >
        <svg width="68" height="86" viewBox="0 0 68 86" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="2" y="2" width="64" height="82" rx="3" strokeLinejoin="round" />
          <line x1="12" y1="16" x2="44" y2="16" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="12" y="26" width="6" height="6" rx="1" />
          <line x1="22" y1="30" x2="52" y2="30" strokeLinecap="round" />
          <rect x="12" y="40" width="6" height="6" rx="1" />
          <path d="M 13,43 L 15,45 L 19,41" strokeWidth="1" strokeLinecap="round" />
          <line x1="22" y1="44" x2="48" y2="44" strokeLinecap="round" />
          <rect x="12" y="54" width="6" height="6" rx="1" />
          <line x1="22" y1="58" x2="44" y2="58" strokeLinecap="round" />
          <circle cx="48" cy="68" r="7" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* 4. MUTED GOLD ACCENT PARTICLES (6 Delicate Sparks, 12–20s Cycle) */}
      {/* Particle 1: Top Right */}
      <div
        className="absolute top-[10%] right-[15%] opacity-[0.22] dark:opacity-[0.14] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '11s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 2: Upper Left (Below Hero) */}
      <div
        className="absolute top-[24%] left-[10%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '14s', animationDelay: '2s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Particle 3: Mid Right */}
      <div
        className="absolute top-[44%] right-[11%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow hidden sm:block"
        style={{ animationDuration: '12s', animationDelay: '3.5s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 4: Mid Left */}
      <div
        className="absolute top-[64%] left-[8%] opacity-[0.18] dark:opacity-[0.10] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '15s', animationDelay: '5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Particle 5: Lower Right */}
      <div
        className="absolute top-[82%] right-[14%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '13s', animationDelay: '1.5s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 6: Bottom Left */}
      <div
        className="absolute bottom-[6%] left-[18%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '16s', animationDelay: '4s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>
    </div>
  );
};

