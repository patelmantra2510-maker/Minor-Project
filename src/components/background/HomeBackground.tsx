import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const HomeBackground: React.FC = () => {
  const { x, y } = useMouseParallax(6, 4);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* Curved Dotted Journey Path SVG */}
      <svg
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] opacity-[0.25] dark:opacity-[0.14] transition-opacity"
        viewBox="0 0 1400 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Primary trajectory: Explore -> Match -> Scholarship -> Future */}
        <path
          d="M 50 180 C 350 80, 500 320, 850 160 C 1100 40, 1250 260, 1380 200"
          stroke="url(#journeyGrad)"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          className="animate-path-drift"
        />

        {/* Secondary subtle echo path */}
        <path
          d="M 120 480 C 400 380, 650 620, 950 460 C 1180 340, 1300 520, 1390 480"
          stroke="#065F46"
          strokeOpacity="0.15"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Journey milestone nodes */}
        <circle cx="850" cy="160" r="3.5" fill="#D97706" opacity="0.6" />
        <circle cx="350" cy="140" r="2.5" fill="#065F46" opacity="0.5" />
        <circle cx="1100" cy="110" r="3" fill="#D97706" opacity="0.5" />
      </svg>

      {/* Floating Mini Educational Elements */}
      {/* 1. Tiny Graduation Cap */}
      <div
        className="absolute top-[18%] left-[8%] opacity-[0.22] dark:opacity-[0.12] animate-float text-emerald-800 dark:text-emerald-400"
        style={{ animationDuration: '9s' }}
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>

      {/* 2. Tiny Book Outline */}
      <div
        className="absolute top-[38%] right-[7%] opacity-[0.20] dark:opacity-[0.10] animate-float-alt text-amber-700 dark:text-amber-400"
        style={{ animationDuration: '11s' }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10M6 10h10" />
        </svg>
      </div>

      {/* 3. Subtle Gold Sparkle */}
      <div
        className="absolute top-[28%] left-[82%] opacity-[0.28] dark:opacity-[0.18] animate-pulse text-amber-500"
        style={{ animationDuration: '4s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8z" />
        </svg>
      </div>

      {/* 4. Small Organic Leaf */}
      <div
        className="absolute bottom-[22%] left-[12%] opacity-[0.18] dark:opacity-[0.10] animate-float text-[#065F46] dark:text-emerald-500"
        style={{ animationDuration: '10s' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      {/* 5. Tiny Document Sheet */}
      <div
        className="absolute bottom-[35%] right-[14%] opacity-[0.18] dark:opacity-[0.09] animate-float-alt text-stone-600 dark:text-stone-400"
        style={{ animationDuration: '12s' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
    </div>
  );
};
