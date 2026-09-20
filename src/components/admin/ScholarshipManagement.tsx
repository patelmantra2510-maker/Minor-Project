import React, { useState, useMemo } from 'react';
import type { Scholarship } from '../../types/scholarship';
import {
  Search,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface ScholarshipManagementProps {
  scholarships: Scholarship[];
  loading: boolean;
  onOpenAddModal: () => void;
  onEditScholarship: (scholarship: Scholarship) => void;
  onViewDetails: (scholarship: Scholarship) => void;
  onDeleteScholarship: (id: string) => Promise<void>;
  onToggleFeature: (id: string, isFeatured: boolean) => Promise<void>;
  onToggleVerify: (id: string, isVerified: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const ScholarshipManagement: React.FC<ScholarshipManagementProps> = ({
  scholarships,
  loading,
  onOpenAddModal,
  onEditScholarship,
  onViewDetails,
  onDeleteScholarship,
  onToggleFeature,
  onToggleVerify,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesTag = s.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesTag) return false;
      }

      // State
      if (stateFilter !== 'all' && s.state !== stateFilter) return false;

      // Type
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;

      // Status
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      // Verified
      if (verifiedFilter === 'verified' && s.isVerified === false) return false;
      if (verifiedFilter === 'unverified' && s.isVerified !== false) return false;

      // Featured
      if (featuredFilter === 'featured' && !s.isFeatured) return false;
      if (featuredFilter === 'standard' && s.isFeatured) return false;

      return true;
    });
  }, [scholarships, searchTerm, stateFilter, typeFilter, statusFilter, verifiedFilter, featuredFilter]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await onDeleteScholarship(deletingId);
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete scholarship');
    } finally {
      setDeleteLoading(false);
    }
  };

  const targetDeleteScholarship = scholarships.find((s) => s.id === deletingId);

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
            Scholarship Directory Management
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Viewing {filteredScholarships.length} of {scholarships.length} scholarships stored in SQLite database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-emerald-950 bg-white dark:bg-[#101D19] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
            title="Refresh database"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Scholarship</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scholarship name, provider, keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {/* State */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-semibold"
          >
            <option value="all">All States</option>
            <option value="Gujarat">Gujarat Only</option>
            <option value="All India">All India Schemes</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Types</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Merit">Merit</option>
            <option value="Need-based">Need-based</option>
            <option value="Technical">Technical</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Opening Soon">Opening Soon</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Verified */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified Official</option>
            <option value="unverified">Unverified / Review</option>
          </select>

          {/* Featured */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Visibility</option>
            <option value="featured">Featured on Home</option>
            <option value="standard">Standard Catalog</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-emerald-950/60 bg-stone-50/70 dark:bg-[#0A1613]/70 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Scholarship & Provider</th>
                <th className="py-3.5 px-3">State / Type</th>
                <th className="py-3.5 px-3">Benefits</th>
                <th className="py-3.5 px-3">Deadline</th>
                <th className="py-3.5 px-3 text-center">Verified</th>
                <th className="py-3.5 px-3 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/40">
              {filteredScholarships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No scholarships match your filters or search criteria.
                  </td>
                </tr>
              ) : (
                filteredScholarships.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-stone-50/70 dark:hover:bg-emerald-950/20 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                        {s.shortName}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate mt-0.5">
                        {s.provider}
                      </div>
                    </td>

                    {/* State & Type */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          s.state === 'Gujarat'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {s.state}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {s.type}
                        </span>
                      </div>
                    </td>

                    {/* Benefits */}
                    <td className="py-4 px-3 max-w-xs">
                      <div className="font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                        {s.benefits?.amountDescription || 'Financial grant'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {s.incomeLimit ? `Income ≤ ₹${(s.incomeLimit / 100000).toFixed(1)} LPA` : 'No Income Cap'}
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                        {s.applicationDeadline || 'Portal'}
                      </div>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full font-bold text-[9px] ${
                        s.status === 'Open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>

                    {/* Verified Toggle */}
                    <td className="py-4 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onToggleVerify(s.id, !s.isVerified)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                          s.isVerified !== false
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 hover:bg-teal-200'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200'
                        }`}
                        title="Click to toggle verification status"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{s.isVerified !== false ? 'Verified' : 'Pending'}</span>
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onToggleFeature(s.id, !s.isFeatured)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                          s.isFeatured
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 hover:bg-purple-200'
                            : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200'
                        }`}
                        title="Click to toggle featured status on home page"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{s.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(s)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditScholarship(s)}
                          className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                          title="Edit Scholarship"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(s.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete Scholarship"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#101D19] border border-stone-200 dark:border-emerald-950 rounded-3xl shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold font-editorial text-stone-900 dark:text-white">
              Delete Scholarship?
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{targetDeleteScholarship?.name}</strong>?
              This record will be immediately removed from the SQLite database and will disappear from the public directory.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
