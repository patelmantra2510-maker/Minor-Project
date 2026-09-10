import React, { useState } from 'react';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSaved } from '../../context/SavedContext';
import { useAI } from '../../context/AIContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import type { Scholarship } from '../../types/scholarship';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import {
  X,
  ExternalLink,
  MapPin,
  Layers,
  Sparkles,
  Bookmark,
  SlidersHorizontal,
  Copy,
  Check,
  Bot,
} from 'lucide-react';

export const ComparisonModal: React.FC = () => {
  const {
    compareIds,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    closeCompareModal,
  } = useCompare();
  const { savedIds, toggleSave } = useSaved();
  const { openGlobalAI, sendMessage } = useAI();
  const { t, language } = useLanguage();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isCompareModalOpen) return null;

  const scholarships = SCHOLARSHIPS_DATA.filter((s) => compareIds.includes(s.id));

  const handleAICompare = () => {
    if (scholarships.length < 2) return;
    const names = scholarships.map((s) => s.shortName || s.name);
    const prompt = `Please compare ${names.join(' and ')}. What are the critical differences in their eligibility criteria, benefits, and application deadlines? Which one should I prioritize applying for?`;
    closeCompareModal();
    openGlobalAI();
    setTimeout(() => {
      sendMessage(prompt);
    }, 150);
  };

  const handleCopySummary = () => {
    if (scholarships.length === 0) return;
    const text = scholarships
      .map(
        (s) =>
          `=== ${s.name} (${s.provider}) ===\n` +
          `Region: ${s.state}\n` +
          `Target Education: ${s.educationLevels.join(', ')}\n` +
          `Income Limit: ${s.incomeLimit ? '≤ ₹' + s.incomeLimit.toLocaleString('en-IN') : 'No Limit'}\n` +
          `Min Percentage: ${s.minimumPercentage ? '≥ ' + s.minimumPercentage + '%' : 'Passing Marks'}\n` +
          `Gender: ${s.genderEligibility}\n` +
          `Benefits: ${s.benefits.amountDescription}\n` +
          `Deadline: ${s.applicationDeadline ? formatDate(s.applicationDeadline) : 'Check Portal'}\n` +
          `Official Portal: ${s.applicationWebsite}\n`
      )
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDiff = (extractor: (s: Scholarship) => any) => {
    if (scholarships.length <= 1) return false;
    const firstVal = JSON.stringify(extractor(scholarships[0]));
    return scholarships.some((s) => JSON.stringify(extractor(s)) !== firstVal);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#142420] rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E2D7] dark:border-[#1E3A33] overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8E2D7] dark:border-[#1E3A33] bg-[#FAF8F5]/80 dark:bg-[#12221E]/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
                {t('compare.modalTitle', { count: String(scholarships.length) })}
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {t('compare.modalSubtitle')}
            </p>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex flex-wrap items-center gap-2">
            {scholarships.length >= 2 && (
              <button
                onClick={handleAICompare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-[#064E3B] to-[#0A6C53] hover:from-[#043E2F] hover:to-[#085844] text-amber-300 font-bold text-xs shadow-xs border border-emerald-600/40 transition-all hover:scale-[1.02]"
                title="Ask Edvora AI to compare these scholarships"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('compare.askAIToCompare', undefined, 'Ask AI to Compare')}</span>
              </button>
            )}

            {scholarships.length > 1 && (
              <button
                onClick={() => setHighlightDiff((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  highlightDiff
                    ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                    : 'bg-white dark:bg-[#182C26] border-stone-200 dark:border-[#1E3A33] text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t('compare.highlightDiff', undefined, 'Differences')}</span>
              </button>
            )}

            {scholarships.length > 0 && (
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#182C26] border border-stone-200 dark:border-[#1E3A33] text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition-all shadow-2xs"
                title="Copy comparison summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t('compare.summaryCopied', undefined, 'Copied!') : t('compare.copySummary', undefined, 'Copy')}</span>
              </button>
            )}

            {scholarships.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
              >
                {t('common.clearAll')}
              </button>
            )}

            <button
              onClick={closeCompareModal}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#1C3630] text-stone-500 dark:text-stone-400 transition-colors ml-1"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-auto">
          {scholarships.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Layers className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-800 dark:text-stone-200">
                {t('compare.noSelectedTitle')}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {t('compare.noSelectedSub')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-[#1E3A33] bg-[#FAF8F5]/50 dark:bg-[#12221E]/50">
                    <th className="p-3.5 w-44 text-stone-400 uppercase text-[11px] font-bold sticky left-0 z-20 bg-[#FAF8F5] dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.feature')}
                    </th>
                    {scholarships.map((s) => {
                      const isSaved = savedIds.includes(s.id);
                      return (
                        <th key={s.id} className="p-3.5 align-top min-w-[240px] max-w-[320px] border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#064E3B]/10 dark:bg-emerald-500/10 text-[#064E3B] dark:text-emerald-400 border border-emerald-600/20">
                              <MapPin className="w-2.5 h-2.5" />
                              {s.state === 'Gujarat' ? 'Gujarat Scheme' : 'National Scheme'}
                            </span>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => toggleSave(s.id)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isSaved
                                    ? 'bg-amber-500 text-white border-amber-600'
                                    : 'bg-white dark:bg-[#182C26] text-stone-400 hover:text-amber-600 border-stone-200 dark:border-[#1E3A33]'
                                }`}
                                title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                              </button>

                              <button
                                onClick={() => removeFromCompare(s.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all"
                                title={t('common.removeFromSaved')}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 font-editorial">
                            {s.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5 line-clamp-1">
                            {s.provider}
                          </p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-[#1E3A33]">
                  {/* Status & Deadline */}
                  <tr className={highlightDiff && hasDiff((s) => s.status) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.status')} & {t('compare.deadline')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <StatusBadge deadline={s.applicationDeadline} startDate={s.applicationStart} overrideStatus={s.status} />
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-medium">
                          {t('compare.deadline')}: {formatDate(s.applicationDeadline)}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr className={highlightDiff && hasDiff((s) => s.state) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.region')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#065F46] dark:text-emerald-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {s.state === 'Gujarat' ? t('common.gujarat') : t('common.allIndia')}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Target Education Level */}
                  <tr className={highlightDiff && hasDiff((s) => s.educationLevels.join(',')) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.targetEducation')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 font-medium border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <div className="flex flex-wrap gap-1">
                          {s.educationLevels.map((lvl, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#1A302A] text-stone-700 dark:text-stone-300 text-[11px] font-medium border border-stone-200/60 dark:border-stone-700/60">
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Income Ceiling */}
                  <tr className={highlightDiff && hasDiff((s) => s.incomeLimit) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.familyIncomeLimit')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 font-bold text-[#065F46] dark:text-emerald-400 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        {s.incomeLimit
                          ? `≤ ₹${s.incomeLimit.toLocaleString('en-IN')}/year`
                          : (language === 'hi' ? 'कोई सीमा नहीं (योग्यता आधारित)' : language === 'gu' ? 'કોઈ મર્યાદા નથી (મેરિટ)' : 'No Ceiling (Merit Based)')}
                      </td>
                    ))}
                  </tr>

                  {/* Min Academic Percentage */}
                  <tr className={highlightDiff && hasDiff((s) => s.minimumPercentage) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.minPercentage')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 font-medium border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        {s.minimumPercentage ? (
                          <span className="font-bold text-amber-700 dark:text-amber-400">≥ {s.minimumPercentage}%</span>
                        ) : (
                          <span className="text-stone-500">
                            {language === 'hi' ? 'उत्तीर्ण अंक' : language === 'gu' ? 'પાસિંગ માર્ક્સ' : 'Passing Marks / Admission'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Gender Eligibility */}
                  <tr className={highlightDiff && hasDiff((s) => s.genderEligibility) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.gender')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 font-medium border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        {s.genderEligibility === 'All'
                          ? (language === 'hi' ? 'सभी लिंग' : language === 'gu' ? 'તમામ જાતિઓ' : 'All Genders')
                          : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800">
                              {language === 'hi' ? `${s.genderEligibility} केवल` : language === 'gu' ? `માત્ર ${s.genderEligibility}` : `${s.genderEligibility} Only`}
                            </span>
                          )}
                      </td>
                    ))}
                  </tr>

                  {/* Social Category */}
                  <tr className={highlightDiff && hasDiff((s) => s.categories.join(',')) ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('common.category')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 font-medium border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <div className="flex flex-wrap gap-1">
                          {s.categories.map((cat, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#1A302A] text-stone-700 dark:text-stone-300 text-[11px]">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Annual Benefits */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.benefitAmount')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 text-xs leading-relaxed text-stone-700 dark:text-stone-300 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-[#182C26] border border-amber-200/60 dark:border-amber-900/40">
                          {s.benefits.amountDescription}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Required Documents Summary */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      Key Documents
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <ul className="space-y-1">
                          {(s.documents || []).slice(0, 4).map((doc: string, idx: number) => (
                            <li key={idx} className="text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-1">
                              <span className="text-[#065F46] dark:text-emerald-400 font-bold">•</span>
                              <span className="line-clamp-1">{doc}</span>
                            </li>
                          ))}
                          {(s.documents || []).length > 4 && (
                            <li className="text-[10px] text-stone-400 italic">
                              +{(s.documents || []).length - 4} more documents
                            </li>
                          )}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Official Link */}
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#142420] border-r border-stone-200/60 dark:border-[#1E3A33]/80">
                      {t('compare.officialPortal')}
                    </td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3.5 border-r border-stone-100 dark:border-[#1E3A33] last:border-r-0">
                        <a
                          href={s.applicationWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E3B]/10 dark:bg-emerald-500/10 text-xs font-bold text-[#065F46] hover:text-[#043E2F] dark:text-emerald-400 border border-[#065F46]/20 hover:border-[#065F46]/40 transition-all"
                        >
                          <span>{t('compare.officialPortal')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const FloatingCompareBar: React.FC = () => {
  const { compareIds, openCompareModal, clearCompare } = useCompare();
  const { t } = useLanguage();

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-[#0A1613] text-white rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xl border border-emerald-900/60 flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold">
            {t('compare.barTitle', { count: String(compareIds.length) })}
          </span>
        </div>

        <button
          onClick={openCompareModal}
          className="px-3.5 py-1.5 rounded-xl bg-[#065F46] hover:bg-[#044734] text-amber-100 text-xs font-bold transition-colors shadow-xs"
        >
          {t('compare.compareNow')} →
        </button>

        <button
          onClick={clearCompare}
          className="text-stone-400 hover:text-white text-xs font-medium"
        >
          {t('common.clearAll')}
        </button>
      </div>
    </div>
  );
};
