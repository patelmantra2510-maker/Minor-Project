import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('homePage.step1Title', undefined, 'Answer'),
      subtitle: t('homePage.step1Sub', undefined, 'Share your background'),
      description: t('homePage.step1Desc', undefined, 'Select your course, category, state, and academic percentage in a quick 7-step guided flow.'),
      icon: HelpCircle,
    },
    {
      num: '02',
      title: t('homePage.step2Title', undefined, 'Get Matched'),
      subtitle: t('homePage.step2Sub', undefined, 'Rule-based evaluation'),
      description: t('homePage.step2Desc', undefined, 'Edvora instantly checks official criteria to find scholarships you qualify for.'),
      icon: Sparkles,
    },
    {
      num: '03',
      title: t('homePage.step3Title', undefined, 'Explore & Apply'),
      subtitle: t('homePage.step3Sub', undefined, 'Direct official access'),
      description: t('homePage.step3Desc', undefined, 'Review your personalized match checklist and apply directly through verified government portals.'),
      icon: ExternalLink,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0E1A17] border-t border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#065F46] dark:text-emerald-400">
            {t('homePage.howItWorksEyebrow', undefined, 'Simple 3-Step Journey')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-stone-100 font-editorial mt-2 tracking-tight">
            {t('homePage.howItWorksTitle', undefined, 'How Edvora Works')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5">
            {t('homePage.howItWorksSubtitle', undefined, 'Discover verified scholarships tailored to you without complex forms or permanent profiles.')}
          </p>
        </div>

        <div className="relative">
          {/* Subtle curved connecting path SVG (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/12 right-1/12 h-16 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 120 30 C 300 0, 400 60, 500 30 C 600 0, 700 60, 880 30"
                stroke="#065F46"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity="0.3"
              />
              <path
                d="M 120 30 C 300 0, 400 60, 500 30 C 600 0, 700 60, 880 30"
                stroke="#D97706"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                strokeOpacity="0.35"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group p-8 rounded-3xl bg-[#FAF8F5] dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 transition-all duration-200 hover:-translate-y-1 shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-[#1E3A33] group-hover:scale-105 transition-transform shadow-2xs">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-2xl font-black font-editorial text-stone-300 dark:text-stone-700">
                        {step.num}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Questionnaire CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-lg shadow-[#064E3B]/20 hover:shadow-[#064E3B]/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          >
            <span>{t('homePage.ctaFind', undefined, 'Find My Scholarships')}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
