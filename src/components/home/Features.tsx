import React from 'react';
import { Target, FileCheck, BookmarkCheck, Globe2 } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Target,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      title: 'Personalized Results',
      description:
        'Smart rule matching that evaluates your exact education, stream, category, and income without asking unnecessary questions.',
    },
    {
      icon: FileCheck,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
      title: 'Detailed Information',
      description:
        'View complete eligibility matrices, benefits amounts, application deadlines, required documents, and official portal links.',
    },
    {
      icon: BookmarkCheck,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
      title: 'Save for Later',
      description:
        'Bookmark scholarships with a single click. Everything saves privately in your browser storage without creating any student account.',
    },
    {
      icon: Globe2,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
      title: 'Gujarat + All India',
      description:
        'Discover Gujarat government flagship programs (MYSY, Digital Gujarat) along with curated, popular national scholarships.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Why Use VidyaSetu
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
            Built for Student Success, Zero Friction
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            We cut through bureaucratic confusion to bring you clear, actionable financial aid opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
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
