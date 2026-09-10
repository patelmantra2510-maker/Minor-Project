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
    <div className="relative w-full max-w-[580px] lg:max-w-[620px] mx-auto select-none pt-12 pb-6 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 1. CURVED DOTTED JOURNEY PATH WITH 4 CIRCULAR NODES & PAPER PLANE */}
      {/* ========================================================================= */}
      <div className="relative w-full mb-2 pointer-events-none">
        {/* SVG Curved Dotted Trajectory Line */}
        <svg
          className="w-full h-28 overflow-visible"
          viewBox="0 0 540 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Gentle Arched Dotted Curve passing above laptop */}
          <path
            d="M 50 85 C 130 50, 220 20, 310 24 C 380 28, 440 45, 500 25"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.45"
          />

          {/* Dotted continuation towards paper plane */}
          <path
            d="M 500 25 C 515 20, 525 15, 535 10"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="2 4"
            strokeOpacity="0.6"
          />
        </svg>

        {/* Node 1: EXPLORE (Top-Left) */}
        <div className="absolute left-[3%] top-[38px] flex flex-col items-center -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-md ring-4 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 mt-1">Explore</span>
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap hidden sm:inline">
            Discover opportunities
          </span>
        </div>

        {/* Node 2: MATCH (Center-Left) */}
        <div className="absolute left-[36%] top-[6px] flex flex-col items-center -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-md ring-4 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 mt-1">Match</span>
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap hidden sm:inline">
            Get personalized results
          </span>
        </div>

        {/* Node 3: SCHOLARSHIP (Center-Right, Gold Accent) */}
        <div className="absolute left-[68%] top-[10px] flex flex-col items-center -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-md ring-4 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Star className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 mt-1">Scholarship</span>
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap hidden sm:inline">
            Find the right ones
          </span>
        </div>

        {/* Node 4: FUTURE (Far-Right) */}
        <div className="absolute right-[2%] top-[12px] flex flex-col items-center translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-[#065F46] text-white flex items-center justify-center shadow-md ring-4 ring-[#FAF8F5] dark:ring-[#0C1513]">
            <Flag className="w-3.5 h-3.5 fill-white stroke-[1.5]" />
          </div>
          <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 mt-1">Future</span>
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap hidden sm:inline">
            Build a brighter tomorrow
          </span>
        </div>

        {/* Folded Golden Paper Plane flying past Future */}
        <div className="absolute right-[-14px] top-[-8px] rotate-[-10deg] animate-float pointer-events-none">
          <svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16 L32 0 L14 26 L12 16 Z" fill="#D97706" />
            <path d="M32 0 L12 16 L22 17 Z" fill="#F59E0B" />
            <path d="M12 16 L14 26 L18 20 Z" fill="#B45309" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN VISUAL SCENE: LAPTOP + BOOKS + PLANT + CAP + SCRIPT */}
      {/* ========================================================================= */}
      <div className="relative pt-2">
        {/* Supporting Left Element: Potted Plant & Stack of 3 Green Hardcover Books */}
        <div className="absolute -left-6 sm:-left-10 bottom-6 sm:bottom-8 z-20 pointer-events-none">
          {/* Potted Plant Foliage (Sitting behind the books) */}
          <div className="absolute -top-16 left-6 z-0">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 56 C34 40 28 28 20 18 C16 28 22 42 34 56 Z" fill="#047857" opacity="0.9" />
              <path d="M34 56 C34 38 40 24 50 16 C54 26 46 42 34 56 Z" fill="#065F46" />
              <path d="M34 56 C33 34 34 16 34 8 C38 20 38 38 34 56 Z" fill="#10B981" />
              <path d="M34 56 C28 44 14 36 6 34 C12 44 24 50 34 56 Z" fill="#064E3B" />
              <path d="M34 56 C40 44 54 36 62 34 C56 44 44 50 34 56 Z" fill="#047857" />
            </svg>
          </div>

          {/* 3 Green Hardcover Books with Gold Spine & Pages */}
          <div className="relative z-10 filter drop-shadow-lg">
            <svg width="105" height="74" viewBox="0 0 105 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Contact Shadow */}
              <ellipse cx="52" cy="70" rx="46" ry="4" fill="#064E3B" fillOpacity="0.2" />

              {/* Book 1 (Bottom): Deep Green with Gold Detail */}
              <g transform="translate(4, 46)">
                <rect x="6" y="0" width="88" height="18" rx="3" fill="#064E3B" />
                {/* Pages */}
                <path d="M14 3 H92 V15 H14 Z" fill="#FAF8F5" />
                <line x1="16" y1="6" x2="88" y2="6" stroke="#E2DACB" strokeWidth="0.6" />
                <line x1="16" y1="9" x2="88" y2="9" stroke="#E2DACB" strokeWidth="0.6" />
                <line x1="16" y1="12" x2="88" y2="12" stroke="#E2DACB" strokeWidth="0.6" />
                {/* Spine */}
                <rect x="4" y="0" width="11" height="18" rx="2" fill="#033527" />
                <line x1="9" y1="3" x2="9" y2="15" stroke="#F59E0B" strokeWidth="1" />
              </g>

              {/* Book 2 (Middle): Forest Green with Gold Lines */}
              <g transform="translate(10, 26)">
                <rect x="5" y="0" width="84" height="17" rx="3" fill="#047857" />
                {/* Pages */}
                <path d="M13 3 H87 V14 H13 Z" fill="#FBF9F5" />
                <line x1="15" y1="6" x2="84" y2="6" stroke="#E2DACB" strokeWidth="0.6" />
                <line x1="15" y1="9" x2="84" y2="9" stroke="#E2DACB" strokeWidth="0.6" />
                {/* Spine */}
                <rect x="3" y="0" width="10" height="17" rx="2" fill="#065F46" />
                <line x1="8" y1="3" x2="8" y2="14" stroke="#FBBF24" strokeWidth="1" />
              </g>

              {/* Book 3 (Top): Emerald with Gold Trim */}
              <g transform="translate(16, 8)">
                <rect x="5" y="0" width="76" height="16" rx="3" fill="#064E3B" />
                {/* Pages */}
                <path d="M12 3 H79 V13 H12 Z" fill="#FAF8F5" />
                <line x1="14" y1="6" x2="76" y2="6" stroke="#E2DACB" strokeWidth="0.6" />
                {/* Spine */}
                <rect x="3" y="0" width="9" height="16" rx="2" fill="#032E23" />
                <line x1="7" y1="3" x2="7" y2="13" stroke="#F59E0B" strokeWidth="1" />
                {/* Bookmark ribbon */}
                <path d="M42 0 V20 L45 17 L48 20 V0 H42 Z" fill="#D97706" />
              </g>
            </svg>
          </div>
        </div>

        {/* 3D LAPTOP (Central Product Object, ~15-20° perspective tilt) */}
        <div
          className="relative z-10 ml-auto mr-4 sm:mr-8 max-w-[390px] sm:max-w-[440px]"
          style={{ perspective: '1100px' }}
        >
          <div
            style={{
              transform: 'rotateY(-8deg) rotateX(6deg)',
              transformStyle: 'preserve-3d',
            }}
            className="transition-transform duration-500 ease-out hover:rotate-y-[-4deg] hover:rotate-x-[3deg]"
          >
            {/* Screen Lid Shell */}
            <div className="rounded-t-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-2.5 pt-2 pb-1 shadow-2xl border border-slate-700/80">
              {/* Webcam Bezel */}
              <div className="flex items-center justify-center pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ring-1 ring-slate-800 inline-block" />
              </div>

              {/* Screen Interior Display Surface */}
              <div className="relative overflow-hidden bg-white dark:bg-[#0C1513] rounded-xl p-3 sm:p-4 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-inner">
                {/* Top App Bar inside Laptop */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
                  {/* Left: Edvora Brand */}
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/edvora-emblem.png"
                      alt="Edvora"
                      className="w-4 h-4 object-contain"
                    />
                    <span className="text-xs font-black font-editorial text-[#064E3B] dark:text-emerald-400">
                      Edvora
                    </span>
                  </div>

                  {/* Right Icons: Bookmark, Language, Avatar */}
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-[9px]">
                    <Bookmark className="w-3 h-3 text-stone-400" />
                    <span className="flex items-center gap-0.5">
                      <Globe className="w-3 h-3 text-stone-400" />
                      <span className="font-semibold text-[8.5px]">EN</span>
                    </span>
                    <div className="w-4 h-4 rounded-full bg-[#065F46] text-white flex items-center justify-center">
                      <User className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>

                {/* Main Screen Layout: Form on Left + Stats Card on Right */}
                <div className="grid grid-cols-12 gap-3 text-left items-center">
                  {/* Left: Scholarship Finder Inputs */}
                  <div className="col-span-8 space-y-1.5">
                    <div>
                      <h4 className="text-[11.5px] font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                        Find scholarships for you
                      </h4>
                      <p className="text-[8px] text-stone-500 dark:text-stone-400">
                        Answer a few questions and get personalised matches
                      </p>
                    </div>

                    {/* Field 1: Education */}
                    <div>
                      <span className="text-[7.5px] font-semibold text-stone-500 dark:text-stone-400 block">
                        What are you studying?
                      </span>
                      <div className="mt-0.5 px-2 py-1 rounded-md bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Diploma</span>
                        <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                      </div>
                    </div>

                    {/* Field 2: Income */}
                    <div>
                      <span className="text-[7.5px] font-semibold text-stone-500 dark:text-stone-400 block">
                        Annual family income
                      </span>
                      <div className="mt-0.5 px-2 py-1 rounded-md bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Below ₹2.5 Lakh</span>
                        <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                      </div>
                    </div>

                    {/* Field 3: Location */}
                    <div>
                      <span className="text-[7.5px] font-semibold text-stone-500 dark:text-stone-400 block">
                        State / Location
                      </span>
                      <div className="mt-0.5 px-2 py-1 rounded-md bg-stone-50 dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>Gujarat</span>
                        <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={onFindScholarships}
                      className="w-full mt-1 py-1.5 px-2 rounded-lg bg-[#064E3B] hover:bg-[#043E2F] text-white text-[9.5px] font-bold shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Find Matches</span>
                      <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                    </button>
                  </div>

                  {/* Right: Matches Found Card with Bar Chart */}
                  <div className="col-span-4 h-full flex items-center">
                    <div className="w-full py-4 px-2 rounded-xl bg-[#F0FDF4] dark:bg-[#142420] border border-emerald-200/80 dark:border-emerald-800/80 text-center flex flex-col items-center justify-center">
                      <div className="w-7 h-7 rounded-lg bg-[#065F46] text-white flex items-center justify-center mb-1">
                        <BarChart3 className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                      </div>
                      <span className="text-2xl font-black text-[#064E3B] dark:text-emerald-400 font-editorial leading-none">
                        3
                      </span>
                      <span className="text-[8.5px] font-bold text-stone-700 dark:text-stone-300 mt-0.5 leading-tight">
                        Scholarships
                      </span>
                      <span className="text-[7.5px] text-stone-500 dark:text-stone-400">
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
                viewBox="0 0 380 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="laptopBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                </defs>

                {/* Hinge Line */}
                <rect x="20" y="0" width="340" height="2" fill="#0F172A" />

                {/* Base Deck Surface (projecting forward in perspective) */}
                <path
                  d="M 10 2 L 370 2 L 380 54 C 380 58, 376 60, 370 60 L 10 60 C 4 60, 0 58, 0 54 Z"
                  fill="url(#laptopBaseGrad)"
                />
                <path d="M 10 2 L 370 2" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />

                {/* Keyboard Well */}
                <path d="M 38 6 L 342 6 L 350 32 L 30 32 Z" fill="#0F172A" fillOpacity="0.85" />

                {/* Keycap Rows */}
                <rect x="42" y="8" width="296" height="3.5" rx="0.8" fill="#1E293B" />
                <rect x="40" y="13" width="300" height="4" rx="0.8" fill="#1E293B" />
                <rect x="38" y="18.5" width="304" height="4" rx="0.8" fill="#1E293B" />
                {/* Spacebar Row */}
                <rect x="36" y="24" width="32" height="5" rx="0.8" fill="#1E293B" />
                <rect x="94" y="24" width="192" height="5" rx="0.8" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
                <rect x="312" y="24" width="32" height="5" rx="0.8" fill="#1E293B" />

                {/* Trackpad */}
                <rect
                  x="150"
                  y="36"
                  width="80"
                  height="18"
                  rx="2"
                  fill="#94A3B8"
                  fillOpacity="0.4"
                  stroke="#64748B"
                  strokeWidth="0.6"
                />

                {/* Front Lip with Thumb Opening Notch */}
                <path d="M 170 54 C 170 56, 174 58, 180 58 L 200 58 C 206 58, 210 56, 210 54 Z" fill="#475569" />
                <path d="M 0 54 L 380 54" stroke="#475569" strokeWidth="0.8" />
              </svg>

              {/* Realistic Ground Shadow */}
              <div className="h-5 w-[92%] mx-auto bg-slate-900/20 dark:bg-black/60 blur-xl rounded-full -mt-3" />
            </div>
          </div>
        </div>

        {/* Graduation Cap Tilted on Upper-Right Screen Rim */}
        <div
          className="absolute right-0 sm:right-2 top-[-16px] sm:top-[-20px] z-30 pointer-events-none filter drop-shadow-xl animate-float"
          title="Graduation Cap"
        >
          <svg width="78" height="68" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Skull Cap Lower Section */}
            <path
              d="M36 44 C36 58 44 68 54 68 C64 68 72 58 72 44 C72 43 64 46 54 46 C44 46 36 43 36 44 Z"
              fill="#064E3B"
            />
            {/* Mortarboard Diamond (Tilted) */}
            <path
              d="M52 14 L92 34 L52 54 L12 34 Z"
              fill="#064E3B"
              stroke="#10B981"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Golden Center Button */}
            <ellipse cx="52" cy="34" rx="4" ry="2.5" fill="#F59E0B" />
            {/* Golden Tassel Draped Down Right Edge */}
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

        {/* Cursive Calligraphy Accent: "Small Steps, Brighter Futures" with Gold Underline */}
        <div className="absolute -right-4 sm:-right-8 top-16 sm:top-20 z-10 pointer-events-none hidden md:block">
          <div className="text-right">
            <span
              className="text-stone-600 dark:text-stone-400 text-sm sm:text-base font-editorial italic block transform rotate-[-4deg]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Small Steps, <br />
              <span className="text-[#064E3B] dark:text-emerald-400 font-bold">Brighter Futures</span>
            </span>
            {/* Golden curved brush underline stroke */}
            <svg width="72" height="10" viewBox="0 0 72 10" fill="none" className="ml-auto mt-0.5">
              <path
                d="M4 6 C24 1, 48 8, 68 3"
                stroke="#D97706"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* ONE FLOATING SCHOLARSHIP CARD (Overlapping Lower-Right of Laptop) */}
        <div
          className="absolute -bottom-4 right-0 sm:right-2 z-30 animate-float max-w-[215px] sm:max-w-[235px]"
          style={{ animationDuration: '7s' }}
        >
          <div className="bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xl shadow-stone-900/10 dark:shadow-black/50 hover:shadow-2xl transition-all">
            {/* Top Row: 🎓 Scholarship + ● OPEN badge */}
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-1 text-[10px] font-bold text-stone-800 dark:text-stone-200">
                <GraduationCap className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                <span>Scholarship</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ● OPEN
              </span>
            </div>

            {/* Scholarship Title */}
            <h5 className="text-xs font-bold text-slate-900 dark:text-stone-100 font-editorial line-clamp-1 leading-snug">
              Central Sector Scheme (CSSS)
            </h5>

            {/* Award Amount */}
            <p className="text-xs sm:text-sm font-black text-[#064E3B] dark:text-emerald-400 mt-0.5">
              ₹12,000 <span className="text-[9.5px] font-normal text-stone-500 dark:text-stone-400">/ year</span>
            </p>

            {/* Footer Tags & Arrow Action */}
            <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  Undergraduate
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  Govt. of India
                </span>
              </div>

              {/* Circular Arrow Button */}
              <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
