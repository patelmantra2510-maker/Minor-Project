import React, { useState } from 'react';
import type { Scholarship, MatchResult } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge, MatchBadge } from '../common/Badge';
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  MapPin,
  GraduationCap,
  IndianRupee,
  Layers,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  matchResult?: MatchResult;
  onViewDetails: (slug: string) => void;
  showMatchStatus?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  matchResult,
  onViewDetails,
  showMatchStatus = true,
}) => {
  const { t } = useLanguage();
  const { isSaved, toggleSave } = useSaved();
  const { isComparing, toggleCompare } = useCompare();
  const [showMatchReasons, setShowMatchReasons] = useState(false);

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  return (
    <div className="group bg-white dark:bg-[#142420] rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs hover:shadow-md hover:border-[#065F46] dark:hover:border-emerald-600 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner with Badges */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {showMatchStatus && matchResult && (
              <MatchBadge status={matchResult.status} size="sm" />
            )}
            <StatusBadge
              deadline={scholarship.applicationDeadline}
              startDate={scholarship.applicationStart}
              overrideStatus={scholarship.status}
            />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300">
              <MapPin className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
              {scholarship.state === 'Gujarat' ? t('common.gujarat', undefined, 'Gujarat') : t('common.allIndia', undefined, 'All India')}
            </span>
          </div>

          {/* Quick Actions: Save & Compare */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleCompare(scholarship.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                comparing
                  ? 'bg-[#064E3B] text-amber-100 border-[#064E3B]'
                  : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
              title={comparing ? t('common.removeFromSaved', undefined, 'Remove from comparison') : t('common.compare', undefined, 'Add to comparison tray')}
            >
              {comparing ? `✓ ${t('common.inCompare', undefined, 'In Compare')}` : t('common.addCompare', undefined, '+ Compare')}
            </button>
            <button
              onClick={() => toggleSave(scholarship.id)}
              className={`p-1.5 rounded-full border transition-all ${
                saved
                  ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400 scale-110'
                  : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-400 hover:text-amber-600 hover:border-amber-300'
              }`}
              aria-label={saved ? t('common.removeFromSaved', undefined, 'Remove from saved') : t('common.save', undefined, 'Save scholarship')}
              title={saved ? t('common.saved', undefined, 'Saved') : t('common.saveForLater', undefined, 'Save for later')}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Provider */}
        <h3
          onClick={() => onViewDetails(scholarship.slug)}
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#065F46] dark:group-hover:text-emerald-400 font-editorial transition-colors cursor-pointer line-clamp-2"
        >
          {scholarship.name}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-1 font-medium">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-stone-400" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        {/* Key Information Matrix */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 py-3 border-y border-stone-100 dark:border-[#1E3A33] text-xs min-w-0">
          <div className="flex items-start gap-2 min-w-0">
            <GraduationCap className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('common.education', undefined, 'Education')}</span>
              <span className="font-semibold text-slate-800 dark:text-stone-200 truncate block">
                {scholarship.educationLevels.slice(0, 2).join(' · ')}
                {scholarship.educationLevels.length > 2 && ` +${t('common.more', undefined, 'more')}`}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 min-w-0">
            <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('common.benefits', undefined, 'Benefits')}</span>
              <span className="font-semibold text-[#065F46] dark:text-emerald-400 line-clamp-1">
                {scholarship.benefits.amountDescription}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-3 leading-relaxed">
          {scholarship.description}
        </p>
      </div>

      {/* Expandable "Why this matches me?" */}
      {matchResult && (
        <div className="px-5 sm:px-6 pb-2">
          <button
            onClick={() => setShowMatchReasons(!showMatchReasons)}
            className="w-full py-2 px-3 rounded-xl bg-stone-50 dark:bg-[#1C3630] hover:bg-emerald-50 dark:hover:bg-[#23453E] text-xs font-bold text-[#065F46] dark:text-emerald-300 transition-colors flex items-center justify-between border border-stone-200/80 dark:border-[#23453E]"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('whyThisMatchesMe')}</span>
            </span>
            {showMatchReasons ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showMatchReasons && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#162A24] border border-stone-200 dark:border-[#23453E] text-xs space-y-2 animate-in fade-in slide-in-from-top-1">
              <p className="font-medium text-stone-600 dark:text-stone-300 text-[11px] pb-1 border-b border-stone-200 dark:border-[#23453E]">
                {matchResult.summaryMessage}
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {matchResult.checks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {check.status === 'matched' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'unmatched' && (
                      <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span
                        className={`font-semibold ${
                          check.status === 'matched'
                            ? 'text-[#065F46] dark:text-emerald-300'
                            : check.status === 'warning'
                            ? 'text-amber-800 dark:text-amber-300'
                            : 'text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {check.label}:
                      </span>{' '}
                      <span className="text-stone-600 dark:text-stone-400 text-[11px]">
                        {check.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Footer Button */}
      <div className="p-5 sm:p-6 pt-3 bg-stone-50/60 dark:bg-[#101D1A] border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between gap-3">
        <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
          <Layers className="w-3 h-3 text-stone-400" />
          {scholarship.type}
        </span>

        <button
          onClick={() => onViewDetails(scholarship.slug)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#065F46] dark:text-emerald-400 hover:text-[#043E2F] dark:hover:text-emerald-300 focus:outline-none"
        >
          <span>{t('common.viewDetails', undefined, 'View Details')}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
        </button>
      </div>
    </div>
  );
};
