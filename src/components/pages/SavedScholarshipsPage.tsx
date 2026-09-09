import React from 'react';
import { useSaved } from '../../context/SavedContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import { StudentIllustration } from '../common/StudentIllustration';
import {
  Bookmark,
  Compass,
  Clock,
  Trash2,
  ArrowRight,
} from 'lucide-react';

interface SavedScholarshipsPageProps {
  onViewScholarshipDetails: (slug: string) => void;
  onExplore: () => void;
}

export const SavedScholarshipsPage: React.FC<SavedScholarshipsPageProps> = ({
  onViewScholarshipDetails,
  onExplore,
}) => {
  const { savedIds, recentlyViewedIds, clearSaved } = useSaved();

  const savedScholarships = SCHOLARSHIPS_DATA.filter((s) => savedIds.includes(s.id));
  const recentlyViewed = SCHOLARSHIPS_DATA.filter((s) =>
    recentlyViewedIds.includes(s.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-[#1E2E28] border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Browser-Saved Items</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
            Saved Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Stored locally on your device. No login or accounts required.
          </p>
        </div>

        {savedScholarships.length > 0 && (
          <button
            onClick={clearSaved}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved List</span>
          </button>
        )}
      </div>

      {/* Saved Scholarships Grid or Empty State */}
      {savedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {savedScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onViewDetails={onViewScholarshipDetails}
              showMatchStatus={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 max-w-md mx-auto bg-white dark:bg-[#142420] rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-16">
          {/* Approved Empty-State 2D Illustration */}
          <StudentIllustration variant="empty" className="mb-4" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-editorial">
            No saved scholarships yet
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
            Save scholarships here so you can come back to them later.
          </p>

          <button
            onClick={onExplore}
            className="mt-6 px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-md shadow-[#064E3B]/20 transition-all inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Explore Scholarships</span>
          </button>
        </div>
      )}

      {/* Recently Viewed Scholarships Tray */}
      {recentlyViewed.length > 0 && (
        <div className="pt-10 border-t border-[#E8E2D7] dark:border-[#1E3A33]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
            <h2 className="text-base font-bold text-[#064E3B] dark:text-white font-editorial">
              Recently Viewed Scholarships
            </h2>
            <span className="text-xs text-stone-400 font-semibold">({recentlyViewed.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.map((s) => (
              <div
                key={s.id}
                onClick={() => onViewScholarshipDetails(s.slug)}
                className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-2xs"
              >
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#065F46] dark:group-hover:text-emerald-400">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    {s.provider}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#065F46] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
