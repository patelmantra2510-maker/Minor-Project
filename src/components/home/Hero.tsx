import React from 'react';
import { StudentIllustration } from '../common/StudentIllustration';
import { Cap3D, Books3D, Medal3D, Star3D } from '../common/Educational3DObjects';
import { ArrowRight, Check, Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onFindScholarships: () => void;
  onExploreScholarships: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindScholarships,
  onExploreScholarships,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Small subtle brand pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-[#142420] border border-[#065F46]/20 dark:border-emerald-800 text-[#064E3B] dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Scholarships made easier</span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Find Scholarships <br className="hidden sm:inline" />
              <span className="font-editorial italic font-normal text-[#064E3B] dark:text-emerald-400">
                That Fit You
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover scholarships matched to your education, eligibility and goals across Gujarat and India.
              No login or registration required. Fast, transparent, and student-focused.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onFindScholarships}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-lg shadow-[#064E3B]/20 hover:shadow-[#064E3B]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <span>{t('findMyScholarships')}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onExploreScholarships}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#142420] hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-800 dark:text-stone-200 font-semibold text-sm sm:text-base border border-[#E2DACB] dark:border-[#1E3A33] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Compass className="w-4 h-4 text-stone-500" />
                <span>{t('exploreScholarships')}</span>
              </button>
            </div>

            {/* 3 Value / Trust Indicators */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#065F46] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('noRegistration')}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#065F46] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('verifiedInfo')}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#065F46] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Gujarat & All-India</span>
              </div>
            </div>
          </div>

          {/* Right Hero: 2D Student Illustration surrounded by subtle 3D Educational Objects */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Subtle Floating 3D Educational Accents */}
            <div className="absolute -top-3 left-4 sm:left-8 z-20 animate-float">
              <Cap3D size={58} />
            </div>
            <div className="absolute top-1/4 -right-2 sm:-right-4 z-20 animate-float-alt">
              <Medal3D size={52} />
            </div>
            <div className="absolute bottom-6 -left-3 sm:-left-6 z-20 animate-float">
              <Books3D size={54} />
            </div>
            <div className="absolute top-2 right-12 z-10 animate-float">
              <Star3D size={32} />
            </div>

            {/* Central 2D Student Vector */}
            <StudentIllustration variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};
