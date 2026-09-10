import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const FindBackground: React.FC = () => {
  const { x, y } = useMouseParallax(5, 3);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* 7-Step Constellation Connection Track */}
      <svg
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[1100px] h-[750px] opacity-[0.20] dark:opacity-[0.10]"
        viewBox="0 0 1100 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Connecting Guide Arcs */}
        <path
          d="M 150 200 Q 350 80, 550 180 T 950 220"
          stroke="#065F46"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
        />
        <path
          d="M 180 480 Q 400 360, 600 490 T 920 420"
          stroke="#D97706"
          strokeWidth="1"
          strokeDasharray="3 5"
          strokeOpacity="0.3"
        />

        {/* Faint Nodes */}
        <circle cx="150" cy="200" r="3" fill="#065F46" opacity="0.5" />
        <circle cx="350" cy="120" r="2.5" fill="#D97706" opacity="0.4" />
        <circle cx="550" cy="180" r="3" fill="#065F46" opacity="0.5" />
        <circle cx="750" cy="190" r="2.5" fill="#D97706" opacity="0.4" />
        <circle cx="950" cy="220" r="3" fill="#065F46" opacity="0.5" />
      </svg>

      {/* Ambient Pulsing Focus Rings */}
      <div className="absolute top-[20%] left-[10%] w-24 h-24 rounded-full border border-emerald-600/10 dark:border-emerald-400/10 animate-pulse" />
      <div className="absolute bottom-[25%] right-[10%] w-32 h-32 rounded-full border border-amber-500/10 dark:border-amber-400/10 animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};
