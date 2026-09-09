import React from 'react';
import { Target, FileText, Bookmark, Scale } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Target,
      color: 'bg-emerald-50 text-[#065F46] dark:bg-[#142420] dark:text-emerald-400 border border-emerald-100 dark:border-[#1E3A33]',
      title: 'Personalized Matches',
      description: 'Answer a few questions and discover scholarships relevant to you.',
    },
    {
      icon: FileText,
      color: 'bg-amber-50 text-amber-700 dark:bg-[#2A2415] dark:text-amber-300 border border-amber-100 dark:border-amber-900/40',
      title: 'Detailed Information',
      description: 'Understand eligibility, benefits, deadlines and requirements.',
    },
    {
      icon: Bookmark,
      color: 'bg-stone-100 text-stone-700 dark:bg-[#1C2623] dark:text-stone-300 border border-stone-200 dark:border-stone-700',
      title: 'Save for Later',
      description: 'Bookmark scholarships you want to apply for.',
    },
    {
      icon: Scale,
      color: 'bg-teal-50 text-teal-700 dark:bg-[#132A24] dark:text-teal-300 border border-teal-100 dark:border-teal-900/40',
      title: 'Compare Scholarships',
      description: 'Compare important scholarship details side by side.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-[#0E1A17] border-y border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] dark:text-emerald-400">
            Why Edvora
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial mt-1">
            Built for Students Across India
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
            No endless paperwork or confusing portals. Clear, accessible scholarship discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 transition-all duration-200 hover:-translate-y-1 shadow-2xs"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
