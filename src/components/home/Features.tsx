import React from 'react';
import { Sparkles, ShieldCheck, Bookmark, Scale } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      num: '01',
      icon: Sparkles,
      title: 'Personalized Matches',
      description: 'Answer a few questions and discover scholarships relevant to you.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'Clear Eligibility',
      description: 'Understand why a scholarship matches your information.',
    },
    {
      num: '03',
      icon: Bookmark,
      title: 'Save for Later',
      description: 'Bookmark scholarships without creating an account.',
    },
    {
      num: '04',
      icon: Scale,
      title: 'Compare Options',
      description: 'Compare up to three scholarships side by side.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] dark:bg-[#0C1513] border-t border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#065F46] dark:text-emerald-400">
            Why Edvora
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-stone-100 font-editorial mt-2 tracking-tight">
            Everything You Need to Find the Right Scholarship
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5">
            Designed for clarity, privacy, and ease of use. No accounts, no clutter, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 transition-all duration-200 hover:-translate-y-1 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black font-editorial tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-stone-100 mb-2 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
