import React from 'react';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedScholarshipsProps {
  onViewDetails: (slug: string) => void;
  onExploreAll: () => void;
}

export const FeaturedScholarships: React.FC<FeaturedScholarshipsProps> = ({
  onViewDetails,
  onExploreAll,
}) => {
  // Curate 3-4 top popular verified scholarships
  const featuredIds = [
    'mysy-gujarat',
    'aicte-pragati-scholarship',
    'pm-usp-csss-national',
    'kotak-kanya-scholarship',
  ];
  const featuredScholarships = SCHOLARSHIPS_DATA.filter((s) => featuredIds.includes(s.id));

  return (
    <section className="py-16 bg-white dark:bg-[#0E1A17] border-t border-[#E8E2D7] dark:border-[#1A2E28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified High-Impact Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial">
              Featured Scholarships
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              Popular government and philanthropic programs actively supporting students in technical, medical, and higher education.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#065F46] dark:text-emerald-400 hover:text-[#044734] dark:hover:text-emerald-300 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onViewDetails={onViewDetails}
              showMatchStatus={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
