import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import {
  X,
  ExternalLink,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ComparisonModal: React.FC = () => {
  const {
    compareIds,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    closeCompareModal,
  } = useCompare();

  if (!isCompareModalOpen) return null;

  const scholarships = SCHOLARSHIPS_DATA.filter((s) => compareIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Compare Scholarships ({scholarships.length}/3)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Side-by-side comparison of eligibility criteria, benefits, and deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {scholarships.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeCompareModal}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {scholarships.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No scholarships selected for comparison
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Browse scholarships and click &quot;+ Compare&quot; on any 2 or 3 cards to compare them here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 w-40 text-slate-400 uppercase text-[11px] font-bold">
                      Feature
                    </th>
                    {scholarships.map((s) => (
                      <th key={s.id} className="p-3 align-top min-w-[220px]">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                            {s.name}
                          </h4>
                          <button
                            onClick={() => removeFromCompare(s.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          {s.provider}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Status & Deadline */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Status & Deadline</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3">
                        <StatusBadge deadline={s.applicationDeadline} startDate={s.applicationStart} overrideStatus={s.status} />
                        <div className="text-[11px] text-slate-500 mt-1">Deadline: {formatDate(s.applicationDeadline)}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Location</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {s.state}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Education Level */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Education Level</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 font-medium">
                        {s.educationLevels.join(', ')}
                      </td>
                    ))}
                  </tr>

                  {/* Income Limit */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Income Ceiling</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 font-medium text-emerald-700 dark:text-emerald-400">
                        {s.incomeLimit ? `≤ ₹${s.incomeLimit.toLocaleString('en-IN')}` : 'No Ceiling (Merit)'}
                      </td>
                    ))}
                  </tr>

                  {/* Academic Cutoff */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Min. Percentage</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 font-medium">
                        {s.minimumPercentage ? `≥ ${s.minimumPercentage}%` : 'Passing Marks'}
                      </td>
                    ))}
                  </tr>

                  {/* Gender Eligibility */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Gender</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 font-medium">
                        {s.genderEligibility === 'All' ? 'All Genders' : `${s.genderEligibility} Only`}
                      </td>
                    ))}
                  </tr>

                  {/* Categories */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Category</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 font-medium">
                        {s.categories.join(', ')}
                      </td>
                    ))}
                  </tr>

                  {/* Benefits */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Benefits</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        {s.benefits.amountDescription}
                      </td>
                    ))}
                  </tr>

                  {/* Action Link */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Official Link</td>
                    {scholarships.map((s) => (
                      <td key={s.id} className="p-3">
                        <a
                          href={s.applicationWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                        >
                          <span>Official Portal</span>
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

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xl border border-slate-700 flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs sm:text-sm font-semibold">
            Comparing {compareIds.length} {compareIds.length === 1 ? 'scholarship' : 'scholarships'}
          </span>
        </div>

        <button
          onClick={openCompareModal}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          Compare Now →
        </button>

        <button
          onClick={clearCompare}
          className="text-slate-400 hover:text-white text-xs font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
