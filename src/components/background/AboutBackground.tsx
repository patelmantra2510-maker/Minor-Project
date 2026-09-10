import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const AboutBackground: React.FC = () => {
  const { x, y } = useMouseParallax(5, 3);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {/* Upward Growth Trajectory SVG */}
      <svg
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-[0.20] dark:opacity-[0.10]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Growth Curve: Learning -> Opportunity -> Growth */}
        <path
          d="M 100 650 C 350 620, 500 450, 750 320 C 950 200, 1050 100, 1150 60"
          stroke="#065F46"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeOpacity="0.4"
        />

        {/* Sprouting Points */}
        <circle cx="450" cy="510" r="3" fill="#D97706" opacity="0.6" />
        <circle cx="750" cy="320" r="3.5" fill="#065F46" opacity="0.6" />
        <circle cx="950" cy="200" r="4" fill="#D97706" opacity="0.6" />
      </svg>

      {/* Gentle Floating Foliage Accents */}
      <div
        className="absolute top-[22%] left-[10%] opacity-[0.16] dark:opacity-[0.09] animate-float text-[#065F46] dark:text-emerald-400"
        style={{ animationDuration: '9s' }}
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        </svg>
      </div>

      <div
        className="absolute bottom-[28%] right-[8%] opacity-[0.14] dark:opacity-[0.08] animate-float-alt text-amber-600 dark:text-amber-400"
        style={{ animationDuration: '11s' }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
    </div>
  );
};
