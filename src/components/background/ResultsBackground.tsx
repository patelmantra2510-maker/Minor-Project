import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const ResultsBackground: React.FC = () => {
  const { x, y } = useMouseParallax(5, 3);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* ========================================================================= */}
      {/* 1. FAINT AMBIENT RADIANT GLOWS                                           */}
      {/* ========================================================================= */}
      <div className="absolute top-[8%] left-[15%] w-96 h-96 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[420px] h-[420px] bg-amber-500/[0.03] dark:bg-amber-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] left-[8%] w-[400px] h-[400px] bg-emerald-600/[0.03] dark:bg-emerald-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 2. MATCHING & CONNECTIONS CONSTELLATION NETWORK (SVG)                     */}
      {/* Theme: Student Profile → Eligibility Criteria → Matching Schemes → Future */}
      {/* ========================================================================= */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-[0.07] dark:opacity-[0.06] text-[#064E3B] dark:text-emerald-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 2400"
      >
        {/* Main Flow Spine: Hero to Bottom Opportunity */}
        <path
          d="M 600,120 C 450,280 200,420 300,720 S 950,1050 820,1380 S 320,1750 480,2050 S 750,2250 600,2360"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          className="animate-match-dash"
        />

        {/* Branch 1: Location & Education Input to Matching Hub */}
        <path
          d="M 180,240 Q 380,320 600,120"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M 1020,240 Q 820,320 600,120"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Branch 2: Criteria Cross-Connectors */}
        <path
          d="M 300,720 Q 550,680 720,760"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
        <path
          d="M 720,760 Q 880,880 950,1050"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Branch 3: Verification Junction */}
        <path
          d="M 300,720 Q 220,980 420,1180 T 820,1380"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          className="animate-match-dash"
        />

        {/* Branch 4: Opportunity Web */}
        <path
          d="M 820,1380 Q 980,1540 860,1780 T 480,2050"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 7"
        />

        {/* ----------------- CONNECTION NODES & CHECKMARKS ----------------- */}
        {/* Node 1: Student Source (Top Center) */}
        <circle cx="600" cy="120" r="16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="600" cy="120" r="6" fill="currentColor" className="animate-node-pulse" />

        {/* Node 2: Location/Domicile (Top Left) */}
        <circle cx="180" cy="240" r="12" stroke="currentColor" strokeWidth="1" />
        <circle cx="180" cy="240" r="4" fill="currentColor" />

        {/* Node 3: Academic Merit (Top Right) */}
        <circle cx="1020" cy="240" r="12" stroke="currentColor" strokeWidth="1" />
        <circle cx="1020" cy="240" r="4" fill="currentColor" />

        {/* Node 4: Strong Match Verified Node (Mid Upper Left) */}
        <circle cx="300" cy="720" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M 294,720 L 298,724 L 307,715"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node 5: Possible Match Condition Check Node (Mid Upper Center) */}
        <circle cx="720" cy="760" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="720" cy="760" r="3.5" fill="currentColor" />

        {/* Node 6: Income & Category Verification Hub (Mid Right) */}
        <circle cx="950" cy="1050" r="16" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M 944,1050 L 948,1054 L 957,1045"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node 7: Scholarship Application Opportunity Node (Mid Lower) */}
        <circle cx="820" cy="1380" r="20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="820" cy="1380" r="7" fill="currentColor" className="animate-node-pulse" />

        {/* Node 8: Verified Opportunity Star (Lower Left) */}
        <polygon
          points="480,2036 484,2046 495,2050 484,2054 480,2064 476,2054 465,2050 476,2046"
          fill="currentColor"
          className="text-amber-500/70"
        />

        {/* Node 9: Catalog Gateway (Bottom Center) */}
        <circle cx="600" cy="2360" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="600" cy="2360" r="4" fill="currentColor" />
      </svg>

      {/* ========================================================================= */}
      {/* 3. SUBTLE FLOATING MATCHING ACCENT EMBLEMS                                */}
      {/* ========================================================================= */}

      {/* Emblem 1: Top-Left Floating Match Badge (Criteria Connected) */}
      <div
        className="absolute top-[14%] left-[4%] sm:left-[6%] opacity-[0.08] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-match-float"
        style={{ animationDuration: '16s' }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Hexagonal Shield */}
          <polygon points="28,4 50,16 50,40 28,52 6,40 6,16" strokeLinejoin="round" />
          <polygon points="28,9 45,19 45,37 28,47 11,37 11,19" strokeDasharray="2 2" />
          {/* Centered Match Check */}
          <path d="M 20,28 L 26,34 L 36,22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Emblem 2: Middle-Right Floating Opportunity Seal */}
      <div
        className="absolute top-[42%] right-[4%] sm:right-[7%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-match-float hidden sm:block"
        style={{ animationDuration: '18s', animationDelay: '2s' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="30" cy="30" r="26" strokeDasharray="3 3" />
          <circle cx="30" cy="30" r="20" />
          {/* Scholarship Cap Silhouette */}
          <path d="M 18,27 L 30,22 L 42,27 L 30,32 Z" strokeLinejoin="round" />
          <path d="M 23,29.5 V 35 C 23,38 37,38 37,35 V 29.5" />
          <path d="M 42,27 V 34" strokeLinecap="round" />
        </svg>
      </div>

      {/* Emblem 3: Lower-Left Verified Criteria Token */}
      <div
        className="absolute top-[68%] left-[5%] sm:left-[8%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-match-float"
        style={{ animationDuration: '15s', animationDelay: '4s' }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="4" y="4" width="44" height="44" rx="10" strokeLinejoin="round" />
          <line x1="14" y1="18" x2="38" y2="18" strokeLinecap="round" />
          <line x1="14" y1="26" x2="32" y2="26" strokeLinecap="round" />
          <line x1="14" y1="34" x2="24" y2="34" strokeLinecap="round" />
          <circle cx="34" cy="34" r="5" stroke="currentColor" />
          <path d="M 32,34 L 33.5,35.5 L 36,33" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. MUTED GOLD ACCENT PARTICLES (6 Delicate Sparks, 10–20s Drift)          */}
      {/* ========================================================================= */}

      {/* Particle 1: Top Right */}
      <div
        className="absolute top-[12%] right-[16%] opacity-[0.24] dark:opacity-[0.14] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '10s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 2: Upper Left (Below Hero) */}
      <div
        className="absolute top-[26%] left-[11%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '13s', animationDelay: '1.5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Particle 3: Mid Right (Near Matches) */}
      <div
        className="absolute top-[48%] right-[12%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-gold-glow hidden sm:block"
        style={{ animationDuration: '11s', animationDelay: '3s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 4: Mid Left (Near Possible Matches) */}
      <div
        className="absolute top-[62%] left-[9%] opacity-[0.18] dark:opacity-[0.10] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '14s', animationDelay: '4.5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Particle 5: Lower Right */}
      <div
        className="absolute top-[80%] right-[15%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Particle 6: Near Bottom Explore CTA */}
      <div
        className="absolute bottom-[5%] left-[20%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '15s', animationDelay: '5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>
    </div>
  );
};

