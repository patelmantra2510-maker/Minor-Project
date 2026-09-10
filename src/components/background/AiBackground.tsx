import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const AiBackground: React.FC = () => {
  const { x, y } = useMouseParallax(6, 4);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* Subtle Knowledge Orb / Orbital Geometry */}
      <div className="absolute top-[8%] right-[8%] w-72 h-72 rounded-full border border-dashed border-[#064E3B]/10 dark:border-emerald-400/10 pointer-events-none" />
      <div className="absolute top-[12%] right-[12%] w-48 h-48 rounded-full border border-emerald-600/5 dark:border-emerald-400/5 pointer-events-none" />

      {/* Floating Intelligence Sparkle (Top-Left) */}
      <div
        className="absolute top-[14%] left-[7%] opacity-[0.22] dark:opacity-[0.12] text-amber-500 animate-pulse"
        style={{ animationDuration: '4s' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8z" />
        </svg>
      </div>

      {/* Floating Sparkle (Bottom-Right) */}
      <div
        className="absolute bottom-[20%] right-[10%] opacity-[0.18] dark:opacity-[0.10] text-amber-500 animate-pulse"
        style={{ animationDuration: '6s' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.8 9.2L24 12l-9.2 2.8L12 24l-2.8-9.2L0 12l9.2-2.8z" />
        </svg>
      </div>

      {/* Intelligence Compass Watermark */}
      <div
        className="absolute top-[35%] left-[4%] opacity-[0.07] dark:opacity-[0.04] text-[#064E3B] dark:text-emerald-400 animate-float"
        style={{ animationDuration: '14s' }}
      >
        <svg className="w-28 h-28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
          <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </svg>
      </div>

      {/* Neural Node Constellation (Center-Right Subtle) */}
      <svg
        className="absolute top-[50%] right-[4%] w-48 h-48 opacity-[0.09] dark:opacity-[0.05] text-[#064E3B] dark:text-emerald-400"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
      >
        <circle cx="30" cy="25" r="2.5" fill="currentColor" />
        <circle cx="70" cy="35" r="2" fill="currentColor" />
        <circle cx="50" cy="70" r="2.5" fill="currentColor" />
        <circle cx="85" cy="75" r="1.5" fill="currentColor" />
        <line x1="30" y1="25" x2="70" y2="35" strokeDasharray="2 2" />
        <line x1="70" y1="35" x2="50" y2="70" strokeDasharray="2 2" />
        <line x1="50" y1="70" x2="85" y2="75" strokeDasharray="2 2" />
        <line x1="30" y1="25" x2="50" y2="70" strokeDasharray="2 2" />
      </svg>
    </div>
  );
};
