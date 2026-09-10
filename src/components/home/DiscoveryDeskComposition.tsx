import React from 'react';
import {
  Search,
  FileText,
  Star,
  Flag,
  ChevronDown,
  Bookmark,
  Globe,
  User,
  BarChart3,
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
        {/* Unified Ground Contact Shadow (Binds Laptop & Books to the same desk plane) */}
        <div className="absolute bottom-2 left-2 right-2 h-7 pointer-events-none z-0">
          <div className="w-[94%] h-full mx-auto bg-gradient-to-r from-[#064E3B]/12 via-slate-900/18 to-slate-900/14 dark:from-black/40 dark:via-black/50 dark:to-black/35 blur-xl rounded-full" />
        </div>

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

        {/* 3D LAPTOP (Refined Product Render, ~15-20° perspective, fully visible) */}
        <div
          className="relative z-10 ml-auto mr-3 sm:mr-6 max-w-[315px] sm:max-w-[340px]"
          style={{ perspective: '1000px' }}
        >
          <div
            style={{
              transform: 'rotateY(-7deg) rotateX(5deg)',
              transformStyle: 'preserve-3d',
            }}
            className="transition-transform duration-300 hover:rotate-y-[-4deg] hover:rotate-x-[3deg]"
          >
            {/* Screen Lid Shell with Aluminum Top Edge Highlight */}
            <div className="rounded-t-xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-2 pt-1.5 pb-1 shadow-xl border border-slate-700/80">
              {/* Webcam & Top Bezel Indicator */}
              <div className="flex items-center justify-center pb-0.5">
                <span className="w-1.2 h-1.2 rounded-full bg-slate-500 inline-block ring-1 ring-slate-800" />
              </div>

              {/* Screen Interior Display Surface with Glass Gloss Reflection */}
              <div className="relative overflow-hidden bg-white dark:bg-[#0C1513] rounded-lg p-2.5 sm:p-3 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-inner">
                {/* Glass Gloss Sheen Diagonal Reflection */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-white/12 via-white/4 to-transparent rotate-45 pointer-events-none" />

                {/* Top App Bar inside Laptop */}
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
                  {/* Left: Edvora Brand */}
                  <div className="flex items-center gap-1">
                    <img
                      src="/edvora-emblem.png"
                      alt="Edvora"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span className="text-[10px] font-black font-editorial text-[#064E3B] dark:text-emerald-400">
                      Edvora
                    </span>
                  </div>

                  {/* Right Icons: Bookmark, Language, Avatar */}
                  <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-[8px]">
                    <Bookmark className="w-2.5 h-2.5 text-stone-400" />
                    <span className="flex items-center gap-0.5">
                      <Globe className="w-2.5 h-2.5 text-stone-400" />
                      <span className="font-semibold text-[7.5px]">EN</span>
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#065F46] text-white flex items-center justify-center">
                      <User className="w-2 h-2" />
                    </div>
                  </div>
                </div>

                {/* Form on Left + Stats Card on Right */}
                <div className="grid grid-cols-12 gap-2 text-left items-center">
                  {/* Left: Scholarship Finder Inputs */}
                  <div className="col-span-8 space-y-1">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                        Find scholarships for you
                      </h4>
                      <p className="text-[7px] text-stone-500 dark:text-stone-400 leading-none mt-0.5">
                        Answer a few questions and get matches
                      </p>
                    </div>

                    {/* Field 1: Education */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        What are you studying?
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Diploma</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Field 2: Income */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        Annual family income
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Below ₹2.5 Lakh</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Field 3: Location */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        State / Location
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Gujarat</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={onFindScholarships}
                      className="w-full mt-0.5 py-1 px-2 rounded bg-[#064E3B] hover:bg-[#043E2F] text-white text-[8.5px] font-bold shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span>Find Matches</span>
                      <ArrowRight className="w-2 h-2 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Right: Matches Card with Bar Chart */}
                  <div className="col-span-4 h-full flex items-center">
                    <div className="w-full py-2.5 px-1 rounded-lg bg-[#F0FDF4] dark:bg-[#142420] border border-emerald-200/80 dark:border-emerald-800/80 text-center flex flex-col items-center justify-center shadow-2xs">
                      <div className="w-5 h-5 rounded-md bg-[#065F46] text-white flex items-center justify-center mb-0.5">
                        <BarChart3 className="w-3 h-3 text-amber-300 stroke-[2.5]" />
                      </div>
                      <span className="text-xl font-black text-[#064E3B] dark:text-emerald-400 font-editorial leading-none">
                        3
                      </span>
                      <span className="text-[7.5px] font-bold text-stone-700 dark:text-stone-300 mt-0.5 leading-tight">
                        Scholarships
                      </span>
                      <span className="text-[6.5px] text-stone-500 dark:text-stone-400">
                        Found
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aluminum Keyboard Base & Trackpad */}
            <div className="relative">
              <svg
                className="w-full h-auto block -mt-[1px]"
                viewBox="0 0 340 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="laptopBaseGradCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                </defs>

                <rect x="15" y="0" width="310" height="2" fill="#0F172A" />
                <path
                  d="M 8 2 L 332 2 L 340 44 C 340 47, 336 49, 330 49 L 10 49 C 4 49, 0 47, 0 44 Z"
                  fill="url(#laptopBaseGradCompact)"
                />
                <path d="M 8 2 L 332 2" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.8" />

                {/* Keyboard Well with Subtle Keycap Relief */}
                <path d="M 32 5 L 308 5 L 314 26 L 26 26 Z" fill="#0F172A" fillOpacity="0.85" />
                <rect x="36" y="7" width="268" height="3" rx="0.6" fill="#1E293B" />
                <rect x="34" y="11" width="272" height="3.5" rx="0.6" fill="#1E293B" />
                <rect x="32" y="15.5" width="276" height="3.5" rx="0.6" fill="#1E293B" />
                {/* Spacebar Row */}
                <g transform="translate(30, 20)">
                  <rect x="0" y="0" width="26" height="4" rx="0.6" fill="#1E293B" />
                  <rect x="74" y="0" width="132" height="4" rx="0.6" fill="#0F172A" stroke="#475569" strokeWidth="0.4" />
                  <rect x="254" y="0" width="26" height="4" rx="0.6" fill="#1E293B" />
                </g>

                {/* Centered Glass Trackpad */}
                <rect
                  x="135"
                  y="30"
                  width="70"
                  height="14"
                  rx="1.5"
                  fill="#94A3B8"
                  fillOpacity="0.4"
                  stroke="#64748B"
                  strokeWidth="0.5"
                />

                {/* Front Lip with Thumb Opening Notch */}
                <path d="M 152 44 C 152 46, 155 47, 160 47 L 180 47 C 185 47, 188 46, 188 44 Z" fill="#475569" />
              </svg>
            </div>
          </div>
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
