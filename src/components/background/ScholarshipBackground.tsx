import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const ScholarshipBackground: React.FC = () => {
  const { x, y } = useMouseParallax(5, 3);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* ========================================================================= */}
      {/* 1. CURVED JOURNEY PATH & MILESTONE NODES                                 */}
      {/* ========================================================================= */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 2000"
      >
        {/* Faint Abstract Journey Path: Discovery → Eligibility → Documents → Application → Opportunity */}
        <path
          d="M 120,80 Q 380,240 220,520 T 780,950 T 260,1380 T 820,1860"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          className="animate-path-drift"
        />

        {/* Milestone Node 1: Discovery (Hero Top-Left) */}
        <circle cx="120" cy="80" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="120" cy="80" r="4" fill="currentColor" />

        {/* Milestone Node 2: Eligibility (Upper Center) */}
        <circle cx="220" cy="520" r="16" stroke="currentColor" strokeWidth="1" />
        <path d="M 215,520 L 219,524 L 227,516" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Milestone Node 3: Documents (Mid Right) */}
        <circle cx="780" cy="950" r="16" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <rect x="774" y="943" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1" />
        <line x1="777" y1="947" x2="783" y2="947" stroke="currentColor" strokeWidth="1" />
        <line x1="777" y1="951" x2="783" y2="951" stroke="currentColor" strokeWidth="1" />

        {/* Milestone Node 4: Application (Lower Left) */}
        <circle cx="260" cy="1380" r="15" stroke="currentColor" strokeWidth="1" />
        <path d="M 256,1384 L 264,1376 M 258,1376 L 264,1376 L 264,1382" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Milestone Node 5: Opportunity (CTA Bottom Right) */}
        <polygon
          points="820,1844 825,1855 836,1860 825,1865 820,1876 815,1865 804,1860 815,1855"
          fill="currentColor"
          className="text-amber-500/60"
        />
      </svg>

      {/* ========================================================================= */}
      {/* 2. FAINT FLOATING SCHOLARSHIP DOCUMENTS                                   */}
      {/* ========================================================================= */}

      {/* Document 1: Top-Left (Near Hero Heading) */}
      <div
        className="absolute top-[6%] left-[3%] sm:left-[5%] opacity-[0.08] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-doc-float-1"
        style={{ animationDuration: '16s' }}
      >
        <svg width="68" height="88" viewBox="0 0 68 88" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Folded Paper Outline */}
          <path d="M 2,2 L 48,2 L 66,20 L 66,86 L 2,86 Z" strokeLinejoin="round" />
          <path d="M 48,2 L 48,20 L 66,20" strokeLinejoin="round" />
          {/* Faint Text Lines */}
          <line x1="12" y1="28" x2="44" y2="28" strokeLinecap="round" />
          <line x1="12" y1="38" x2="54" y2="38" strokeLinecap="round" />
          <line x1="12" y1="48" x2="48" y2="48" strokeLinecap="round" />
          <line x1="12" y1="58" x2="36" y2="58" strokeLinecap="round" />
          {/* Mini Official Stamp Badge */}
          <circle cx="48" cy="70" r="8" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Document 2: Middle-Right (Near Benefits / Documents Section) */}
      <div
        className="absolute top-[36%] right-[3%] sm:right-[6%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-doc-float-2 hidden sm:block"
        style={{ animationDuration: '20s' }}
      >
        <svg width="78" height="96" viewBox="0 0 78 96" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Certificate Style Border */}
          <rect x="2" y="2" width="74" height="92" rx="4" strokeLinejoin="round" />
          <rect x="6" y="6" width="66" height="84" rx="2" strokeDasharray="3 3" strokeWidth="0.8" />
          {/* Certificate Seal & Ribbons */}
          <circle cx="39" cy="30" r="10" />
          <path d="M 39,24 L 41,29 L 46,29 L 42,32 L 44,37 L 39,34 L 34,37 L 36,32 L 32,29 L 37,29 Z" fill="currentColor" />
          <line x1="18" y1="52" x2="60" y2="52" strokeLinecap="round" />
          <line x1="24" y1="60" x2="54" y2="60" strokeLinecap="round" />
          <line x1="28" y1="68" x2="50" y2="68" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Document 3: Lower-Left (Near How to Apply / Dates) */}
      <div
        className="absolute top-[68%] left-[4%] sm:left-[6%] opacity-[0.08] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-doc-float-3"
        style={{ animationDuration: '14s' }}
      >
        <svg width="64" height="82" viewBox="0 0 64 82" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Checklist Application Sheet */}
          <rect x="2" y="2" width="60" height="78" rx="3" strokeLinejoin="round" />
          {/* Header Line */}
          <line x1="10" y1="14" x2="38" y2="14" strokeWidth="1.5" strokeLinecap="round" />
          {/* Item 1 with Checkbox */}
          <rect x="10" y="24" width="6" height="6" rx="1" />
          <line x1="20" y1="28" x2="52" y2="28" strokeLinecap="round" />
          {/* Item 2 with Checked Checkbox */}
          <rect x="10" y="38" width="6" height="6" rx="1" />
          <path d="M 11,41 L 13,43 L 17,39" strokeWidth="1" strokeLinecap="round" />
          <line x1="20" y1="42" x2="48" y2="42" strokeLinecap="round" />
          {/* Item 3 */}
          <rect x="10" y="52" width="6" height="6" rx="1" />
          <line x1="20" y1="56" x2="44" y2="56" strokeLinecap="round" />
          {/* Approved Stamp */}
          <circle cx="46" cy="66" r="7" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Document 4: Bottom-Right (Near Official Source CTA) */}
      <div
        className="absolute bottom-[6%] right-[5%] sm:right-[8%] opacity-[0.07] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400 animate-doc-float-1 hidden md:block"
        style={{ animationDuration: '18s' }}
      >
        <svg width="72" height="92" viewBox="0 0 72 92" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M 2,2 L 52,2 L 70,20 L 70,90 L 2,90 Z" strokeLinejoin="round" />
          <path d="M 52,2 L 52,20 L 70,20" strokeLinejoin="round" />
          <line x1="12" y1="32" x2="58" y2="32" strokeLinecap="round" />
          <line x1="12" y1="42" x2="52" y2="42" strokeLinecap="round" />
          <line x1="12" y1="52" x2="46" y2="52" strokeLinecap="round" />
          {/* Verified Check Badge */}
          <circle cx="36" cy="70" r="9" stroke="currentColor" />
          <path d="M 32,70 L 35,73 L 41,67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. MUTED GOLD ACCENT PARTICLES (5–8 Particles, Non-Aggressive)             */}
      {/* ========================================================================= */}

      {/* Gold Particle 1: Top Right */}
      <div
        className="absolute top-[10%] right-[14%] opacity-[0.25] dark:opacity-[0.14] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '9s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Gold Particle 2: Upper Left (Below hero top) */}
      <div
        className="absolute top-[22%] left-[8%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '12s', animationDelay: '1.5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="6" />
        </svg>
      </div>

      {/* Gold Particle 3: Mid Right (Near Facts) */}
      <div
        className="absolute top-[44%] right-[10%] opacity-[0.20] dark:opacity-[0.12] text-amber-500 animate-gold-glow hidden sm:block"
        style={{ animationDuration: '14s', animationDelay: '3s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Gold Particle 4: Mid Left (Near Eligibility) */}
      <div
        className="absolute top-[58%] left-[10%] opacity-[0.18] dark:opacity-[0.10] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '11s', animationDelay: '4.5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Gold Particle 5: Lower Right (Near How to Apply) */}
      <div
        className="absolute top-[76%] right-[12%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '13s', animationDelay: '2s' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* Gold Particle 6: Bottom Left */}
      <div
        className="absolute top-[88%] left-[7%] opacity-[0.20] dark:opacity-[0.10] text-amber-500 animate-gold-glow hidden sm:block"
        style={{ animationDuration: '15s', animationDelay: '5s' }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* Gold Particle 7: Near Bottom CTA */}
      <div
        className="absolute bottom-[4%] right-[24%] opacity-[0.24] dark:opacity-[0.14] text-amber-500 animate-gold-glow"
        style={{ animationDuration: '10s', animationDelay: '3.5s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. HERO-SPECIFIC SUBTLE ORBITAL WATERMARK                                 */}
      {/* ========================================================================= */}
      <div className="absolute top-[4%] right-[8%] w-64 h-64 rounded-full border border-dashed border-[#064E3B]/8 dark:border-emerald-400/8 pointer-events-none" />
      <div className="absolute top-[7%] right-[11%] w-44 h-44 rounded-full border border-emerald-600/5 dark:border-emerald-400/5 pointer-events-none" />
    </div>
  );
};
