import React, { useState } from 'react';
import type { MatchScoreResult } from '../../engine/matchScoreCalculator';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
} from 'lucide-react';

interface EdvoraMatchScoreCardProps {
  scoreResult: MatchScoreResult;
  onUpdateProfile?: () => void;
  onStartQuestionnaire?: () => void;
}

export const EdvoraMatchScoreCard: React.FC<EdvoraMatchScoreCardProps> = ({
  scoreResult,
  onUpdateProfile,
  onStartQuestionnaire,
}) => {
  const { t } = useLanguage();
  const [showHowCalculated, setShowHowCalculated] = useState(false);

  const {
    score,
    status,
    evaluatedCount,
    passedCount,
    unknownCount,
    summaryText,
    unknownCriteriaMessage,
  } = scoreResult;

  // Status-specific color configurations
  const isEligible = status === 'eligible';
  const isPossible = status === 'possible';
  const isNotEligible = status === 'not_eligible';

  const badgeBg = isEligible
    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
    : isPossible
    ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
    : isNotEligible
    ? 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
    : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';

  const barColor = isEligible
    ? 'bg-[#064E3B] dark:bg-emerald-400'
    : isPossible
    ? 'bg-amber-500 dark:bg-amber-400'
    : isNotEligible
    ? 'bg-rose-600 dark:bg-rose-500'
    : 'bg-stone-400 dark:bg-stone-500';

  return (
    <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs mb-8 space-y-6">
      {/* Top Header: Title, Status Badge, Score Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3EE] dark:bg-[#163328] text-[#064E3B] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-800/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('matchScore.title', undefined, 'Edvora Match')}</span>
            </span>

            {/* Authoritative Eligibility Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}
            >
              {isEligible && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {isPossible && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
              {isNotEligible && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
              <span>
                {isEligible && t('matchScore.eligibleBadge', undefined, 'Eligible')}
                {isPossible && t('matchScore.possibleBadge', undefined, 'Possible Match')}
                {isNotEligible && t('matchScore.notEligibleBadge', undefined, 'Not Eligible')}
                {status === 'unavailable' && t('matchScore.unavailableBadge', undefined, 'Unavailable')}
              </span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white pt-1">
            {t('matchScore.subtitle', undefined, 'Based on your current profile')}
          </h2>
        </div>

        {/* Score Number Display */}
        {score !== null && (
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-4xl sm:text-5xl font-black font-editorial tracking-tight text-[#064E3B] dark:text-emerald-400">
              {score}%
            </span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {t('matchScore.title', undefined, 'Edvora Match')}
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Progress Bar */}
      {score !== null ? (
        <div className="space-y-2">
          <div className="w-full h-3.5 bg-stone-100 dark:bg-[#182E29] rounded-full overflow-hidden p-0.5 border border-stone-200/60 dark:border-[#23453E]">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
              style={{ width: `${Math.max(score, 4)}%` }}
            />
          </div>

          {/* Evaluated Count & Unknown Criteria Notice */}
          <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-2">
            <span>
              <strong>{passedCount}</strong> of <strong>{evaluatedCount}</strong> evaluated criteria currently match.
            </span>
            {unknownCount > 0 && (
              <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {unknownCriteriaMessage}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#182E29] border border-stone-200/70 dark:border-[#23453E] text-xs text-stone-600 dark:text-stone-300">
          {summaryText}
        </div>
      )}

      {/* Summary Message & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
          {summaryText}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {onStartQuestionnaire && (
            <button
              type="button"
              onClick={onStartQuestionnaire}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[#064E3B] dark:text-emerald-300 font-bold text-xs transition-all cursor-pointer"
            >
              <span>{t('detail.checkEligibilityBtn', undefined, 'Check My Eligibility')}</span>
            </button>
          )}

          {unknownCount > 0 && onUpdateProfile && (
            <button
              type="button"
              onClick={onUpdateProfile}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('matchScore.updateProfileBtn', undefined, 'Update Profile')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Disclosure: How is this calculated? */}
      <div className="pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
        <button
          type="button"
          onClick={() => setShowHowCalculated(!showHowCalculated)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
          <span>{t('matchScore.howCalculatedTitle', undefined, 'How is this calculated?')}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showHowCalculated ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showHowCalculated && (
          <div className="mt-3 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] text-xs text-stone-600 dark:text-stone-300 leading-relaxed space-y-2 animate-in fade-in duration-200">
            <p>
              {t(
                'matchScore.howCalculatedDesc',
                undefined,
                'Edvora calculates this Match Score from the eligibility criteria that can currently be evaluated using your profile. Unknown criteria are not counted as satisfied. The score is an Edvora estimate and is not an official scholarship-provider score.'
              )}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              {t(
                'matchScore.disclaimer',
                undefined,
                'This score is calculated by Edvora from the eligibility information currently available in your profile. It is not an official score from the scholarship provider.'
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
