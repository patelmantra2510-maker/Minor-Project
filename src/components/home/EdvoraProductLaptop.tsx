import React from 'react';
import {
  Bookmark,
  Globe,
  User,
  ChevronDown,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

interface EdvoraProductLaptopProps {
  onFindScholarships?: () => void;
  className?: string;
}

export const EdvoraProductLaptop: React.FC<EdvoraProductLaptopProps> = ({
  onFindScholarships,
  className = '',
}) => {
  return (
    <div className={`relative select-none ${className}`}>
      {/* 3D Perspective Wrapper (~12-15° subtle product-render perspective) */}
      <div
        className="relative mx-auto max-w-[325px] sm:max-w-[345px]"
        style={{ perspective: '1100px' }}
      >
        <div
          style={{
            transform: 'rotateY(-7deg) rotateX(6deg)',
            transformStyle: 'preserve-3d',
          }}
          className="transition-transform duration-500 ease-out hover:rotate-y-[-4deg] hover:rotate-x-[4deg]"
        >
          {/* ================================================================= */}
          {/* 1. SCREEN LID (Warm Silver / Champagne Aluminum Chassis)          */}
          {/* ================================================================= */}
          <div className="relative rounded-t-2xl p-[3px] sm:p-1 bg-gradient-to-b from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1] shadow-2xl border-t border-l border-r border-white/80">
            {/* Display Bezel (Slim Slate Frame with Precision Webcam) */}
            <div className="relative rounded-t-xl bg-[#0F172A] p-2 pt-1.5 pb-1 overflow-hidden shadow-inner">
              {/* Webcam & Ambient Sensor */}
              <div className="flex items-center justify-center gap-1.5 pb-1">
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-slate-700/80 inline-block shadow-xs" />
                <span className="w-1 h-1 rounded-full bg-slate-700" />
              </div>

              {/* Display Screen Panel (Miniature Edvora Product UI) */}
              <div className="relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0C1513] rounded-lg p-2.5 sm:p-3 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs text-stone-900 dark:text-stone-100">
                {/* Natural Glass Specular Diagonal Reflection Sheen */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-white/22 via-white/6 to-transparent rotate-45 pointer-events-none z-10" />

                {/* Miniature Edvora Top App Bar */}
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
                  {/* Brand Mark */}
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/edvora-emblem.png"
                      alt="Edvora"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span className="text-[10px] font-black font-editorial text-[#064E3B] dark:text-emerald-400 tracking-tight">
                      Edvora
                    </span>
                  </div>

                  {/* Header Actions */}
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

                {/* Screen Content: Finder Form (Left) + Result Card (Right) */}
                <div className="grid grid-cols-12 gap-2 text-left items-center">
                  {/* Left Column: Finder Inputs */}
                  <div className="col-span-8 space-y-1">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                        Find scholarships for you
                      </h4>
                      <p className="text-[6.5px] sm:text-[7px] text-stone-500 dark:text-stone-400 leading-none mt-0.5">
                        Answer a few questions and get personalised matches.
                      </p>
                    </div>

                    {/* Input 1: Education Level */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        What are you studying?
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between shadow-2xs">
                        <span>Diploma</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Input 2: Family Income */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        Annual family income
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between shadow-2xs">
                        <span>Below ₹2.5 Lakh</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Input 3: State / Location */}
                    <div>
                      <span className="text-[6.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                        State / Location
                      </span>
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[8px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between shadow-2xs">
                        <span>Gujarat</span>
                        <ChevronDown className="w-2 h-2 text-stone-400" />
                      </div>
                    </div>

                    {/* Action CTA Button */}
                    <button
                      type="button"
                      onClick={onFindScholarships}
                      className="w-full mt-1 py-1 px-2 rounded bg-[#064E3B] hover:bg-[#043E2F] text-white text-[8.5px] font-bold shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span>Find Matches</span>
                      <ArrowRight className="w-2 h-2 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Right Column: Matched Count Badge */}
                  <div className="col-span-4 h-full flex items-center">
                    <div className="w-full py-2.5 px-1 rounded-xl bg-emerald-50/90 dark:bg-[#142420] border border-emerald-200/90 dark:border-emerald-800/80 text-center flex flex-col items-center justify-center shadow-2xs">
                      <div className="w-5 h-5 rounded-md bg-[#065F46] text-white flex items-center justify-center mb-0.5 shadow-xs">
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
          </div>

          {/* ================================================================= */}
          {/* 2. LAPTOP HINGE & LOWER BASE CHASSIS                              */}
          {/* Warm Champagne Silver Unibody Base with Keyboard Deck & Trackpad */}
          {/* ================================================================= */}
          <div className="relative">
            <svg
              className="w-full h-auto block -mt-[1px]"
              viewBox="0 0 340 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Champagne Silver Metallic Gradient */}
                <linearGradient id="champagneBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="25%" stopColor="#E2E8F0" />
                  <stop offset="75%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>

                {/* Keyboard Well Inset Shadow */}
                <linearGradient id="kbWellShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>

              {/* Cylindrical Recessed Hinge */}
              <rect x="18" y="0" width="304" height="2.5" rx="1" fill="#1E293B" />

              {/* Base Deck Surface (Projecting forward in subtle 3D perspective) */}
              <path
                d="M 6 2 L 334 2 L 340 45 C 340 48, 336 50, 330 50 L 10 50 C 4 50, 0 48, 0 45 Z"
                fill="url(#champagneBase)"
              />

              {/* Upper Metallic Highlight Chamfer */}
              <path d="M 6 2 L 334 2" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.9" />

              {/* Recessed Keyboard Deck Area */}
              <path
                d="M 28 5.5 L 312 5.5 L 318 27 L 22 27 Z"
                fill="url(#kbWellShadow)"
                stroke="#64748B"
                strokeWidth="0.4"
              />

              {/* Modern Minimal Chiclet Key Rows */}
              <rect x="32" y="7.5" width="276" height="3" rx="0.6" fill="#334155" />
              <rect x="30" y="11.5" width="280" height="3.5" rx="0.6" fill="#334155" />
              <rect x="28" y="16" width="284" height="3.5" rx="0.6" fill="#334155" />

              {/* Spacebar Row */}
              <g transform="translate(26, 20.5)">
                <rect x="0" y="0" width="28" height="4.5" rx="0.6" fill="#334155" />
                <rect x="32" y="0" width="16" height="4.5" rx="0.6" fill="#334155" />
                <rect x="52" y="0" width="184" height="4.5" rx="0.6" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <rect x="240" y="0" width="16" height="4.5" rx="0.6" fill="#334155" />
                <rect x="260" y="0" width="28" height="4.5" rx="0.6" fill="#334155" />
              </g>

              {/* Centered Precision Glass Trackpad */}
              <rect
                x="132"
                y="31"
                width="76"
                height="15"
                rx="2"
                fill="#CBD5E1"
                fillOpacity="0.45"
                stroke="#94A3B8"
                strokeWidth="0.6"
              />

              {/* Front Lip Bevel & Opening Thumb Notch */}
              <path
                d="M 150 45 C 150 47, 154 48.5, 160 48.5 L 180 48.5 C 186 48.5, 190 47, 190 45 Z"
                fill="#475569"
              />
              <path d="M 0 45 L 340 45" stroke="#64748B" strokeWidth="0.6" />
            </svg>

            {/* ================================================================= */}
            {/* 3. DUAL-LAYER GROUND CONTACT SHADOW                               */}
            {/* Sharp contact shadow + Soft wide ambient shadow                   */}
            {/* ================================================================= */}
            {/* Layer 1: Tight Contact Shadow directly beneath base */}
            <div className="h-2 w-[88%] mx-auto bg-slate-900/25 dark:bg-black/60 blur-xs rounded-full -mt-1.5" />
            {/* Layer 2: Soft Ambient Ground Shadow spreading onto desk plane */}
            <div className="h-5 w-[94%] mx-auto bg-gradient-to-r from-[#064E3B]/15 via-slate-900/20 to-slate-900/15 dark:from-black/40 dark:via-black/55 dark:to-black/35 blur-xl rounded-full -mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
