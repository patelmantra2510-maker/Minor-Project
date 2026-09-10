import React from 'react';
import { DiscoveryDeskComposition } from './DiscoveryDeskComposition';
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Users,
  Target,
  FileCheck2,
  Bookmark,
  GitCompare,
} from 'lucide-react';

interface HeroProps {
  onFindScholarships: () => void;
  onExploreScholarships: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindScholarships,
  onExploreScholarships,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors pb-8 sm:pb-12">
      {/* ========================================================================= */}
      {/* SUBTLE BACKGROUND CORNER WATERCOLOR LEAVES (Reduced size & ~10-15% opacity) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top-Left Sage Foliage */}
        <div className="absolute -top-8 -left-8 w-32 sm:w-40 h-32 sm:h-40 opacity-12 dark:opacity-8">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 20 C60 50 80 110 50 170 C10 140 0 80 20 20 Z" fill="#047857" />
            <path d="M40 20 C90 30 130 80 120 140 C80 120 50 70 40 20 Z" fill="#065F46" />
            <path d="M20 50 C70 80 100 130 90 190 C50 170 30 120 20 50 Z" fill="#10B981" />
          </svg>
        </div>

        {/* Top-Right Sage Foliage */}
        <div className="absolute -top-8 -right-8 w-32 sm:w-40 h-32 sm:h-40 opacity-12 dark:opacity-8 rotate-90">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 20 C60 50 80 110 50 170 C10 140 0 80 20 20 Z" fill="#047857" />
            <path d="M40 20 C90 30 130 80 120 140 C80 120 50 70 40 20 Z" fill="#065F46" />
          </svg>
        </div>

        {/* Bottom-Right Sage Foliage */}
        <div className="absolute -bottom-8 -right-8 w-28 sm:w-36 h-28 sm:h-36 opacity-12 dark:opacity-8 rotate-180">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 20 C60 50 80 110 50 170 C10 140 0 80 20 20 Z" fill="#047857" />
            <path d="M40 20 C90 30 130 80 120 140 C80 120 50 70 40 20 Z" fill="#065F46" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN HERO (Fits within ~85-90vh with Navbar on Desktop)         */}
      {/* ========================================================================= */}
      <section className="relative pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Hero Content (~50% on desktop) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-4.5 text-center lg:text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-stone-100/90 dark:bg-[#142420] border border-[#E8E2D7] dark:border-emerald-900/60 text-[#065F46] dark:text-emerald-300 text-[10.5px] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>SCHOLARSHIPS MADE SIMPLE</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-0.5">
                <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-[#0F172A] dark:text-stone-100 tracking-tight leading-[1.12]">
                  Find Scholarships
                </h1>
                <div className="inline-block relative">
                  <span
                    className="font-editorial italic font-normal text-3xl sm:text-4xl lg:text-[3.25rem] text-[#064E3B] dark:text-emerald-400 block leading-[1.12]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    That Fit You
                  </span>
                  {/* Subtle golden curved underline swoosh under "That Fit You" */}
                  <svg
                    className="w-full h-2.5 mt-0.5 text-amber-500"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8 C80 2, 180 11, 297 5"
                      stroke="#D97706"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover scholarships matched to your education, eligibility and goals across India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={onFindScholarships}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-md shadow-[#064E3B]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer"
                >
                  <span>Find My Scholarships</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={onExploreScholarships}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-[#142420] hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-800 dark:text-stone-200 font-semibold text-sm sm:text-base border border-[#E2DACB] dark:border-[#1E3A33] shadow-2xs hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer"
                >
                  <Search className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Explore Scholarships</span>
                </button>
              </div>

              {/* Three Trust Points below Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-5 text-xs text-stone-700 dark:text-stone-300 font-semibold">
                <div className="inline-flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 flex items-center justify-center text-[#064E3B] dark:text-emerald-400">
                    🍃
                  </div>
                  <span>No registration required</span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] dark:text-emerald-400 stroke-[2.5]" />
                  <span>Clear eligibility information</span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 stroke-[2.5]" />
                  <span>Scholarships across India</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Proportionate Discovery Desk Composition (~50% on desktop) */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center relative">
              <DiscoveryDeskComposition onFindScholarships={onFindScholarships} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DOCKED HORIZONTAL FEATURE STRIP                                           */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-5">
        <div className="bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Left Header Title with Vertical Accent Bar */}
            <div className="lg:col-span-3 flex items-start gap-2.5 border-b lg:border-b-0 lg:border-r border-stone-200/80 dark:border-[#1E3A33] pb-3 lg:pb-0 pr-0 lg:pr-3">
              <div className="w-1.5 h-8 rounded-full bg-[#065F46] shrink-0 mt-0.5" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-stone-100 font-editorial leading-tight">
                Everything You Need <br />
                <span className="font-sans font-normal text-stone-700 dark:text-stone-300 text-xs sm:text-sm">
                  to Find the Right Scholarship
                </span>
              </h3>
            </div>

            {/* Right 4 Features with Circular Green Icon Badges */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Feature 1: Personalized Matches */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF3EE] dark:bg-emerald-950/80 text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <Target className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-stone-100">
                    Personalized Matches
                  </h4>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                    Answer a few questions and discover scholarships relevant to you.
                  </p>
                </div>
              </div>

              {/* Feature 2: Clear Eligibility */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF3EE] dark:bg-emerald-950/80 text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <FileCheck2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-stone-100">
                    Clear Eligibility
                  </h4>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                    Understand why a scholarship matches your criteria.
                  </p>
                </div>
              </div>

              {/* Feature 3: Save for Later */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF3EE] dark:bg-emerald-950/80 text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <Bookmark className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-stone-100">
                    Save for Later
                  </h4>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                    Bookmark scholarships without creating an account.
                  </p>
                </div>
              </div>

              {/* Feature 4: Compare Options */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF3EE] dark:bg-emerald-950/80 text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <GitCompare className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-stone-100">
                    Compare Options
                  </h4>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-snug mt-0.5">
                    Compare up to three scholarships side by side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
