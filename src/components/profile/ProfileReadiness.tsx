import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ProfileCompletionResult } from '../../engine/profileCompletion';

interface ProfileReadinessProps {
  completion: ProfileCompletionResult;
  onFindScholarships: () => void;
  onUpdateProfile: () => void;
}

export const ProfileReadiness: React.FC<ProfileReadinessProps> = ({
  completion,
  onFindScholarships,
  onUpdateProfile,
}) => {
  const { t } = useLanguage();
  const { percentage, knownFields, relevantFields } = completion;

  // Determine readiness tone
  const isHigh = percentage >= 80;
  const isMedium = percentage >= 40 && percentage < 80;

  // Determine adaptive readiness guidance message based on completion tier
  const getReadinessMessage = () => {
    if (percentage >= 100) {
      return t(
        'profile.readinessMessages.ready',
        undefined,
        'Your profile is fully complete. All scholarship eligibility criteria can be precisely matched.'
      );
    }
    if (percentage >= 60) {
      return t(
        'profile.readinessMessages.sufficient',
        undefined,
        'Almost complete. Add your marks and disability status for fully verified match confidence.'
      );
    }
    if (percentage >= 20) {
      return t(
        'profile.readinessMessages.partial',
        undefined,
        'Good progress. Adding your caste category and family income will unlock more accurate government matches.'
      );
    }
    return t(
      'profile.readinessMessages.new',
      undefined,
      'Just starting out. Complete a few key details like education and state to find initial scholarships.'
    );
  };

  return (
    <div className="bg-white/90 dark:bg-[#142420]/90 backdrop-blur-md rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] p-5 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('profile.yourScholarshipProfile', undefined, 'Your Scholarship Profile')}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white tracking-tight">
              {t('profile.readinessReady', { percentage: String(percentage) }, `${percentage}% ready`)}
            </h2>
            {isHigh && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>High Match Accuracy</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
            {getReadinessMessage()}
          </p>

          <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
            {t(
              'profile.knownFieldsCount',
              { known: String(knownFields), total: String(relevantFields) },
              `${knownFields} of ${relevantFields} key eligibility fields provided`
            )}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={onFindScholarships}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-4 h-4 stroke-[2]" />
            <span>{t('profile.findScholarships', undefined, 'Find Scholarships')}</span>
          </button>

          <button
            onClick={onUpdateProfile}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200/80 dark:hover:bg-[#23453E] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold border border-stone-200 dark:border-[#23453E] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          >
            <span>{t('profile.updateProfile', undefined, 'Update Profile')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="mt-5">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile readiness progress"
          className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-[#1C3630] overflow-hidden p-0.5 border border-stone-200/60 dark:border-[#24423A]"
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isHigh
                ? 'bg-[#065F46] dark:bg-emerald-500'
                : isMedium
                ? 'bg-amber-600 dark:bg-amber-500'
                : 'bg-stone-500 dark:bg-stone-400'
            }`}
            style={{ width: `${Math.max(percentage, 3)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
