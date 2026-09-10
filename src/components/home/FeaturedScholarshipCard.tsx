import React from 'react';
import type { Scholarship } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { calculateDeadlineStatus } from '../../utils/dateUtils';
import {
  Bookmark,
  ArrowRight,
  MapPin,
  GraduationCap,
  IndianRupee,
  Building2,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface FeaturedScholarshipCardProps {
  scholarship: Scholarship;
  onViewDetails: (slug: string) => void;
}

/**
 * Formats scholarship benefits cleanly into a primary amount and a secondary period/scope
 * to ensure responsive two-line wrapping without awkward ellipses or horizontal collision.
 */
function getFormattedBenefit(benefits: Scholarship['benefits']) {
  const desc = benefits.amountDescription || '';
  
  // Extract primary amount if matches currency pattern (e.g., "Up to ₹2,00,000" or "₹50,000")
  const match = desc.match(/(Up to\s+)?₹[\d,]+/i);
  let amount = match ? match[0] : (benefits.maxAnnualAmount ? `₹${benefits.maxAnnualAmount.toLocaleString('en-IN')}` : 'Financial Aid');
  
  // Determine clean subtext
  let subtext = 'per year';
  const descLower = desc.toLowerCase();
  if (descLower.includes('lump sum')) {
    subtext = 'lump sum grant';
  } else if (descLower.includes('one-time')) {
    subtext = 'one-time aid';
  } else if (descLower.includes('month') || descLower.includes('/mo')) {
    subtext = 'per month';
  } else if (descLower.includes('tuition')) {
    subtext = 'tuition + aid';
  }

  return { amount, subtext };
}

export const FeaturedScholarshipCard: React.FC<FeaturedScholarshipCardProps> = ({
  scholarship,
  onViewDetails,
}) => {
  const { isSaved, toggleSave } = useSaved();
  const { isComparing, toggleCompare } = useCompare();

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  const deadlineInfo = calculateDeadlineStatus(
    scholarship.applicationDeadline,
    scholarship.applicationStart,
    scholarship.status
  );

  const benefitData = getFormattedBenefit(scholarship.benefits);
  const isGovernment = scholarship.type === 'Government';

  return (
    <div className="group h-full flex flex-col justify-between bg-white dark:bg-[#142420] rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1.5 hover:border-[#065F46]/50 dark:hover:border-emerald-600/50 transition-all duration-300 relative overflow-hidden">
      {/* Subtle Top Accent Strip for Brand Distinction */}
      <div
        className={`h-1 w-full ${
          isGovernment
            ? 'bg-gradient-to-r from-emerald-600/70 via-emerald-500/40 to-transparent'
            : 'bg-gradient-to-r from-amber-500/70 via-amber-400/40 to-transparent'
        }`}
      />

      {/* Main Card Content */}
      <div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col">
        {/* Top Status & Quick Action Controls */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Status Badge + Remaining Days */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                deadlineInfo.status === 'Open'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : deadlineInfo.status === 'Opening Soon'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  deadlineInfo.status === 'Open'
                    ? 'bg-emerald-600 dark:bg-emerald-400'
                    : deadlineInfo.status === 'Opening Soon'
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : 'bg-rose-600 dark:bg-rose-400'
                }`}
              />
              <span>
                {deadlineInfo.status === 'Open'
                  ? 'OPEN'
                  : deadlineInfo.status === 'Opening Soon'
                  ? 'SOON'
                  : 'CLOSED'}
              </span>
            </span>

            {deadlineInfo.status === 'Open' && deadlineInfo.daysRemaining > 0 && (
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 whitespace-nowrap">
                {deadlineInfo.daysRemaining}d left
              </span>
            )}
          </div>

          {/* Compare & Bookmark Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleCompare(scholarship.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                comparing
                  ? 'bg-[#064E3B] text-amber-100 border-[#064E3B]'
                  : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#24463E]'
              }`}
              title={comparing ? 'Remove from comparison' : 'Add to compare tray'}
            >
              {comparing ? '✓ In Compare' : '+ Compare'}
            </button>
            <button
              onClick={() => toggleSave(scholarship.id)}
              className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${
                saved
                  ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400 scale-105'
                  : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-400 hover:text-amber-600 hover:border-amber-300'
              }`}
              aria-label={saved ? 'Remove from saved' : 'Save scholarship'}
              title={saved ? 'Saved' : 'Save for later'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Location Pill */}
        <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              scholarship.state === 'Gujarat'
                ? 'bg-emerald-50/70 dark:bg-[#183028] border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-stone-100/80 dark:bg-[#1C3630] border-stone-200/60 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
            }`}
          >
            <MapPin
              className={`w-3 h-3 shrink-0 ${
                scholarship.state === 'Gujarat'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
            />
            <span>{scholarship.state === 'Gujarat' ? 'Gujarat' : 'All India'}</span>
          </span>
        </div>

        {/* Scholarship Name - Consistent 2-line height for uniform layout alignment */}
        <h3
          onClick={() => onViewDetails(scholarship.slug)}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#065F46] dark:group-hover:text-emerald-400 font-editorial leading-snug cursor-pointer transition-colors line-clamp-2 min-h-[2.8rem] flex items-start"
          title={scholarship.name}
        >
          {scholarship.name}
        </h3>

        {/* Provider Name - Controlled 2-line layout */}
        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-start gap-1.5 mt-1 font-medium min-h-[2.25rem] leading-tight">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-stone-400 dark:text-stone-500 mt-0.5" />
          <span className="line-clamp-2" title={scholarship.provider}>
            {scholarship.provider}
          </span>
        </p>

        {/* Divider */}
        <div className="border-t border-stone-100 dark:border-[#1E3A33] my-3.5" />

        {/* Key Information Matrix: EDUCATION & BENEFIT (Zero Collision Guarantee) */}
        <div className="grid grid-cols-2 gap-3 min-w-0">
          {/* Education Column */}
          <div className="min-w-0 flex flex-col justify-start">
            <div className="flex items-center gap-1.5 mb-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                EDUCATION
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-xs font-semibold text-slate-800 dark:text-stone-200 min-w-0">
              {scholarship.educationLevels.slice(0, 2).map((level, idx) => (
                <span key={idx} className="truncate block" title={level}>
                  {level}
                </span>
              ))}
              {scholarship.educationLevels.length > 2 && (
                <span className="text-[10px] font-medium text-stone-400 dark:text-stone-500">
                  +{scholarship.educationLevels.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Benefit Column */}
          <div className="min-w-0 flex flex-col justify-start pl-2.5 border-l border-stone-100 dark:border-[#1E3A33]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                BENEFIT
              </span>
            </div>
            <div className="min-w-0">
              <span
                className="text-xs font-bold text-[#065F46] dark:text-emerald-400 leading-tight block break-words"
                title={scholarship.benefits.amountDescription}
              >
                {benefitData.amount}
              </span>
              {benefitData.subtext && (
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium leading-tight block mt-0.5">
                  {benefitData.subtext}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100 dark:border-[#1E3A33] my-3.5" />

        {/* Description - Consistent Height for Alignment */}
        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {scholarship.description}
        </p>
      </div>

      {/* Card Footer - Attached to Bottom with Aligned Baseline */}
      <div className="mt-auto p-4 sm:px-6 sm:py-3.5 bg-stone-50/70 dark:bg-[#101D1A] border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between gap-2">
        <span className="inline-flex items-center text-[11px] font-semibold">
          {isGovernment ? (
            <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Government</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded-md">
              <Award className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Private</span>
            </span>
          )}
        </span>

        <button
          onClick={() => onViewDetails(scholarship.slug)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#064E3B] dark:text-emerald-400 hover:text-[#043E2F] dark:hover:text-emerald-300 transition-colors group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 text-amber-500 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};
