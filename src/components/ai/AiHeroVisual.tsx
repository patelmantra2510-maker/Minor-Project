import React from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export const AiHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center p-4 select-none">
      {/* Subtle Background Glow (Gold & Emerald, strictly no purple/neon) */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-600/10 via-amber-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Decorative Network Path Lines: Question -> Scholarship -> Eligibility -> Opportunity */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20"
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 60 120 C 140 80, 220 180, 360 110 C 420 80, 440 220, 390 320"
          stroke="#064E3B"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <path
          d="M 110 310 C 180 340, 280 260, 380 290"
          stroke="#D97706"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />
        {/* Network Nodes */}
        <circle cx="60" cy="120" r="4" fill="#064E3B" />
        <circle cx="360" cy="110" r="3.5" fill="#D97706" />
        <circle cx="390" cy="320" r="4" fill="#064E3B" />
        <circle cx="110" cy="310" r="3" fill="#D97706" />
      </svg>

      {/* Main Composition Container */}
      <div className="relative w-full max-w-md py-4">
        {/* Card 1: Verified Scholarship Document Card (Center) */}
        <div className="relative z-20 bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-[0_12px_32px_-8px_rgba(6,78,59,0.12)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1 duration-300">
          {/* Header with verified badge and emblem */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1E3A33] pb-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/edvora-emblem.png"
                alt="Edvora"
                className="w-7 h-7 object-contain drop-shadow-xs"
              />
              <div>
                <span className="font-editorial text-xs font-bold text-stone-900 dark:text-stone-100 block">
                  Edvora Verified Scheme
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  Official Gujarat & Central Dataset
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Verified
            </span>
          </div>

          {/* Body Preview */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#192E28] border border-stone-100 dark:border-[#224038]">
              <span className="text-stone-500 dark:text-stone-400 font-medium">Target Level:</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">Diploma / Degree</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#192E28] border border-stone-100 dark:border-[#224038]">
              <span className="text-stone-500 dark:text-stone-400 font-medium">Annual Aid:</span>
              <span className="font-bold text-[#064E3B] dark:text-emerald-400">Up to ₹2,00,000/yr</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 dark:bg-[#142C24] border border-emerald-100 dark:border-[#1E3A33]">
              <span className="text-emerald-800 dark:text-emerald-300 font-medium">Match Status:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Strong Match
              </span>
            </div>
          </div>
        </div>

        {/* Floating Element 1: Graduation Cap Badge (Top Right) */}
        <div className="absolute -top-3 -right-3 z-30 bg-[#064E3B] text-amber-300 p-3 rounded-2xl shadow-lg border border-emerald-500/40 animate-float" style={{ animationDuration: '6s' }}>
          <GraduationCap className="w-5 h-5" />
        </div>

        {/* Floating Element 2: Book / Curriculum Badge (Bottom Left) */}
        <div className="absolute -bottom-3 -left-3 z-30 bg-white dark:bg-[#182E29] text-stone-800 dark:text-stone-200 p-3 rounded-2xl shadow-lg border border-[#E8E2D7] dark:border-[#23453E] flex items-center gap-2 animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}>
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-[11px] font-bold font-editorial">10-Section AI Guide</span>
        </div>

        {/* Floating Element 3: Gold Sparkle Indicator (Top Left) */}
        <div className="absolute top-6 -left-4 z-10 text-amber-500 opacity-80 animate-pulse" style={{ animationDuration: '4s' }}>
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Floating Element 4: Document Verification Seal (Bottom Right) */}
        <div className="absolute -bottom-2 right-6 z-10 text-emerald-600 dark:text-emerald-400 opacity-70">
          <FileCheck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
