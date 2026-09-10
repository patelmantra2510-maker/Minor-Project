import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface DiscoveryDeskCompositionProps {
  onFindScholarships?: () => void;
}

export const DiscoveryDeskComposition: React.FC<DiscoveryDeskCompositionProps> = ({
  onFindScholarships,
}) => {
  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[450px] mx-auto select-none py-6 sm:py-8">
      {/* ========================================================================= */}
      {/* 1. SUBTLE BACKGROUND HALO & SAGE TEXTURE */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#FAF8F5] via-[#F3EDE2]/50 to-[#E8E2D7]/25 blur-3xl dark:from-[#0C1513] dark:via-[#142420]/30 dark:to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBTLE CURVED JOURNEY LINE (Passing BEHIND hero objects) */}
      {/* Single elegant curved dotted line with tiny integrated typographic markers */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 450 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="journeyDottedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0.32" />
          </linearGradient>
        </defs>

        {/* Delicate sweeping curved path */}
        <path
          d="M 45 130 C 55 45, 175 25, 270 30 C 375 35, 430 110, 420 205 C 410 295, 330 365, 220 360 C 150 355, 80 330, 60 275"
          stroke="url(#journeyDottedGrad)"
          strokeWidth="1.3"
          strokeDasharray="4 6"
        />

        {/* Marker 1: Explore (Top-Left, along the path) */}
        <g transform="translate(100, 38)">
          <circle cx="0" cy="0" r="2.5" fill="#065F46" />
          <text
            x="8"
            y="3"
            fontSize="9.5"
            fontWeight="600"
            fill="#065F46"
            letterSpacing="0.08em"
            className="dark:fill-emerald-400 select-none"
          >
            Explore →
          </text>
        </g>

        {/* Marker 2: Match (Top-Right, along the path) */}
        <g transform="translate(365, 58)">
          <circle cx="0" cy="0" r="2.5" fill="#D97706" />
          <text
            x="8"
            y="3"
            fontSize="9.5"
            fontWeight="600"
            fill="#B45309"
            letterSpacing="0.08em"
            className="dark:fill-amber-400 select-none"
          >
            Match →
          </text>
        </g>

        {/* Marker 3: Scholarship (Mid-Right, along the path) */}
        <g transform="translate(422, 195)">
          <circle cx="0" cy="0" r="2.5" fill="#D97706" />
          <text
            x="8"
            y="3"
            fontSize="9.5"
            fontWeight="600"
            fill="#B45309"
            letterSpacing="0.08em"
            className="dark:fill-amber-400 select-none"
          >
            Scholarship →
          </text>
        </g>

        {/* Marker 4: Future (Bottom-Center, along the path) */}
        <g transform="translate(200, 362)">
          <circle cx="0" cy="0" r="2.5" fill="#065F46" />
          <text
            x="8"
            y="3"
            fontSize="9.5"
            fontWeight="600"
            fill="#065F46"
            letterSpacing="0.08em"
            className="dark:fill-emerald-400 select-none"
          >
            Future
          </text>
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 3. GRADUATION CAP (Small, elegant, floating above/behind the laptop) */}
      {/* ========================================================================= */}
      <div
        className="absolute -top-3 left-[18%] z-15 animate-float pointer-events-none"
        title="Graduation Cap"
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Skull cap underside */}
          <path
            d="M32 50C32 64 40 74 50 74C60 74 68 64 68 50C68 49 60 52 50 52C40 52 32 49 32 50Z"
            fill="#043E2F"
          />
          {/* Mortarboard Diamond (Deep forest green with subtle lighting) */}
          <path
            d="M50 20L88 38L50 56L12 38L50 20Z"
            fill="#064E3B"
            stroke="#10B981"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Center Golden Button */}
          <ellipse cx="50" cy="38" rx="4" ry="2.5" fill="#F59E0B" />
          {/* Flowing Gold Tassel */}
          <path
            d="M50 38C62 38 72 44 74 54L76 66"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M72 66C72 64 80 64 80 66L78 76C78 78 74 78 74 76L72 66Z"
            fill="#D97706"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. GOLD SPARK 1 (Small 4-pointed sparkle near graduation cap) */}
      {/* ========================================================================= */}
      <div className="absolute top-1 left-[38%] z-15 pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
            fill="#F59E0B"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 5. GOLD SPARK 2 (Tiny 4-pointed sparkle near mid-right) */}
      {/* ========================================================================= */}
      <div className="absolute top-[48%] -right-2 z-15 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
            fill="#D97706"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 6. BOOKS STACK (Small stack of 3 3D books to the LEFT of the laptop) */}
      {/* References Edvora logo colors: deep green, cream, muted gold. NO text. */}
      {/* ========================================================================= */}
      <div
        className="absolute bottom-7 -left-4 sm:-left-6 z-25 pointer-events-none"
        title="Edvora Study Volumes"
      >
        <svg
          width="74"
          height="60"
          viewBox="0 0 74 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-md"
        >
          {/* Shadow under books */}
          <ellipse cx="37" cy="56" rx="30" ry="3.5" fill="#064E3B" fillOpacity="0.12" />

          {/* Book 1 (Bottom): Deep Forest Green with Gold Spine Foil Line */}
          <g transform="translate(3, 38)">
            {/* Book Body */}
            <rect x="5" y="0" width="58" height="13" rx="2" fill="#064E3B" />
            {/* Paper Pages Side */}
            <path d="M10 2 H61 V11 H10 Z" fill="#FAF8F5" />
            {/* Spine */}
            <rect x="3" y="0" width="8" height="13" rx="2" fill="#033527" />
            <line x1="7" y1="2" x2="7" y2="11" stroke="#F59E0B" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Book 2 (Middle): Warm Ivory / Cream Volume */}
          <g transform="translate(8, 23)">
            {/* Book Body */}
            <rect x="4" y="0" width="54" height="12" rx="2" fill="#FAF8F5" stroke="#E2DACB" strokeWidth="0.7" />
            {/* Paper Pages */}
            <path d="M9 2 H56 V10 H9 Z" fill="#F3EDE2" />
            {/* Spine */}
            <rect x="2" y="0" width="8" height="12" rx="1.5" fill="#E8E2D7" />
            <line x1="6" y1="2" x2="6" y2="10" stroke="#065F46" strokeWidth="0.7" opacity="0.4" />
          </g>

          {/* Book 3 (Top): Muted Gold / Amber Volume with Ribbon Bookmark */}
          <g transform="translate(13, 9)">
            {/* Book Body */}
            <rect x="4" y="0" width="48" height="11" rx="2" fill="#D97706" />
            {/* Paper Pages */}
            <path d="M8 2 H50 V9 H8 Z" fill="#FAF8F5" />
            {/* Spine */}
            <rect x="2" y="0" width="7" height="11" rx="1.5" fill="#B45309" />
            {/* Fine Silk Bookmark Ribbon hanging out */}
            <path d="M28 0 V16 L31 13 L34 16 V0 H28 Z" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 7. CENTRAL VISUAL: PREMIUM 3D LAPTOP */}
      {/* With 3D perspective, visible keyboard/base, soft realistic shadow, */}
      {/* screen showing Edvora interface (NO fake claims / NO 100% verified) */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 mx-auto max-w-[335px] sm:max-w-[355px]"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="transition-transform duration-500 ease-out hover:-translate-y-1"
          style={{
            transform: 'rotateY(-5deg) rotateX(4deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* --- DISPLAY LID & SCREEN --- */}
          <div className="rounded-t-xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0F1D] p-2 pt-1.5 pb-1 shadow-2xl border border-slate-700/70">
            {/* Screen Bezel Top Bar: Web Camera & Indicators */}
            <div className="flex items-center justify-between px-1.5 mb-1 text-[8px] text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              {/* Webcam Lens */}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block ring-1 ring-slate-800" />
              <span className="text-[7.5px] font-mono opacity-50">edvora.in</span>
            </div>

            {/* Screen Interior Display Surface */}
            <div className="relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0C1513] rounded-lg p-3 sm:p-3.5 border border-[#E8E2D7] dark:border-[#1E3A33] text-stone-900 dark:text-stone-100 shadow-inner">
              {/* Natural Glass Gloss Reflection */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-bl from-white/14 via-white/4 to-transparent rotate-45 pointer-events-none" />

              {/* Window Header with Edvora Emblem (Clean, zero fake percentages) */}
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
                <div className="flex items-center gap-1.5">
                  <img
                    src="/edvora-emblem.png"
                    alt="Edvora"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-[11px] font-extrabold font-editorial text-[#064E3B] dark:text-emerald-400 tracking-tight">
                    Edvora
                  </span>
                </div>
                <span className="text-[8px] font-semibold text-stone-500 dark:text-stone-400">
                  Scholarship Discovery
                </span>
              </div>

              {/* Simplified Edvora Interface */}
              <div className="space-y-1.5 text-left">
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                  Find scholarships for you
                </h4>

                {/* Field 1: Course */}
                <div>
                  <span className="text-[8px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    What are you studying?
                  </span>
                  <div className="mt-0.5 px-2 py-1 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9.5px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                    <span>Diploma</span>
                    <span className="text-[8.5px] text-[#065F46] dark:text-emerald-400 font-bold">✓</span>
                  </div>
                </div>

                {/* Field 2: Income */}
                <div>
                  <span className="text-[8px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    Annual family income
                  </span>
                  <div className="mt-0.5 px-2 py-1 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9.5px] font-semibold text-stone-800 dark:text-stone-200">
                    <span>Below ₹2.5 Lakh</span>
                  </div>
                </div>

                {/* Field 3: Location */}
                <div>
                  <span className="text-[8px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                    State / Location
                  </span>
                  <div className="mt-0.5 px-2 py-1 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[9.5px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                    <span>Gujarat</span>
                    <span className="text-[8px] text-stone-400 font-normal">State</span>
                  </div>
                </div>

                {/* CTA Button inside Screen */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={onFindScholarships}
                    className="w-full py-1.5 px-2.5 rounded bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-[9.5px] font-bold shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Find Matches</span>
                    <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                  </button>
                </div>

                {/* Result: 3 Scholarships Found */}
                <div className="px-2 py-1 rounded bg-emerald-50 dark:bg-[#142420] border border-[#065F46]/20 dark:border-emerald-800/60 text-[9px] text-[#064E3B] dark:text-emerald-300 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    <span>3 Scholarships Found</span>
                  </span>
                  <span className="text-[8px] text-stone-500 dark:text-stone-400 font-medium">
                    Matches
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- LAPTOP KEYBOARD BASE (3D perspective lower deck) --- */}
          <div className="relative">
            {/* Metallic Unibody Deck with Keyboard Well and Trackpad */}
            <svg
              className="w-full h-auto block -mt-[1px]"
              viewBox="0 0 360 62"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="baseChassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="60%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                <linearGradient id="kbWellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1E293B" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Hinge indentation */}
              <rect x="25" y="0" width="310" height="2" fill="#0A0F1D" />

              {/* Base Deck Surface (projecting forward in perspective) */}
              <path
                d="M 12 2 L 348 2 L 360 52 C 360 56, 356 58, 350 58 L 10 58 C 4 58, 0 56, 0 52 Z"
                fill="url(#baseChassisGrad)"
              />

              {/* Top metallic highlight chamfer */}
              <path
                d="M 12 2 L 348 2"
                stroke="#F1F5F9"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />

              {/* Recessed Keyboard Deck Area */}
              <path
                d="M 38 6 L 322 6 L 330 32 L 30 32 Z"
                fill="url(#kbWellGrad)"
                stroke="#475569"
                strokeWidth="0.6"
              />

              {/* Subtle Keycap Rows in Keyboard Deck */}
              {/* Row 1 */}
              <rect x="42" y="8" width="276" height="3.5" rx="0.8" fill="#1E293B" stroke="#334155" strokeWidth="0.4" />
              {/* Row 2 */}
              <rect x="40" y="13" width="280" height="4" rx="0.8" fill="#1E293B" stroke="#334155" strokeWidth="0.4" />
              {/* Row 3 */}
              <rect x="38" y="18.5" width="284" height="4" rx="0.8" fill="#1E293B" stroke="#334155" strokeWidth="0.4" />
              {/* Row 4 (with spacebar) */}
              <g transform="translate(36, 24)">
                <rect x="0" y="0" width="30" height="5" rx="0.8" fill="#1E293B" />
                <rect x="34" y="0" width="16" height="5" rx="0.8" fill="#1E293B" />
                <rect x="54" y="0" width="180" height="5" rx="0.8" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
                <rect x="238" y="0" width="16" height="5" rx="0.8" fill="#1E293B" />
                <rect x="258" y="0" width="30" height="5" rx="0.8" fill="#1E293B" />
              </g>

              {/* Centered Glass Trackpad */}
              <rect
                x="142"
                y="36"
                width="76"
                height="17"
                rx="2"
                fill="#94A3B8"
                fillOpacity="0.35"
                stroke="#64748B"
                strokeWidth="0.6"
              />

              {/* Front Lip Chamfer & Center Thumb Notch */}
              <path
                d="M 160 52 C 160 54, 164 56, 170 56 L 190 56 C 196 56, 200 54, 200 52 Z"
                fill="#334155"
              />
              <path
                d="M 0 52 L 360 52"
                stroke="#475569"
                strokeWidth="0.8"
              />
            </svg>

            {/* Soft Ambient Ground Shadow */}
            <div className="h-4 w-[92%] mx-auto bg-slate-900/18 dark:bg-black/50 blur-lg rounded-full -mt-2.5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. ONE FLOATING SCHOLARSHIP CARD (Overlapping lower-right of the laptop) */}
      {/* Real verified scholarship data from dataset: Central Sector Scheme (CSSS) */}
      {/* ========================================================================= */}
      <div
        className="absolute bottom-1 -right-2 sm:-right-5 z-30 animate-float max-w-[205px] sm:max-w-[220px]"
        style={{
          animationDuration: '6s',
        }}
      >
        <div className="bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xl shadow-stone-900/10 dark:shadow-black/40 hover:shadow-2xl transition-all">
          {/* Header: Scholarship Tag + Status */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[8.5px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Scholarship
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ● OPEN
            </span>
          </div>

          {/* Real Scholarship Name */}
          <h5 className="text-[11px] font-bold text-slate-900 dark:text-stone-100 font-editorial line-clamp-1">
            Central Sector Scholarship Scheme
          </h5>

          {/* Real Benefit Amount */}
          <p className="text-xs font-black text-[#064E3B] dark:text-emerald-400 mt-0.5">
            ₹12,000 <span className="text-[9px] font-normal text-stone-500 dark:text-stone-400">/ year</span>
          </p>

          {/* Real Level & Category Tag */}
          <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between text-[8.5px] text-stone-500 dark:text-stone-400 font-semibold">
            <span>Undergraduate</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">Govt. of India</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. BOTANICAL ELEMENT (One subtle plant/leaf element near bottom-right edge) */}
      {/* Very low visual weight, communicates growth. No garden. */}
      {/* ========================================================================= */}
      <div
        className="absolute -bottom-2 right-1 sm:right-2 z-20 pointer-events-none"
        title="Botanical Growth Accent"
      >
        <svg
          width="36"
          height="48"
          viewBox="0 0 36 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-xs"
        >
          {/* Ground shadow */}
          <ellipse cx="18" cy="45" rx="8" ry="2" fill="#064E3B" fillOpacity="0.1" />
          {/* Stem */}
          <path d="M18 45 C18 36, 17 26, 19 14" stroke="#064E3B" strokeWidth="1.6" strokeLinecap="round" />
          {/* Lower Leaf Left (Deep Green) */}
          <path d="M18 33 C11 31, 8 26, 9 20 C13 21, 16 27, 18 33 Z" fill="#065F46" />
          {/* Middle Leaf Right (Deep Green) */}
          <path d="M18 25 C25 23, 28 17, 26 11 C23 12, 19 19, 18 25 Z" fill="#047857" />
          {/* Top Apex Leaf (with Gold highlight like Edvora emblem) */}
          <path d="M19 14 C17 8, 19 3, 19 3 C19 3, 21 8, 19 14 Z" fill="#F59E0B" />
        </svg>
      </div>
    </div>
  );
};
