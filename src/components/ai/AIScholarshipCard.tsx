import React from 'react';
import type { Scholarship } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import {
  Bookmark,
  ExternalLink,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AIScholarshipCardProps {
  scholarship: Scholarship;
  onViewDetails: (slug: string) => void;
  onSelectForAI?: (scholarshipId: string) => void;
}

export const AIScholarshipCard: React.FC<AIScholarshipCardProps> = ({
  scholarship,
  onViewDetails,
  onSelectForAI,
}) => {
  const { t } = useLanguage();
  const { isSaved, toggleSave } = useSaved();
  const { isComparing, toggleCompare } = useCompare();

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  return (
    <div className="my-2 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs hover:border-[#065F46] dark:hover:border-emerald-600 transition-all text-left">
      {/* Top badges & actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge
            deadline={scholarship.applicationDeadline}
            startDate={scholarship.applicationStart}
            overrideStatus={scholarship.status}
          />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-[#1C3630] text-stone-600 dark:text-stone-300">
            <MapPin className="w-2.5 h-2.5 text-[#065F46] dark:text-emerald-400" />
            {scholarship.state === 'Gujarat' ? t('common.gujarat') : t('common.allIndia')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleCompare(scholarship.id)}
            className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border transition-colors ${
              comparing
                ? 'bg-[#064E3B] text-amber-100 border-[#064E3B]'
                : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300 hover:bg-stone-100'
            }`}
            title={comparing ? t('common.removeFromSaved') : t('common.compare')}
          >
            {comparing ? `✓ ${t('common.inCompare')}` : t('common.addCompare')}
          </button>
          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`p-1 rounded-full border transition-all ${
              saved
                ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'border-stone-200 dark:border-[#23453E] text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-[#1C3630]'
            }`}
            title={saved ? t('common.removeFromSaved') : t('common.saveForLater')}
            aria-label={saved ? t('common.removeFromSaved') : t('common.saveForLater')}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Scholarship Name & Provider */}
      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-editorial line-clamp-2 leading-snug">
        {scholarship.name}
      </h4>
      <p className="text-[11px] text-stone-500 font-medium mt-0.5">
        {scholarship.provider}
      </p>

      {/* Key benefit pill */}
      <div className="mt-2.5 p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1A2E28] border border-stone-200/60 dark:border-[#23453E] text-[11px]">
        <span className="text-stone-400 font-bold block text-[9px] uppercase tracking-wider">
          {t('common.benefit')}
        </span>
        <span className="font-semibold text-[#065F46] dark:text-emerald-400 line-clamp-2 mt-0.5">
          {scholarship.benefits.amountDescription}
        </span>
      </div>

      {/* Deadline info */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
        <span>{t('common.deadline')}: {formatDate(scholarship.applicationDeadline)}</span>
        <a
          href={scholarship.applicationWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-[#065F46] dark:text-emerald-400 hover:underline"
        >
          <span>{t('common.officialPortal')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Action buttons */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-[#1E3A33] flex items-center gap-2">
        <button
          onClick={() => onViewDetails(scholarship.slug)}
          className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#065F46] hover:bg-[#044734] text-amber-100 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
        >
          <span>{t('common.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onSelectForAI && (
          <button
            onClick={() => onSelectForAI(scholarship.id)}
            className="py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold transition-all flex items-center gap-1"
            title="Ask AI about this scholarship"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AI Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};
