import React, { useState } from 'react';
import type { Scholarship, MatchResult } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
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
  const { isSaved, toggleSave } = useSaved();
  const { isComparing, toggleCompare } = useCompare();
  const [showMatchReasons, setShowMatchReasons] = useState(false);

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 flex flex-col justify-between overflow-hidden">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3 h-3 text-blue-500" />
              {scholarship.state === 'Gujarat' ? 'Gujarat' : 'All India'}
            </span>
          </div>

          {/* Quick Actions: Save & Compare */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleCompare(scholarship.id)}
              className={`text-xs px-2 py-1 rounded-md font-medium border transition-colors ${
                comparing
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Add to comparison tray"
            >
              {comparing ? '✓ In Compare' : '+ Compare'}
            </button>
            <button
              onClick={() => toggleSave(scholarship.id)}
              className={`p-1.5 rounded-full border transition-all ${
                saved
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400 scale-110'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900'
              }`}
              aria-label={saved ? 'Remove from saved' : 'Save scholarship'}
              title={saved ? 'Saved' : 'Save for later'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Provider */}
        <h3
          onClick={() => onViewDetails(scholarship.slug)}
          className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2"
        >
          {scholarship.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        {/* Key Information Chips */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Education</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {scholarship.educationLevels.slice(0, 2).join(' · ')}
                {scholarship.educationLevels.length > 2 && ' +more'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Benefits</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 line-clamp-1">
                {scholarship.benefits.amountDescription}
              </span>
            </div>
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-3 leading-relaxed">
          {scholarship.description}
        </p>
      </div>

      {/* "Why This Matches Me?" Expandable Section */}
      {matchResult && (
        <div className="px-5 sm:px-6 pb-2">
          <button
            onClick={() => setShowMatchReasons(!showMatchReasons)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors flex items-center justify-between border border-slate-200 dark:border-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Why this matches me?</span>
            </span>
            {showMatchReasons ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showMatchReasons && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in slide-in-from-top-1">
              <p className="font-medium text-slate-600 dark:text-slate-300 text-[11px] pb-1 border-b border-slate-200 dark:border-slate-700">
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
                            ? 'text-emerald-800 dark:text-emerald-300'
                            : check.status === 'warning'
                            ? 'text-amber-800 dark:text-amber-300'
                            : 'text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {check.label}:
                      </span>{' '}
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">
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
      <div className="p-5 sm:p-6 pt-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Layers className="w-3 h-3 text-slate-400" />
          {scholarship.type}
        </span>

        <button
          onClick={() => onViewDetails(scholarship.slug)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
        >
          <span>View Scholarship</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
