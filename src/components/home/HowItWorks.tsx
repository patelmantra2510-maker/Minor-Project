import React from 'react';
import { HelpCircle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  const steps = [
    {
      number: '01',
      icon: HelpCircle,
      title: 'Answer',
      description: 'Tell us about your education and eligibility.',
      tag: 'Quick & Guided',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Get Matched',
      description: 'We evaluate your answers against scholarship criteria.',
      tag: 'Transparent Logic',
    },
    {
      number: '03',
      icon: ExternalLink,
      title: 'Explore & Apply',
      description: 'Review the details and apply through the official source.',
      tag: 'Direct Official Link',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF8F5] dark:bg-[#0C1513] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] dark:text-emerald-400">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial mt-1">
            Simple 3-Step Journey
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
            Discover verified scholarships without filling complicated portals or creating accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle journey connecting path line */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-amber-300 to-emerald-200 dark:from-[#1E3A33] dark:via-amber-800 dark:to-[#1E3A33] z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 p-8 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-stone-200 dark:text-[#1E3A33] font-editorial">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#1C3630] text-[#065F46] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-[#1E3A33] shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-[#065F46] dark:text-emerald-400 bg-emerald-50 dark:bg-[#1C3630] px-2.5 py-1 rounded-md mb-3 border border-emerald-100/60 dark:border-[#1E3A33]">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Questionnaire CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-sm sm:text-base shadow-lg shadow-[#064E3B]/20 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span>Start Scholarship Questionnaire</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
