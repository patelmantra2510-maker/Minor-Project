import React from 'react';
import { StudentIllustration } from '../common/StudentIllustration';
import { Sparkles, ArrowRight, Check, Compass } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Gujarat State & All-India Scholarships 2026</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12]">
              Find Scholarships <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                That Fit You.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Enter a few details about your education and background. We&apos;ll show you scholarships
              you may be eligible for — from Gujarat and across India. Without any login or profile creation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onFindScholarships}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span>{t('findMyScholarships')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreScholarships}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>{t('exploreScholarships')}</span>
              </button>
            </div>

            {/* 3 Trust / Value Indicators */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('noRegistration')}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('verifiedInfo')}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t('gujaratAndIndia')}</span>
              </div>
            </div>
          </div>

          {/* Right Hero: High-Quality 2D Student Illustration Asset */}
          <div className="lg:col-span-5 flex justify-center relative">
            <StudentIllustration variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};
