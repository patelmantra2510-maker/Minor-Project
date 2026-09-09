import React, { useEffect } from 'react';
import type { Scholarship, MatchResult } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { StatusBadge, MatchBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  GraduationCap,
  FileText,
  AlertCircle,
  Share2,
  Clock,
  Ban,
} from 'lucide-react';

interface ScholarshipDetailPageProps {
  scholarship: Scholarship;
  matchResult?: MatchResult;
  onBack: () => void;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  scholarship,
  matchResult,
  onBack,
}) => {
  const { isSaved, toggleSave, addRecentlyViewed } = useSaved();
  const { isComparing, toggleCompare } = useCompare();

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  useEffect(() => {
    addRecentlyViewed(scholarship.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scholarship.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Scholarship link copied to clipboard!');
    }
  };

  // Derive "Who Cannot Apply" from known hard conditions
  const whoCannotApplyList = [
    scholarship.state === 'Gujarat' ? 'Students without Gujarat domicile or not enrolled in Gujarat recognized institutions.' : null,
    scholarship.genderEligibility === 'Female' ? 'Male students (this scheme is exclusively for eligible girl students).' : null,
    scholarship.incomeLimit ? `Candidates whose family annual income exceeds ₹${scholarship.incomeLimit.toLocaleString('en-IN')}.` : null,
    scholarship.minimumPercentage ? `Candidates scoring below the minimum ${scholarship.minimumPercentage}% cutoff.` : null,
    scholarship.specialConditions?.disabilityRequired ? 'Candidates without a verified UDID / benchmark disability certificate (>= 40%).' : null,
    'Students pursuing distance, part-time, or unapproved correspondence courses unless explicitly allowed.',
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scholarships</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-stone-200 dark:border-[#1E3A33] bg-white dark:bg-[#142420] text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition-colors"
            title="Copy link"
            aria-label="Share scholarship"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleCompare(scholarship.id)}
            className={`text-xs px-3 py-2 rounded-xl font-bold border transition-colors ${
              comparing
                ? 'bg-[#064E3B] text-amber-100 border-[#064E3B]'
                : 'bg-white dark:bg-[#142420] border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {comparing ? '✓ In Compare' : '+ Compare'}
          </button>
          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              saved
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'bg-white dark:bg-[#142420] border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save for later'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {matchResult && <MatchBadge status={matchResult.status} size="md" />}
          <StatusBadge
            deadline={scholarship.applicationDeadline}
            startDate={scholarship.applicationStart}
            overrideStatus={scholarship.status}
          />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
            {scholarship.state === 'Gujarat' ? 'Gujarat State Scheme' : 'All India Scheme'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-[#132A24] text-[#064E3B] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {scholarship.type}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-editorial tracking-tight leading-tight">
          {scholarship.name}
        </h1>

        <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
          <Building2 className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0" />
          <span>{scholarship.provider}</span>
        </div>

        {/* Quick Matrix Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E] text-xs sm:text-sm">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
              Max Benefits
            </span>
            <span className="text-base font-bold text-[#064E3B] dark:text-emerald-400 mt-0.5 block">
              {scholarship.benefits.amountDescription}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
              Application Deadline
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-stone-200 mt-0.5 block">
              {formatDate(scholarship.applicationDeadline)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
              Eligible Levels
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-stone-200 mt-0.5 block truncate">
              {scholarship.educationLevels.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Personalized Match Analysis (if navigated from Finder) */}
      {matchResult && (
        <div className="bg-gradient-to-r from-emerald-50 to-amber-50/50 dark:from-[#142420] dark:to-[#182E29] rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800 shadow-2xs mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#064E3B] text-amber-300 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial">
                  Your Personalized Eligibility Analysis
                </h2>
                <MatchBadge status={matchResult.status} size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
                {matchResult.summaryMessage}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-200/60 dark:border-[#23453E]">
                {matchResult.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/90 dark:bg-[#1C3630] border border-stone-200/70 dark:border-[#23453E] text-xs flex items-start gap-2.5"
                  >
                    {check.status === 'matched' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'warning' && (
                      <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'unmatched' && (
                      <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 dark:text-stone-200 block">
                        {check.label}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                        {check.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#065F46]" />
              Overview
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {scholarship.description}
            </p>
          </section>

          {/* Who Can Apply */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#065F46]" />
              Who Can Apply?
            </h2>
            <ul className="space-y-2.5">
              {scholarship.whoCanApply.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-[#1C3630] text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Who Cannot Apply (Explicitly required) */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-rose-800 dark:text-rose-400 font-editorial mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              Who Cannot Apply?
            </h2>
            <ul className="space-y-2.5">
              {whoCannotApplyList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Eligibility Criteria Matrix */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs overflow-hidden">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4">
              Eligibility Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-[#1E3A33] text-stone-400 uppercase text-[11px] font-bold">
                    <th className="pb-3 pr-4">Criteria</th>
                    <th className="pb-3">Verified Official Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-[#1E3A33] text-stone-700 dark:text-stone-300">
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Location</td>
                    <td className="py-3">{scholarship.state === 'Gujarat' ? 'Gujarat Domicile / Gujarat Institution' : 'All States across India'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Education Level</td>
                    <td className="py-3">{scholarship.educationLevels.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Income Ceiling</td>
                    <td className="py-3 font-semibold text-[#065F46] dark:text-emerald-400">
                      {scholarship.incomeLimit ? `≤ ₹${scholarship.incomeLimit.toLocaleString('en-IN')} per annum` : 'No family income limit specified'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Minimum Marks</td>
                    <td className="py-3">
                      {scholarship.minimumPercentage ? `≥ ${scholarship.minimumPercentage}% in qualifying exam` : 'Passing marks in qualifying examination'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Gender</td>
                    <td className="py-3">{scholarship.genderEligibility === 'All' ? 'All students' : `${scholarship.genderEligibility} only`}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Social Category</td>
                    <td className="py-3">{scholarship.categories.join(', ')}</td>
                  </tr>
                  {scholarship.specialConditions?.verificationNote && (
                    <tr>
                      <td className="py-3 font-bold text-slate-900 dark:text-white pr-4">Condition Note</td>
                      <td className="py-3 text-amber-700 dark:text-amber-400 font-medium">
                        {scholarship.specialConditions.verificationNote}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Application Process */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4">
              Application Process
            </h2>
            <ol className="space-y-4">
              {scholarship.howToApplySteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  <span className="w-6 h-6 rounded-full bg-[#064E3B] text-amber-100 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Apply on Official Website CTA */}
          <div className="bg-gradient-to-br from-[#064E3B] to-[#043326] text-white rounded-3xl p-6 shadow-xl border border-emerald-800">
            <h3 className="text-lg font-bold font-editorial">Apply on Official Source</h3>
            <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
              Edvora does not process applications or fee transfers. Your application must be submitted directly on the authorized provider portal.
            </p>

            <a
              href={scholarship.applicationWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-5 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="mt-4 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-100">
              <span>Official Website:</span>
              <a
                href={scholarship.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white truncate max-w-[150px]"
              >
                {new URL(scholarship.officialWebsite).hostname}
              </a>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs text-sm space-y-3">
            <h3 className="font-bold text-[#064E3B] dark:text-white font-editorial flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-amber-500" />
              Important Dates
            </h3>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-[#1E3A33]">
                <span className="text-stone-400">Applications Open:</span>
                <span className="font-semibold text-slate-800 dark:text-stone-200">
                  {formatDate(scholarship.applicationStart)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 dark:border-[#1E3A33]">
                <span className="text-stone-400">Application Deadline:</span>
                <span className="font-semibold text-slate-800 dark:text-stone-200">
                  {formatDate(scholarship.applicationDeadline)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Current Status:</span>
                <StatusBadge
                  deadline={scholarship.applicationDeadline}
                  startDate={scholarship.applicationStart}
                  overrideStatus={scholarship.status}
                />
              </div>
            </div>
          </div>

          {/* Documents Required */}
          <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs text-sm space-y-3">
            <h3 className="font-bold text-[#064E3B] dark:text-white font-editorial flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-amber-500" />
              Documents Required
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Prepare verified, self-attested soft copies:
            </p>
            <ul className="space-y-2 pt-1 text-xs text-stone-600 dark:text-stone-300">
              {scholarship.documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Last Updated metadata */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200 dark:border-[#23453E] text-xs text-stone-500 dark:text-stone-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Last updated: {formatDate(scholarship.lastUpdated)}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Information checked against official portal bulletins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
