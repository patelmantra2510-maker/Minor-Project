import React from 'react';
import { EdvoraProductLaptop } from './EdvoraProductLaptop';
import {
  Search,
  FileText,
  Star,
  Flag,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

interface DiscoveryDeskCompositionProps {
  onFindScholarships?: () => void;
}

export const DiscoveryDeskComposition: React.FC<DiscoveryDeskCompositionProps> = ({
  onFindScholarships,
}) => {
  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[490px] mx-auto select-none pt-2 pb-2 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 1. SHARED AMBIENT GLOW & UNIFIED HORIZON                                  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#FAF8F5] via-[#F3EDE2]/45 to-[#E8E2D7]/20 blur-3xl dark:from-[#0C1513] dark:via-[#142420]/30 dark:to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT ELEGANT CURVED JOURNEY PATH (Explore -> Match -> Scholarship -> Future) */}
      {/* ========================================================================= */}
      <div className="relative w-full mb-1 pointer-events-none">
        {/* Compact SVG Dotted Arc wrapping around the top of the scene */}
        <svg
          className="w-full h-14 sm:h-16 overflow-visible"
          viewBox="0 0 440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 35 50 C 110 25, 210 10, 310 16 C 360 19, 395 32, 425 22"
            stroke="#D97706"
            strokeWidth="1.3"
            strokeDasharray="4 5"
            strokeOpacity="0.45"
          />
          <path
            d="M 425 22 C 433 18, 440 14, 446 10"
            stroke="#D97706"
            strokeWidth="1.1"
            strokeDasharray="2 3"
            strokeOpacity="0.6"
          />
        </svg>

        {/* Node 1: EXPLORE */}
        <div className="absolute left-[8%] top-[24px] flex flex-col items-center -translate-x-1/2 group">
          <div className="w-6 h-6 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-xs ring-2 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Search className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
          <span className="text-[9.5px] font-bold text-stone-800 dark:text-stone-200 mt-0.5">Explore</span>
        </div>

        {/* Node 2: MATCH */}
        <div className="absolute left-[38%] top-[4px] flex flex-col items-center -translate-x-1/2 group">
          <div className="w-6 h-6 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-xs ring-2 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <FileText className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
          <span className="text-[9.5px] font-bold text-stone-800 dark:text-stone-200 mt-0.5">Match</span>
        </div>

        {/* Node 3: SCHOLARSHIP */}
        <div className="absolute left-[70%] top-[6px] flex flex-col items-center -translate-x-1/2 group">
          <div className="w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xs ring-2 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Star className="w-2.5 h-2.5 fill-white" />
          </div>
          <span className="text-[9.5px] font-bold text-stone-800 dark:text-stone-200 mt-0.5">Scholarship</span>
        </div>

        {/* Node 4: FUTURE */}
        <div className="absolute right-[4%] top-[8px] flex flex-col items-center translate-x-1/2 group">
          <div className="w-6 h-6 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-xs ring-2 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Flag className="w-2.5 h-2.5 fill-white stroke-[1.5]" />
          </div>
          <span className="text-[9.5px] font-bold text-stone-800 dark:text-stone-200 mt-0.5">Future</span>
        </div>

        {/* Tiny Folded Golden Paper Plane */}
        <div className="absolute right-[-6px] top-[-6px] rotate-[-8deg] pointer-events-none">
          <svg width="24" height="20" viewBox="0 0 34 28" fill="none">
            <path d="M0 16 L32 0 L14 26 L12 16 Z" fill="#D97706" />
            <path d="M32 0 L12 16 L22 17 Z" fill="#F59E0B" />
            <path d="M12 16 L14 26 L18 20 Z" fill="#B45309" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COHESIVE 3D SCENE: UNIFIED LIGHTING, PERSPECTIVE & GROUND CONTACT      */}
      {/* ========================================================================= */}
      <div className="relative pt-1">
        {/* Supporting Left: Stack of 3 Physical Hardcover Books & Plant */}
        <div className="absolute -left-3 sm:-left-6 bottom-4 sm:bottom-6 z-20 pointer-events-none">
          {/* Subtle Foliage behind books with natural dual-tone green */}
          <div className="absolute -top-10 left-4 z-0 opacity-85">
            <svg width="48" height="48" viewBox="0 0 68 68" fill="none">
              <path d="M34 56 C34 40 28 28 20 18 C16 28 22 42 34 56 Z" fill="#047857" />
              <path d="M34 56 C34 38 40 24 50 16 C54 26 46 42 34 56 Z" fill="#065F46" />
              <path d="M34 56 C33 34 34 16 34 8 C38 20 38 38 34 56 Z" fill="#10B981" />
            </svg>
          </div>

          {/* 3 Dimensional Hardcover Books with Spine Foil & Depth */}
          <div className="relative z-10 filter drop-shadow-md">
            <svg width="78" height="56" viewBox="0 0 105 74" fill="none">
              {/* Contact Shadow under books */}
              <ellipse cx="52" cy="70" rx="46" ry="4" fill="#064E3B" fillOpacity="0.22" />

              {/* Book 1 (Bottom): Deep Forest Green Volume */}
              <g transform="translate(4, 46)">
                <rect x="6" y="0" width="88" height="18" rx="3" fill="#064E3B" />
                <path d="M14 3 H92 V15 H14 Z" fill="#FAF8F5" />
                <rect x="4" y="0" width="11" height="18" rx="2" fill="#033527" />
                <line x1="9" y1="3" x2="9" y2="15" stroke="#F59E0B" strokeWidth="1" opacity="0.85" />
              </g>

              {/* Book 2 (Middle): Forest Green / Sage Volume */}
              <g transform="translate(10, 26)">
                <rect x="5" y="0" width="84" height="17" rx="3" fill="#047857" />
                <path d="M13 3 H87 V14 H13 Z" fill="#FBF9F5" />
                <rect x="3" y="0" width="10" height="17" rx="2" fill="#065F46" />
                <line x1="8" y1="3" x2="8" y2="14" stroke="#FBBF24" strokeWidth="1" opacity="0.85" />
              </g>

              {/* Book 3 (Top): Emerald & Gold Volume with Bookmark Ribbon */}
              <g transform="translate(16, 8)">
                <rect x="5" y="0" width="76" height="16" rx="3" fill="#064E3B" />
                <path d="M12 3 H79 V13 H12 Z" fill="#FAF8F5" />
                <rect x="3" y="0" width="9" height="16" rx="2" fill="#032E23" />
                <line x1="7" y1="3" x2="7" y2="13" stroke="#F59E0B" strokeWidth="1" />
                {/* Gold Silk Bookmark Ribbon */}
                <path d="M42 0 V20 L45 17 L48 20 V0 H42 Z" fill="#D97706" />
              </g>
            </svg>
          </div>
        </div>

        {/* ================================================================= */}
        {/* REPLACED: NEW EDVORA PRODUCT LAPTOP (Warm Champagne Silver Body)   */}
        {/* ================================================================= */}
        <div className="relative z-10">
          <EdvoraProductLaptop onFindScholarships={onFindScholarships} />
        </div>

        {/* Floating Graduation Cap (Positioned above/behind upper-right screen rim) */}
        <div
          className="absolute right-3 sm:right-6 -top-5 sm:-top-6 z-25 pointer-events-none filter drop-shadow-md animate-float"
          title="Graduation Cap"
        >
          <svg width="52" height="46" viewBox="0 0 100 85" fill="none">
            <path
              d="M36 44 C36 58 44 68 54 68 C64 68 72 58 72 44 C72 43 64 46 54 46 C44 46 36 43 36 44 Z"
              fill="#064E3B"
            />
            {/* Mortarboard Diamond Top */}
            <path
              d="M52 14 L92 34 L52 54 L12 34 Z"
              fill="#064E3B"
              stroke="#10B981"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            <ellipse cx="52" cy="34" rx="4" ry="2.5" fill="#F59E0B" />
            {/* Silk Tassel in Muted Gold */}
            <path
              d="M52 34 C64 34 76 40 78 50 L80 66"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M76 66 C76 64 84 64 84 66 L82 78 C82 80 78 80 78 78 Z" fill="#D97706" />
          </svg>
        </div>

        {/* Gold Sparkle Accent ✦ */}
        <div className="absolute right-12 sm:right-16 top-4 z-20 pointer-events-none opacity-80">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
              fill="#F59E0B"
            />
          </svg>
        </div>

        {/* ONE FLOATING SCHOLARSHIP CARD (Naturally overlapping lower-right of laptop base) */}
        <div
          className="absolute bottom-2 -right-1 sm:-right-4 z-30 animate-float max-w-[185px] sm:max-w-[200px]"
          style={{ animationDuration: '6s', transform: 'rotate(1deg)' }}
        >
          <div className="bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-lg shadow-stone-900/10 dark:shadow-black/50 hover:shadow-xl transition-all">
            {/* Top Row: 🎓 Scholarship + ● OPEN badge */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-stone-800 dark:text-stone-200">
                <GraduationCap className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
                <span>Scholarship</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[7.5px] font-extrabold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ● OPEN
              </span>
            </div>

            {/* Scholarship Title */}
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-stone-100 font-editorial line-clamp-1 leading-snug">
              Central Sector Scheme (CSSS)
            </h5>

            {/* Benefit Amount */}
            <p className="text-xs font-black text-[#064E3B] dark:text-emerald-400 mt-0.5">
              ₹12,000 <span className="text-[8.5px] font-normal text-stone-500 dark:text-stone-400">/ year</span>
            </p>

            {/* Level Tag & Circular Action Button */}
            <div className="mt-1.5 pt-1 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded text-[7.5px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  Undergrad
                </span>
                <span className="px-1 py-0.2 rounded text-[7.5px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Govt. of India
                </span>
              </div>

              <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
