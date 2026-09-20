import React from 'react';
import type { Scholarship } from '../../types/scholarship';
import {
  X,
  ShieldCheck,
  Sparkles,
  Building,
  CheckCircle2,
  FileText,
  DollarSign,
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onEdit: (scholarship: Scholarship) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onEdit,
}) => {
  if (!scholarship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#101D19] border border-stone-200 dark:border-emerald-950 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-emerald-950/60 flex items-start justify-between gap-4 bg-stone-50/50 dark:bg-[#0A1613]/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                scholarship.state === 'Gujarat'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
              }`}>
                {scholarship.state}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 text-xs font-semibold">
                {scholarship.type}
              </span>
              {scholarship.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
              {scholarship.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-white">
              {scholarship.name}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{scholarship.provider}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Key Facts Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Income Limit</span>
              <div className="font-bold text-stone-900 dark:text-white mt-1">
                {scholarship.incomeLimit ? `₹${scholarship.incomeLimit.toLocaleString('en-IN')}/yr` : 'No Limit'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Min Percentage</span>
              <div className="font-bold text-stone-900 dark:text-white mt-1">
                {scholarship.minimumPercentage ? `${scholarship.minimumPercentage}%` : 'Passing Marks'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Status</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {scholarship.status}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <span className="text-[11px] text-stone-400 uppercase font-bold">Deadline</span>
              <div className="font-bold text-stone-900 dark:text-white mt-1 font-mono text-xs">
                {scholarship.applicationDeadline || 'Portal dependent'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-2">Description</h4>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-[#0A1613] p-4 rounded-2xl">
              {scholarship.description || 'No description provided.'}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Financial Benefits</span>
            </h4>
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                {scholarship.benefits.amountDescription}
              </div>
              {scholarship.benefits.tuitionFeeCoverage && (
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <strong>Tuition:</strong> {scholarship.benefits.tuitionFeeCoverage}
                </div>
              )}
              {scholarship.benefits.hostelAllowance && (
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <strong>Hostel:</strong> {scholarship.benefits.hostelAllowance}
                </div>
              )}
              {scholarship.benefits.bookAllowance && (
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <strong>Books/Equipment:</strong> {scholarship.benefits.bookAllowance}
                </div>
              )}
            </div>
          </div>

          {/* Eligibility Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <h4 className="font-bold text-xs uppercase text-stone-400 mb-2">Education Levels</h4>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.educationLevels.map((lvl) => (
                  <span key={lvl} className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                    {lvl}
                  </span>
                ))}
              </div>

              <h4 className="font-bold text-xs uppercase text-stone-400 mt-4 mb-2">Social Categories</h4>
              <div className="flex flex-wrap gap-1.5">
                {scholarship.categories.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60">
              <h4 className="font-bold text-xs uppercase text-stone-400 mb-2">Eligible Courses</h4>
              <div className="max-h-36 overflow-y-auto space-y-1">
                {scholarship.courses.map((c) => (
                  <div key={c} className="text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Required Documents ({scholarship.documents.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scholarship.documents.map((doc, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0A1613] text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official URLs */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="space-y-1 text-xs">
              <div><strong>Official Website:</strong> <a href={scholarship.officialWebsite} target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 underline">{scholarship.officialWebsite}</a></div>
              <div><strong>Application Portal:</strong> <a href={scholarship.applicationWebsite} target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 underline">{scholarship.applicationWebsite}</a></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-stone-100 dark:border-emerald-950/60 flex items-center justify-end gap-3 bg-stone-50/50 dark:bg-[#0A1613]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(scholarship);
            }}
            className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Edit This Scholarship
          </button>
        </div>
      </div>
    </div>
  );
};
