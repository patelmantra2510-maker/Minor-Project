import React from 'react';
import { StudentIllustration } from '../common/StudentIllustration';
import { Cap3D, Books3D, Certificate3D, Pencil3D, Star3D } from '../common/Educational3DObjects';
import { ArrowRight, Check, Compass } from 'lucide-react';

interface HeroProps {
  onFindScholarships: () => void;
  onExploreScholarships: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindScholarships,
  onExploreScholarships,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 lg:pb-24 bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F5EFE6]/60 dark:from-[#0C1513] dark:via-[#0C1513] dark:to-[#12221D] transition-colors">
      {/* Subtle Background Architectural & Geometric Art (No flags, no monuments) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle curved pathway */}
          <path
            d="M-100 450C250 480 400 300 700 350C1000 400 1150 200 1550 280"
            stroke="#065F46"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            strokeOpacity="0.3"
          />
          <path
            d="M-50 480C300 510 450 330 750 380C1050 430 1200 230 1600 310"
            stroke="#D97706"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.25"
          />
          {/* Soft constellation dots */}
          <circle cx="180" cy="120" r="2.5" fill="#D97706" fillOpacity="0.4" />
          <circle cx="480" cy="90" r="3" fill="#065F46" fillOpacity="0.3" />
          <circle cx="820" cy="140" r="2" fill="#D97706" fillOpacity="0.4" />
          <circle cx="1120" cy="80" r="2.5" fill="#065F46" fillOpacity="0.3" />
          <circle cx="1320" cy="180" r="3" fill="#D97706" fillOpacity="0.4" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Subtle Brand Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 dark:bg-[#142420] border border-[#065F46]/20 dark:border-emerald-800 text-[#064E3B] dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Modern Scholarship Discovery for India</span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 dark:text-stone-100 tracking-tight leading-[1.12]">
              Find Scholarships <br className="hidden sm:inline" />
              <span className="font-editorial italic font-normal text-[#064E3B] dark:text-emerald-400 block mt-1">
                That Fit You
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover scholarships matched to your education, eligibility and goals across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onFindScholarships}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-lg shadow-[#064E3B]/20 hover:shadow-[#064E3B]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <span>Find My Scholarships</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onExploreScholarships}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#142420] hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-800 dark:text-stone-200 font-semibold text-sm sm:text-base border border-[#E2DACB] dark:border-[#1E3A33] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <Compass className="w-4 h-4 text-stone-500" />
                <span>Explore Scholarships</span>
              </button>
            </div>

            {/* 3 Small Trust Points with subtle inline icons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-700 dark:text-stone-300 font-medium">
              <div className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>No registration required</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Verified scholarship information</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Scholarships across India</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Editorial Student Illustration surrounded by tasteful 3D Educational Objects */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Soft Floating 3D Educational Accents */}
            <div className="absolute -top-4 left-4 sm:left-6 z-20 animate-float" title="Graduation Cap">
              <Cap3D size={54} />
            </div>
            <div className="absolute top-3 right-6 sm:right-10 z-20 animate-float-alt" title="Academic Star">
              <Star3D size={32} />
            </div>
            <div className="absolute top-1/3 -right-2 sm:-right-4 z-20 animate-float" title="Certificate">
              <Certificate3D size={48} />
            </div>
            <div className="absolute bottom-6 -left-3 sm:-left-6 z-20 animate-float-alt" title="Academic Books">
              <Books3D size={50} />
            </div>
            <div className="absolute bottom-10 right-4 sm:right-6 z-20 animate-float" title="Pencil">
              <Pencil3D size={40} />
            </div>

            {/* Central Editorial Student Character */}
            <StudentIllustration variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};
