import React from 'react';
import { useMouseParallax } from './useMouseParallax';

export const ProfileBackground: React.FC = () => {
  const { x, y } = useMouseParallax(3, 2);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        perspective: '1200px',
      }}
      aria-hidden="true"
    >
      {/* Abstract Educational Orbit Lines & Nodes */}
      <svg
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[1300px] h-[850px] opacity-[0.16] dark:opacity-[0.08]"
        viewBox="0 0 1300 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trajectory of learning & eligibility milestones */}
        <path
          d="M 80 720 C 300 650, 480 500, 680 420 C 880 340, 1060 210, 1220 120"
          stroke="#065F46"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeOpacity="0.45"
        />

        {/* Counter orbit curve */}
        <path
          d="M 150 200 C 400 320, 700 300, 950 480 C 1100 580, 1200 700, 1250 780"
          stroke="#D97706"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.35"
        />

        {/* Milestone Nodes */}
        <circle cx="380" cy="565" r="4.5" fill="#065F46" opacity="0.6" />
        <circle cx="680" cy="420" r="5.5" fill="#D97706" opacity="0.7" />
        <circle cx="950" cy="480" r="4" fill="#065F46" opacity="0.5" />
        <circle cx="1060" cy="210" r="5" fill="#D97706" opacity="0.65" />
      </svg>

      {/* 3D Floating Educational Document Sheet (Top Left) */}
      <div
        className="hidden sm:block absolute top-[14%] left-[6%] opacity-[0.25] dark:opacity-[0.14] animate-float motion-reduce:animate-none"
        style={{
          animationDuration: '14s',
          transform: 'rotateX(10deg) rotateY(-14deg) rotateZ(3deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="w-20 h-26 rounded-xl bg-linear-to-b from-stone-50/90 to-amber-50/60 dark:from-[#182E29]/90 dark:to-[#12221E]/60 border border-stone-300/60 dark:border-emerald-700/40 shadow-lg p-2.5 space-y-1.5 backdrop-blur-2xs">
          <div className="w-7 h-1.5 rounded-full bg-[#065F46]/50 dark:bg-emerald-400/50" />
          <div className="w-12 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <div className="w-10 h-1 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div className="w-13 h-1 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div className="w-8 h-1 rounded-full bg-amber-500/40" />
        </div>
      </div>

      {/* 3D Floating Mini Scholarship Card (Top Right) */}
      <div
        className="hidden sm:block absolute top-[20%] right-[7%] opacity-[0.22] dark:opacity-[0.12] animate-float-alt motion-reduce:animate-none"
        style={{
          animationDuration: '16s',
          transform: 'rotateX(-8deg) rotateY(12deg) rotateZ(-3deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="w-28 h-20 rounded-xl bg-linear-to-b from-white/90 to-stone-50/70 dark:from-[#1A332D]/90 dark:to-[#142420]/70 border border-emerald-600/30 dark:border-emerald-600/40 shadow-lg p-2.5 space-y-1.5 backdrop-blur-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-1.5 rounded-full bg-emerald-700/60 dark:bg-emerald-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <div className="w-12 h-1 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div className="pt-1 flex items-center gap-1">
            <span className="w-3 h-1 rounded-full bg-[#065F46]/50" />
            <span className="w-4 h-1 rounded-full bg-amber-600/50" />
          </div>
        </div>
      </div>

      {/* 3D Floating Abstract Book / Open Folio (Bottom Left) */}
      <div
        className="hidden md:block absolute bottom-[18%] left-[10%] opacity-[0.20] dark:opacity-[0.10] animate-float motion-reduce:animate-none"
        style={{
          animationDuration: '15s',
          transform: 'rotateX(14deg) rotateY(8deg) rotateZ(-4deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center gap-0.5 shadow-md">
          <div className="w-10 h-14 rounded-l-md bg-stone-100/90 dark:bg-[#182E29]/80 border-y border-l border-stone-300/60 dark:border-emerald-700/30 p-1.5 space-y-1">
            <div className="w-6 h-1 rounded bg-stone-300 dark:bg-stone-600" />
            <div className="w-7 h-1 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="w-5 h-1 rounded bg-stone-200 dark:bg-stone-700" />
          </div>
          <div className="w-10 h-14 rounded-r-md bg-stone-50/90 dark:bg-[#162A24]/80 border-y border-r border-stone-300/60 dark:border-emerald-700/30 p-1.5 space-y-1">
            <div className="w-6 h-1 rounded bg-stone-300 dark:bg-stone-600" />
            <div className="w-7 h-1 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="w-4 h-1 rounded bg-stone-200 dark:bg-stone-700" />
          </div>
        </div>
      </div>

      {/* 3D Floating Verification Ribbon Motif (Bottom Right) */}
      <div
        className="hidden md:block absolute bottom-[22%] right-[12%] opacity-[0.20] dark:opacity-[0.10] animate-float-alt motion-reduce:animate-none"
        style={{
          animationDuration: '17s',
          transform: 'rotateX(-10deg) rotateY(-10deg) rotateZ(6deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 dark:border-amber-400/25 flex items-center justify-center shadow-md">
          <div className="w-6 h-6 rounded-full bg-amber-500/25 dark:bg-amber-400/20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
