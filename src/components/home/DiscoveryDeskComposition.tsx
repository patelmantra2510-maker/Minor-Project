import React from 'react';
import { Cap3D, Star3D } from '../common/Educational3DObjects';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface DiscoveryDeskCompositionProps {
  onFindScholarships?: () => void;
}

export const DiscoveryDeskComposition: React.FC<DiscoveryDeskCompositionProps> = ({
  onFindScholarships,
}) => {
  return (
    <div className="relative w-full max-w-md lg:max-w-lg mx-auto select-none py-4 sm:py-6">
      {/* 1. Subtle Background Organic Halo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#FAF8F5] via-[#F3EDE2]/60 to-[#E8E2D7]/30 blur-2xl dark:from-[#0C1513] dark:via-[#142420]/40 dark:to-transparent" />
      </div>

      {/* 2. Elegant Curved Journey Line (Behind/around the laptop) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 520 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Delicate curving trajectory */}
        <path
          d="M 60 260 C 50 130, 160 55, 270 55 C 380 55, 465 110, 465 210 C 465 310, 395 400, 270 405 C 180 410, 100 375, 75 330"
          stroke="url(#journeyGrad)"
          strokeWidth="1.4"
          strokeDasharray="4 6"
        />

        {/* Milestone Node 1: EXPLORE (Top-Left) */}
        <g transform="translate(105, 80)">
          <circle cx="0" cy="0" r="3.5" fill="#065F46" />
          <circle cx="0" cy="0" r="1.5" fill="#FAF8F5" />
          <text x="-4" y="-8" fontSize="9.5" fontWeight="700" fill="#065F46" letterSpacing="0.08em" textAnchor="end" className="dark:fill-emerald-400">
            EXPLORE 🔎
          </text>
        </g>

        {/* Milestone Node 2: MATCH (Top-Right) */}
        <g transform="translate(390, 75)">
          <circle cx="0" cy="0" r="3.5" fill="#D97706" />
          <circle cx="0" cy="0" r="1.5" fill="#FAF8F5" />
          <text x="6" y="-8" fontSize="9.5" fontWeight="700" fill="#B45309" letterSpacing="0.08em" textAnchor="start" className="dark:fill-amber-400">
            📄 MATCH
          </text>
        </g>

        {/* Milestone Node 3: SCHOLARSHIP (Mid-Right) */}
        <g transform="translate(465, 210)">
          <circle cx="0" cy="0" r="3.5" fill="#D97706" />
          <circle cx="0" cy="0" r="1.5" fill="#FAF8F5" />
          <text x="8" y="3" fontSize="9.5" fontWeight="700" fill="#B45309" letterSpacing="0.08em" textAnchor="start" className="dark:fill-amber-400">
            ⭐ SCHOLARSHIP
          </text>
        </g>

        {/* Milestone Node 4: FUTURE (Bottom) */}
        <g transform="translate(230, 406)">
          <circle cx="0" cy="0" r="3.5" fill="#065F46" />
          <circle cx="0" cy="0" r="1.5" fill="#FAF8F5" />
          <text x="0" y="16" fontSize="9.5" fontWeight="700" fill="#065F46" letterSpacing="0.08em" textAnchor="middle" className="dark:fill-emerald-400">
            ⚑ FUTURE
          </text>
        </g>
      </svg>

      {/* Supporting Accent 1: Graduation Cap (Top Left) */}
      <div className="absolute -top-2 left-2 sm:left-4 z-20 animate-float" title="Graduation Cap">
        <Cap3D size={48} />
      </div>

      {/* Supporting Accent 2: Polished 3D Stack of 3 Books (Deep green, cream, muted gold) */}
      <div className="absolute bottom-6 -left-2 sm:-left-3 z-20 animate-float-alt" title="Edvora Study Volumes">
        <svg width="68" height="54" viewBox="0 0 68 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-md">
          {/* Bottom Book: Deep Forest Green with Gold Spine Foil */}
          <rect x="6" y="34" width="56" height="13" rx="2.5" fill="#064E3B" />
          <path d="M10 36 H60 V44 H10 Z" fill="#FAF8F5" />
          <rect x="4" y="33.5" width="8" height="14" rx="2" fill="#033527" />
          <line x1="8" y1="35" x2="8" y2="46" stroke="#F59E0B" strokeWidth="1" />

          {/* Middle Book: Warm Ivory/Cream with Sage Trim */}
          <rect x="10" y="20" width="50" height="12" rx="2" fill="#FAF8F5" stroke="#E2DACB" strokeWidth="0.8" />
          <path d="M14 22 H58 V29 H14 Z" fill="#F3EDE2" />
          <rect x="8" y="19.5" width="7" height="13" rx="1.5" fill="#D8CFBF" />

          {/* Top Book: Muted Gold/Amber with Ribbon Bookmark */}
          <rect x="14" y="7" width="44" height="11" rx="2" fill="#D97706" />
          <path d="M18 9 H56 V15 H18 Z" fill="#FAF8F5" />
          <rect x="12" y="6.5" width="6" height="12" rx="1.5" fill="#B45309" />
          {/* Gold Bookmark Ribbon hanging down */}
          <path d="M34 6 V22 L37 19 L40 22 V6 H34 Z" fill="#F59E0B" />
        </svg>
      </div>

      {/* Supporting Accent 3: Subtle Gold Star / Spark (Top Right) */}
      <div className="absolute top-4 right-6 sm:right-8 z-20 animate-float-alt" title="Academic Spark">
        <Star3D size={28} />
      </div>

      {/* Supporting Accent 4: One Dimensional Botanical Plant in Terracotta Ceramic Pot */}
      <div className="absolute bottom-5 right-2 sm:right-4 z-20" title="Botanical Growth Plant">
        <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-sm">
          {/* Pot Shadow */}
          <ellipse cx="22" cy="52" rx="12" ry="2.5" fill="#000000" fillOpacity="0.12" />
          {/* Terracotta Pot Body */}
          <path d="M11 36 L14 50 H30 L33 36 H11 Z" fill="#C26A20" stroke="#9A4E11" strokeWidth="1" />
          {/* Pot Rim */}
          <rect x="9" y="34" width="26" height="4" rx="2" fill="#D97706" stroke="#9A4E11" strokeWidth="0.8" />
          {/* Plant Central Stem */}
          <path d="M22 34 V16" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
          {/* Left Leaf (Deep Green) */}
          <path d="M22 25 C14 23 10 18 12 12 C16 12 20 19 22 25 Z" fill="#065F46" />
          {/* Right Leaf (Deep Green with Gold Highlight) */}
          <path d="M22 22 C30 20 34 14 32 8 C28 8 24 16 22 22 Z" fill="#047857" />
          <path d="M22 22 C26 18 29 14 28 10 C26 11 23 16 22 22 Z" fill="#F59E0B" />
          {/* Top Growth Leaf */}
          <path d="M22 16 C20 10 22 4 22 4 C22 4 24 10 22 16 Z" fill="#10B981" />
        </svg>
      </div>

      {/* CENTRAL OBJECT: Realistic-but-Stylized Laptop (10-15% smaller, refined depth) */}
      <div className="relative z-10 mx-auto max-w-[325px] sm:max-w-[350px] transition-transform duration-300 hover:-translate-y-1">
        {/* Laptop Display Chassis with Realistic Bezel & Soft Depth */}
        <div className="rounded-t-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-2 sm:p-2.5 pt-2 pb-1.5 shadow-xl border border-slate-700/80">
          {/* Screen Top Bar: Camera & Window Controls */}
          <div className="flex items-center justify-between px-1.5 mb-1 text-[8.5px] text-slate-400">
            <div className="flex items-center gap-1.2">
              <span className="w-1.8 h-1.8 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-1.8 h-1.8 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-1.8 h-1.8 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            {/* Center camera dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block ring-1 ring-slate-800" />
            <span className="text-[7.5px] font-mono opacity-50">edvora.in</span>
          </div>

          {/* Screen Display Content */}
          <div className="relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0C1513] rounded-lg p-3.5 sm:p-4 border border-[#E8E2D7] dark:border-[#1E3A33] text-stone-900 dark:text-stone-100 transition-colors shadow-inner">
            {/* Glass subtle light reflection streak */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-white/12 to-transparent rotate-45 pointer-events-none" />

            {/* Window Header with Edvora Emblem */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
              <div className="flex items-center gap-1.5">
                <img
                  src="/edvora-emblem.png"
                  alt="Edvora"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-[11px] font-black font-editorial text-[#064E3B] dark:text-emerald-400">
                  Edvora Finder
                </span>
              </div>
              <span className="text-[8.5px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                100% Verified
              </span>
            </div>

            {/* Matching Interface */}
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                Find scholarships for you
              </h4>

              {/* Field 1: Course */}
              <div>
                <span className="text-[8.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  What are you studying?
                </span>
                <div className="mt-0.5 px-2 py-1 rounded-md bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[10px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Diploma</span>
                  <span className="text-[8.5px] text-[#065F46] dark:text-emerald-400 font-bold">✓</span>
                </div>
              </div>

              {/* Field 2: Income */}
              <div>
                <span className="text-[8.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Annual family income
                </span>
                <div className="mt-0.5 px-2 py-1 rounded-md bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[10px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Below ₹2.5 Lakh</span>
                  <span className="text-[8px] text-amber-700 dark:text-amber-400 font-bold">Eligible</span>
                </div>
              </div>

              {/* Field 3: Location */}
              <div>
                <span className="text-[8.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  State / Location
                </span>
                <div className="mt-0.5 px-2 py-1 rounded-md bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[10px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Gujarat</span>
                  <span className="text-[8.5px] text-stone-400">Domicile</span>
                </div>
              </div>

              {/* Action Button inside Laptop */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={onFindScholarships}
                  className="w-full py-1.5 px-2.5 rounded-md bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-[10px] font-bold shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Find Matches</span>
                  <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                </button>
              </div>

              {/* Verified Result Banner */}
              <div className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-[#142420] border border-[#065F46]/20 dark:border-emerald-800 text-[9.5px] text-[#064E3B] dark:text-emerald-300 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>3 Scholarships Found</span>
                </span>
                <span className="text-[8.5px] text-stone-500 dark:text-stone-400 font-semibold">
                  MYSY · AICTE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base Surface with Realistic Bevel & Front Notch */}
        <div className="relative">
          <div className="h-3 bg-gradient-to-b from-[#CBD5E1] to-[#94A3B8] dark:from-slate-700 dark:to-slate-800 rounded-b-xl border-t border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-md">
            <div className="w-12 h-0.8 bg-slate-500 dark:bg-slate-900 rounded-full" />
          </div>
          {/* Desk shadow */}
          <div className="h-3.5 w-[90%] mx-auto bg-emerald-950/15 dark:bg-black/40 blur-md rounded-full -mt-1" />
        </div>
      </div>

      {/* 3. ONLY ONE FLOATING SCHOLARSHIP CARD (Real verified scholarship data from dataset) */}
      <div className="absolute -bottom-2 -right-3 sm:-right-6 z-30 animate-float max-w-[215px] sm:max-w-[230px]">
        <div className="bg-white dark:bg-[#142420] rounded-xl p-3 sm:p-3.5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-lg hover:shadow-xl transition-all">
          {/* Card Header: 🎓 Scholarship badge + status */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#064E3B] dark:text-emerald-400">
              <span>🎓</span>
              <span>Scholarship</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-extrabold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ● OPEN
            </span>
          </div>

          {/* Real Scholarship Name */}
          <h5 className="text-[11px] font-bold text-slate-900 dark:text-stone-100 font-editorial line-clamp-1">
            Central Sector Scheme (CSSS)
          </h5>

          {/* Real Award Benefit */}
          <p className="text-xs font-black text-[#064E3B] dark:text-emerald-400 mt-0.5">
            ₹12,000 <span className="text-[9px] font-normal text-stone-500 dark:text-stone-400">/ year</span>
          </p>

          {/* Level tag */}
          <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between text-[9px] text-stone-500 dark:text-stone-400 font-semibold">
            <span>Undergraduate</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Govt. of India</span>
          </div>
        </div>
      </div>
    </div>
  );
};
