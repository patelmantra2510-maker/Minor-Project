import React from 'react';
import {
  Cap3D,
  Books3D,
  Star3D,
} from '../common/Educational3DObjects';
import { Search, FileText, Star, Flag, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DiscoveryDeskCompositionProps {
  onFindScholarships?: () => void;
}

export const DiscoveryDeskComposition: React.FC<DiscoveryDeskCompositionProps> = ({
  onFindScholarships,
}) => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto select-none py-6 sm:py-8">
      {/* 1. Subtle Journey Pathway (Curved dotted arc around the desk) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 540 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft background aura */}
        <radialGradient id="deskGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5EFE6" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#FAF8F5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>
        <circle cx="270" cy="240" r="210" fill="url(#deskGlow)" />

        {/* Journey Arc: EXPLORE -> MATCH -> SCHOLARSHIP -> FUTURE */}
        <path
          d="M 50 280 C 40 140, 160 50, 310 50 C 420 50, 490 120, 490 220 C 490 320, 420 420, 310 430 C 200 440, 90 410, 60 370"
          stroke="#065F46"
          strokeWidth="1.6"
          strokeDasharray="4 6"
          strokeOpacity="0.25"
        />
        <path
          d="M 50 280 C 40 140, 160 50, 310 50 C 420 50, 490 120, 490 220 C 490 320, 420 420, 310 430 C 200 440, 90 410, 60 370"
          stroke="#D97706"
          strokeWidth="1"
          strokeDasharray="2 8"
          strokeOpacity="0.35"
        />
      </svg>

      {/* 4 Journey Milestones: Positioned subtly along the path */}
      {/* 01. EXPLORE */}
      <div className="absolute top-8 left-12 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#142420]/90 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs text-[10px] font-bold text-stone-700 dark:text-stone-300">
        <Search className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
        <span className="tracking-wider">EXPLORE</span>
      </div>

      {/* 02. MATCH */}
      <div className="absolute top-6 right-16 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#142420]/90 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs text-[10px] font-bold text-stone-700 dark:text-stone-300">
        <FileText className="w-3 h-3 text-[#D97706] dark:text-amber-400" />
        <span className="tracking-wider">MATCH</span>
      </div>

      {/* 03. SCHOLARSHIP */}
      <div className="absolute top-1/2 -right-4 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#142420]/90 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs text-[10px] font-bold text-stone-700 dark:text-stone-300">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span className="tracking-wider">SCHOLARSHIP</span>
      </div>

      {/* 04. FUTURE */}
      <div className="absolute bottom-4 left-1/3 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#142420]/90 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs text-[10px] font-bold text-stone-700 dark:text-stone-300">
        <Flag className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
        <span className="tracking-wider">FUTURE</span>
      </div>

      {/* Supporting Accent 1: Graduation Cap (Top Left) */}
      <div className="absolute top-2 left-6 sm:left-4 z-20 animate-float" title="Graduation Cap">
        <Cap3D size={52} />
      </div>

      {/* Supporting Accent 2: Stack of Books (Bottom Left) */}
      <div className="absolute bottom-8 -left-2 sm:-left-4 z-20 animate-float-alt" title="Study Books">
        <Books3D size={50} />
      </div>

      {/* Supporting Accent 3: Subtle Gold Star / Spark (Top Right) */}
      <div className="absolute top-8 right-8 sm:right-6 z-20 animate-float-alt" title="Golden Academic Spark">
        <Star3D size={32} />
      </div>

      {/* Supporting Accent 4: One Small Botanical Plant (Bottom Right) */}
      <div className="absolute bottom-6 right-2 sm:right-4 z-20" title="Botanical Growth Plant">
        <svg width="48" height="60" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
          {/* Terracotta / Ceramic pot */}
          <path d="M12 40 L15 56 H33 L36 40 H12 Z" fill="#D97706" fillOpacity="0.85" stroke="#B45309" strokeWidth="1.2" />
          <rect x="10" y="38" width="28" height="4" rx="2" fill="#B45309" />
          {/* Stem & Leaves (matching Edvora botanical motif) */}
          <path d="M24 38 V18" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          {/* Left leaf */}
          <path d="M24 28 C16 26 12 20 14 14 C18 14 22 22 24 28 Z" fill="#065F46" />
          {/* Right leaf with dual-tone gold accent */}
          <path d="M24 24 C32 22 36 16 34 10 C30 10 26 18 24 24 Z" fill="#047857" />
          <path d="M24 24 C28 20 31 16 30 12 C28 13 25 18 24 24 Z" fill="#F59E0B" />
          {/* Top sprout */}
          <path d="M24 18 C22 12 24 6 24 6 C24 6 26 12 24 18 Z" fill="#10B981" />
        </svg>
      </div>

      {/* CENTRAL OBJECT: Realistic-but-Stylized Laptop with Simplified Edvora Match Interface */}
      <div className="relative z-10 mx-auto max-w-[380px] sm:max-w-[420px] filter drop-shadow-xl">
        {/* Laptop Display Screen Enclosure */}
        <div className="rounded-t-2xl bg-[#0F172A] p-2.5 pt-2.5 pb-2 shadow-inner border border-slate-700">
          {/* Screen Bezel Notch & Webcam */}
          <div className="flex items-center justify-between px-2 mb-1.5 text-[9px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            {/* Webcam dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
            <span className="text-[8px] font-mono opacity-60">edvora.in/find</span>
          </div>

          {/* Screen Content Window */}
          <div className="bg-[#FAF8F5] dark:bg-[#0C1513] rounded-xl p-4 sm:p-5 border border-[#E8E2D7] dark:border-[#1E3A33] text-stone-900 dark:text-stone-100 transition-colors">
            {/* Window Header with Edvora Emblem */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
              <div className="flex items-center gap-2">
                <img
                  src="/edvora-emblem.png"
                  alt="Edvora Emblem"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-black font-editorial text-[#064E3B] dark:text-emerald-400">
                  Edvora Matching
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                Live Preview
              </span>
            </div>

            {/* Simplified Matching Interface */}
            <div className="mt-3 space-y-2.5 text-left">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                Find scholarships for you
              </h4>

              {/* Field 1: Education */}
              <div>
                <label className="text-[9.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                  What are you studying?
                </label>
                <div className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[11px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Diploma in Engineering</span>
                  <span className="text-[9px] text-[#065F46] dark:text-emerald-400 font-bold">✓ Selected</span>
                </div>
              </div>

              {/* Field 2: Income */}
              <div>
                <label className="text-[9.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                  Annual family income
                </label>
                <div className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[11px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Below ₹2.5 Lakh</span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">Priority</span>
                </div>
              </div>

              {/* Field 3: Location */}
              <div>
                <label className="text-[9.5px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-0.5">
                  State / Location
                </label>
                <div className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#142420] border border-[#E2DACB] dark:border-[#1E3A33] text-[11px] font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>Gujarat</span>
                  <span className="text-[9px] text-stone-400">Domicile</span>
                </div>
              </div>

              {/* Action Button inside Laptop */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onFindScholarships}
                  className="w-full py-2 px-3 rounded-lg bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Find Matches</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                </button>
              </div>

              {/* Output Result Card Banner */}
              <div className="pt-1">
                <div className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#142420] border border-[#065F46]/20 dark:border-emerald-800 text-[10.5px] text-[#064E3B] dark:text-emerald-300 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>3 Scholarships Found</span>
                  </span>
                  <span className="text-[9.5px] font-semibold text-stone-500 dark:text-stone-400">
                    MYSY · AICTE · CSSS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Bottom Base & Hinge */}
        <div className="relative">
          {/* Base Top Surface */}
          <div className="h-3.5 bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] dark:from-slate-700 dark:to-slate-800 rounded-b-xl border-t border-slate-300 dark:border-slate-600 flex items-center justify-center">
            {/* Center Thumb Notch for opening lid */}
            <div className="w-14 h-1 bg-slate-400 dark:bg-slate-900 rounded-full" />
          </div>
          {/* Desk shadow */}
          <div className="h-3 w-[92%] mx-auto bg-black/15 blur-sm rounded-full -mt-1" />
        </div>
      </div>
    </div>
  );
};
