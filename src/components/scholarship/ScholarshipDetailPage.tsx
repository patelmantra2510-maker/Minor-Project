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

  // Add to recently viewed on mount
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scholarships</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy link"
            aria-label="Share scholarship"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleCompare(scholarship.id)}
            className={`text-xs px-3 py-2 rounded-xl font-medium border transition-colors ${
              comparing
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {comparing ? '✓ In Compare' : '+ Compare'}
          </button>
          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save for later'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {matchResult && <MatchBadge status={matchResult.status} size="md" />}
          <StatusBadge
            deadline={scholarship.applicationDeadline}
            startDate={scholarship.applicationStart}
            overrideStatus={scholarship.status}
          />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            {scholarship.state === 'Gujarat' ? 'Gujarat State Scheme' : 'All India Scheme'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {scholarship.type}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {scholarship.name}
        </h1>

        <div className="flex items-center gap-2 mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{scholarship.provider}</span>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
              Max Benefits
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {scholarship.benefits.amountDescription}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
              Application Deadline
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {formatDate(scholarship.applicationDeadline)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
              Eligibility Levels
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
              {scholarship.educationLevels.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Student Specific Match Verdict (if navigated from Finder) */}
      {matchResult && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 rounded-3xl p-6 sm:p-8 border border-blue-200 dark:border-blue-900 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Personalized Eligibility Analysis
                </h2>
                <MatchBadge status={matchResult.status} size="sm" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {matchResult.summaryMessage}
              </p>

              {/* Checklist breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/60">
                {matchResult.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-xs flex items-start gap-2.5"
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
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {check.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
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

      {/* Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              About the Scholarship
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {scholarship.description}
            </p>
          </section>

          {/* Who Can Apply */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Who Can Apply?
            </h2>
            <ul className="space-y-2.5">
              {scholarship.whoCanApply.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Eligibility Criteria Table */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Eligibility Criteria Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="pb-3 pr-4">Criteria</th>
                    <th className="pb-3">Official Rule / Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Location</td>
                    <td className="py-3">{scholarship.state === 'Gujarat' ? 'Gujarat Domicile / Gujarat Institution' : 'All States across India'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Education Level</td>
                    <td className="py-3">{scholarship.educationLevels.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Annual Family Income</td>
                    <td className="py-3">
                      {scholarship.incomeLimit ? `Equal to or less than ₹${scholarship.incomeLimit.toLocaleString('en-IN')} per year` : 'No family income limit specified'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Minimum Marks</td>
                    <td className="py-3">
                      {scholarship.minimumPercentage ? `${scholarship.minimumPercentage}% or above in qualifying exam` : 'Passing marks in qualifying examination'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Gender Eligibility</td>
                    <td className="py-3">{scholarship.genderEligibility === 'All' ? 'Open to all students' : `${scholarship.genderEligibility} students only`}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Social Category</td>
                    <td className="py-3">{scholarship.categories.join(', ')}</td>
                  </tr>
                  {scholarship.specialConditions?.verificationNote && (
                    <tr>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white pr-4">Special Note</td>
                      <td className="py-3 text-amber-700 dark:text-amber-400 font-medium">
                        {scholarship.specialConditions.verificationNote}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Apply Steps */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              How to Apply (Official Procedure)
            </h2>
            <ol className="space-y-4">
              {scholarship.howToApplySteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right Sidebar: Apply Now, Benefits, Dates & Documents (1 Col) */}
        <div className="space-y-6">
          {/* Apply Now Primary Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg shadow-blue-500/20">
            <h3 className="text-lg font-bold">Apply on Official Portal</h3>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Applications must be submitted directly through the authorized government or organization website.
            </p>

            <a
              href={scholarship.applicationWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-5 py-3.5 px-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>Go to Application Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="mt-4 pt-4 border-t border-blue-500/50 flex items-center justify-between text-xs text-blue-100">
              <span>Official Website:</span>
              <a
                href={scholarship.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white truncate max-w-[160px]"
              >
                {new URL(scholarship.officialWebsite).hostname}
              </a>
            </div>
          </div>

          {/* Application Dates Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-blue-600" />
              Important Dates
            </h3>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Applications Open:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(scholarship.applicationStart)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Application Deadline:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(scholarship.applicationDeadline)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Current Status:</span>
                <StatusBadge
                  deadline={scholarship.applicationDeadline}
                  startDate={scholarship.applicationStart}
                  overrideStatus={scholarship.status}
                />
              </div>
            </div>
          </div>

          {/* Required Documents Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-blue-600" />
              Required Documents
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep verified, self-attested soft copies ready before applying:
            </p>
            <ul className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
              {scholarship.documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Freshness and Trust metadata */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Last updated: {formatDate(scholarship.lastUpdated)}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Official data verified against current notification bulletins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
