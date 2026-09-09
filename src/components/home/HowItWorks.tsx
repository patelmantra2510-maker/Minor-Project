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
      title: 'Answer a few questions',
      description:
        'Tell us about your state, education level, stream, income, and academic marks in less than 2 minutes.',
      tag: 'No Login Required',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Get matched transparently',
      description:
        'Our engine cross-checks official eligibility rules to show Strong Matches, Possible Matches, and exact reasons.',
      tag: 'Why This Matches Me',
    },
    {
      number: '03',
      icon: ExternalLink,
      title: 'Explore & Apply Officially',
      description:
        'Inspect required documents, dates, and click through to submit your application on the official government portal.',
      tag: '100% Official Links',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Simple 3-Step Journey
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
            How VidyaSetu Works
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            No endless paperwork. No account creation. Just straightforward scholarship discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line on desktop */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-md mb-3">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="text-center mt-12">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span>Start Scholarship Questionnaire</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
