import React from 'react';
import { DiscoveryDeskComposition } from './DiscoveryDeskComposition';
import { ArrowRight, Check, Compass, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';

interface HeroProps {
  onFindScholarships: () => void;
  onExploreScholarships: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindScholarships,
  onExploreScholarships,
}) => {
  return (
    <div>
      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 lg:pb-20 bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors border-b border-[#E8E2D7]/70 dark:border-[#1A2E28]">
        {/* Subtle Background Botanical Silhouettes, Constellation & Gentle Depth */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 640"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Subtle curved pathway lines */}
            <path
              d="M-80 430C220 460 380 280 680 330C980 380 1140 190 1520 260"
              stroke="#065F46"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              strokeOpacity="0.2"
            />
            <path
              d="M-30 460C280 490 430 310 730 360C1030 410 1180 220 1580 290"
              stroke="#D97706"
              strokeWidth="0.8"
              strokeDasharray="4 6"
              strokeOpacity="0.2"
            />

            {/* Left Edge: Faint Sage Botanical Silhouette */}
            <g opacity="0.18" transform="translate(-20, 180)">
              <path d="M40 220 C60 170 80 140 110 90" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M60 180 C80 170 100 180 115 170 C95 190 75 190 60 180 Z" fill="#065F46" />
              <path d="M85 140 C105 130 125 140 140 130 C120 150 100 150 85 140 Z" fill="#065F46" />
              <path d="M105 95 C120 85 135 90 145 85 C130 100 115 100 105 95 Z" fill="#065F46" />
            </g>

            {/* Right Edge: Faint Sage Botanical Silhouette */}
            <g opacity="0.16" transform="translate(1360, 240)">
              <path d="M40 200 C20 150 0 120 -30 80" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 160 C0 150 -20 160 -35 150 C-15 170 5 170 20 160 Z" fill="#065F46" />
              <path d="M-5 120 C-25 110 -45 120 -60 110 C-40 130 -20 130 -5 120 Z" fill="#065F46" />
            </g>

            {/* Faint Paper Plane Silhouette in Top-Right */}
            <g opacity="0.22" transform="translate(1180, 80) rotate(15)">
              <path d="M0 12 L28 0 L10 24 L8 14 Z" fill="none" stroke="#065F46" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M28 0 L8 14" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
              {/* Flight trail */}
              <path d="M-30 22 C-15 20 -5 16 0 12" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.7" />
            </g>

            {/* Soft constellation dots */}
            <circle cx="180" cy="100" r="2.5" fill="#D97706" fillOpacity="0.35" />
            <circle cx="480" cy="70" r="2" fill="#065F46" fillOpacity="0.25" />
            <circle cx="820" cy="120" r="2" fill="#D97706" fillOpacity="0.35" />
            <circle cx="1060" cy="60" r="2.5" fill="#065F46" fillOpacity="0.25" />
            <circle cx="1320" cy="140" r="2" fill="#D97706" fillOpacity="0.35" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content (~58% on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left pr-0 lg:pr-6">
              {/* Small Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100/90 dark:bg-[#142420] border border-[#E8E2D7] dark:border-emerald-900/60 text-[#065F46] dark:text-emerald-300 text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>SCHOLARSHIPS MADE SIMPLE</span>
              </div>

              {/* Main Heading: First line strong modern typography, second line restrained editorial serif/italic */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-[#0F172A] dark:text-stone-100 tracking-tight leading-[1.12]">
                Find Scholarships <br className="hidden sm:inline" />
                <span className="font-editorial italic font-normal text-[#064E3B] dark:text-emerald-400 block mt-1.5">
                  That Fit You
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover scholarships matched to your education, eligibility and goals across India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <button
                  onClick={onFindScholarships}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-md shadow-[#064E3B]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                >
                  <span>Find My Scholarships</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={onExploreScholarships}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#142420] hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-800 dark:text-stone-200 font-semibold text-sm sm:text-base border border-[#E2DACB] dark:border-[#1E3A33] shadow-2xs hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                >
                  <Compass className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Explore Scholarships</span>
                </button>
              </div>

              {/* Subtle & Elegant Trust Points below buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-600 dark:text-stone-300 font-medium">
                <div className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>No registration required</span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>Clear eligibility information</span>
                </div>

                <div className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>Scholarships across India</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Scholarship Discovery 3D Composition (~42% on desktop, laptop occupies ~35-40% of hero width) */}
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end relative">
              <DiscoveryDeskComposition onFindScholarships={onFindScholarships} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Statement Strip — Visually separates Hero from the rest of the page */}
      <section className="bg-[#F5EFE6]/80 dark:bg-[#12221D]/90 border-b border-[#E8E2D7] dark:border-[#1A2E28] py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            {/* Statement */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <p className="font-editorial italic text-base sm:text-lg text-stone-800 dark:text-stone-200 font-semibold tracking-wide">
                Scholarship discovery, simplified.
              </p>
            </div>

            {/* Three clean items */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span>Personalized matching</span>
              </div>

              <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span>Clear eligibility</span>
              </div>

              <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>

              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span>Official application sources</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
