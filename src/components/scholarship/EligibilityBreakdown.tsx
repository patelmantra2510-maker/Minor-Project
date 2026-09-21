import React from 'react';
import type { EvaluatedCriterion } from '../../engine/structuredEligibilityEvaluator';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, XCircle, HelpCircle, Edit3 } from 'lucide-react';

interface EligibilityBreakdownProps {
  criteria: EvaluatedCriterion[];
  onUpdateField?: (fieldId: string, fieldName: string) => void;
}

export const EligibilityBreakdown: React.FC<EligibilityBreakdownProps> = ({
  criteria,
  onUpdateField,
}) => {
  const { t } = useLanguage();

  if (!criteria || criteria.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-editorial text-[#064E3B] dark:text-emerald-300">
          {t('matchScore.criteriaHeading', undefined, 'Eligibility Check')}
        </h3>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {criteria.length} evaluated conditions
        </span>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-[#E8E2D7] dark:border-[#23453E] bg-white dark:bg-[#142420] shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-[#182E29] border-b border-stone-200/70 dark:border-[#23453E] text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">{t('matchScore.tableCriterion', undefined, 'Criterion')}</th>
              <th className="py-3 px-4">{t('matchScore.tableYourInfo', undefined, 'Your Information')}</th>
              <th className="py-3 px-4">{t('matchScore.tableRequirement', undefined, 'Required Condition')}</th>
              <th className="py-3 px-4 text-center">{t('matchScore.tableStatus', undefined, 'Status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-[#1E3A33]">
            {criteria.map((c) => {
              const isPassed = c.status === 'passed';
              const isFailed = c.status === 'failed';
              const isUnknown = c.status === 'unknown';

              return (
                <tr
                  key={c.id}
                  className={`transition-colors ${
                    isPassed
                      ? 'hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20'
                      : isFailed
                      ? 'hover:bg-rose-50/30 dark:hover:bg-rose-950/20'
                      : 'hover:bg-amber-50/30 dark:hover:bg-amber-950/20'
                  }`}
                >
                  {/* Criterion Name */}
                  <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {c.isHardRequirement && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-medium">
                          Required
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Your Information */}
                  <td className="py-3.5 px-4">
                    {isUnknown ? (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-700 dark:text-amber-300 italic font-medium">
                          {t('matchScore.statusNotProvided', undefined, 'Not provided')}
                        </span>
                        {onUpdateField && (
                          <button
                            type="button"
                            onClick={() => onUpdateField(c.fieldId, c.name)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 font-semibold text-[10px] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>{t('matchScore.updateProfileBtn', undefined, 'Update')}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {c.yourValueText}
                      </span>
                    )}
                  </td>

                  {/* Required Condition */}
                  <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                    {c.requiredConditionText}
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3.5 px-4 text-center">
                    {isPassed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>✓</span>
                      </span>
                    )}
                    {isFailed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>✕</span>
                      </span>
                    )}
                    {isUnknown && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>?</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Layout */}
      <div className="sm:hidden space-y-2.5">
        {criteria.map((c) => {
          const isPassed = c.status === 'passed';
          const isFailed = c.status === 'failed';
          const isUnknown = c.status === 'unknown';

          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                isPassed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
                  : isFailed
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/60'
                  : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                  {c.name}
                </span>
                {isPassed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>✓ Satisfied</span>
                  </span>
                )}
                {isFailed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    <span>✕ Not Met</span>
                  </span>
                )}
                {isUnknown && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    <HelpCircle className="w-3 h-3 text-amber-600" />
                    <span>? Unknown</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-stone-400 block uppercase font-bold text-[9px]">Your Info:</span>
                  {isUnknown ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-amber-700 dark:text-amber-300 italic">Not provided</span>
                      {onUpdateField && (
                        <button
                          type="button"
                          onClick={() => onUpdateField(c.fieldId, c.name)}
                          className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[9px]"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block mt-0.5">
                      {c.yourValueText}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-stone-400 block uppercase font-bold text-[9px]">Required:</span>
                  <span className="text-stone-600 dark:text-stone-300 block mt-0.5">
                    {c.requiredConditionText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
