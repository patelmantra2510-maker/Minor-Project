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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Browser-Saved Items</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Scholarships
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stored privately in your browser. No registration or account needed.
          </p>
        </div>

        {savedScholarships.length > 0 && (
          <button
            onClick={clearSaved}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved List</span>
          </button>
        )}
      </div>

      {/* Saved Scholarships Grid or Approved Empty State Illustration */}
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
        <div className="text-center py-12 px-4 max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs mb-16">
          {/* Approved 2D Student illustration asset for Empty State */}
          <StudentIllustration variant="empty" className="mb-4" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            You haven&apos;t saved any scholarships yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Explore scholarships and click the bookmark icon on any card to save opportunities you want to apply for later.
          </p>

          <button
            onClick={onExplore}
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Scholarships Now →</span>
          </button>
        </div>
      )}

      {/* Recently Viewed Scholarships Tray */}
      {recentlyViewed.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Viewed Scholarships
            </h2>
            <span className="text-xs text-slate-400">({recentlyViewed.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.map((s) => (
              <div
                key={s.id}
                onClick={() => onViewScholarshipDetails(s.slug)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {s.provider}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
