import React from 'react';
import { useScholarships } from '../../context/ScholarshipContext';
import { calculateDeadlineAlert } from '../../utils/deadlineAlerts';
import {
  AlertTriangle,
  ArrowRight,
  Flame,
  ChevronRight,
} from 'lucide-react';

interface DeadlineAlertBannerProps {
  onViewDetails: (slug: string) => void;
  onExploreClosingSoon?: () => void;
}

export const DeadlineAlertBanner: React.FC<DeadlineAlertBannerProps> = ({
  onViewDetails,
  onExploreClosingSoon,
}) => {
  const { scholarships } = useScholarships();

  // Find scholarships closing within 7 days (including today)
  const urgentScholarships = React.useMemo(() => {
    return scholarships
      .map((s) => ({
        scholarship: s,
        alert: calculateDeadlineAlert(s.applicationDeadline, s.applicationStart, s.status),
      }))
      .filter(({ alert }) => alert.effectiveStatus === 'Open' && alert.daysRemaining !== null && alert.daysRemaining >= 0 && alert.daysRemaining <= 7)
      .sort((a, b) => (a.alert.daysRemaining ?? 99) - (b.alert.daysRemaining ?? 99));
  }, [scholarships]);

  if (urgentScholarships.length === 0) {
    return null;
  }

  const topUrgent = urgentScholarships[0];
  const closingTodayCount = urgentScholarships.filter((x) => x.alert.urgency === 'closing_today').length;
  const isClosingToday = topUrgent.alert.urgency === 'closing_today';
  const isUrgent3Days = topUrgent.alert.urgency === 'urgent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
          isClosingToday
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-800'
            : isUrgent3Days
            ? 'bg-rose-50/90 dark:bg-rose-950/40 text-stone-900 dark:text-rose-100 border-rose-200 dark:border-rose-900/60'
            : 'bg-amber-50/90 dark:bg-amber-950/40 text-stone-900 dark:text-amber-100 border-amber-200 dark:border-amber-900/60'
        }`}
      >
        {/* Left Side: Icon & Alert Message */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isClosingToday
                ? 'bg-white/20 text-white animate-pulse'
                : isUrgent3Days
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300'
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
            }`}
          >
            {isClosingToday ? <Flame className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isClosingToday
                    ? 'bg-white text-rose-700'
                    : isUrgent3Days
                    ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                    : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                }`}
              >
                {isClosingToday
                  ? `Deadline Today (${closingTodayCount})`
                  : isUrgent3Days
                  ? 'Urgent Application Alert'
                  : 'Deadline Approaching'}
              </span>

              <span
                className={`text-xs font-bold ${
                  isClosingToday ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                }`}
              >
                {topUrgent.scholarship.name}
              </span>
            </div>

            <p
              className={`text-xs mt-1 leading-snug truncate ${
                isClosingToday
                  ? 'text-rose-100'
                  : isUrgent3Days
                  ? 'text-rose-800 dark:text-rose-300'
                  : 'text-amber-800 dark:text-amber-300'
              }`}
            >
              {isClosingToday
                ? `Portal closes tonight! Submit your documents before 11:59 PM.`
                : `Closing in ${topUrgent.alert.daysRemaining} days (${topUrgent.alert.formattedDate}). ${
                    urgentScholarships.length > 1
                      ? `Plus ${urgentScholarships.length - 1} other scholarships closing soon.`
                      : 'Apply on the official portal.'
                  }`}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            onClick={() => onViewDetails(topUrgent.scholarship.slug)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isClosingToday
                ? 'bg-white text-rose-700 hover:bg-rose-50 shadow-xs'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
            }`}
          >
            <span>{isClosingToday ? 'Apply Now' : 'View Deadline'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onExploreClosingSoon && urgentScholarships.length > 1 && (
            <button
              onClick={onExploreClosingSoon}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                isClosingToday
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span>See All ({urgentScholarships.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
