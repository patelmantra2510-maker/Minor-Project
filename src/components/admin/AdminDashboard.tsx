import React from 'react';
import type { Scholarship } from '../../types/scholarship';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FolderTree,
  TrendingUp,
  Clock,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: any;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onEditScholarship: (scholarship: Scholarship) => void;
  onViewDetails: (scholarship: Scholarship) => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  loading,
  onNavigateTab,
  onOpenAddModal,
  onEditScholarship,
  onViewDetails,
  onViewPublicSite,
}) => {
  if (loading && !stats) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mb-3" />
        <p className="text-xs text-stone-500">Connecting to SQLite database & compiling real-time statistics...</p>
      </div>
    );
  }

  const totalScholarships = stats?.totalScholarships ?? 0;
  const verifiedCount = stats?.verifiedCount ?? 0;
  const unverifiedCount = stats?.unverifiedCount ?? 0;
  const featuredCount = stats?.featuredCount ?? 0;
  const categoriesCount = stats?.categories?.totalDistinctCategories ?? 0;
  const openCount = stats?.openCount ?? 0;
  const gujaratCount = stats?.stateDistribution?.gujarat ?? 0;
  const allIndiaCount = stats?.stateDistribution?.allIndia ?? 0;
  const recentUpdated: Scholarship[] = stats?.recentUpdated || [];
  const recentActivity: any[] = stats?.recentActivity || [];

  // Calculate percentages
  const gujaratPct = totalScholarships > 0 ? Math.round((gujaratCount / totalScholarships) * 100) : 0;
  const allIndiaPct = totalScholarships > 0 ? Math.round((allIndiaCount / totalScholarships) * 100) : 0;

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#043427] text-white shadow-xl shadow-emerald-950/15 relative overflow-hidden">
        {/* Background ambient shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Database Connected (SQLite WAL Mode)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-amber-50">
              Edvora Management Overview
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Real-time administrative control center. Monitor database metrics, edit eligibility rules, manage verification statuses, and curate featured opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Scholarship</span>
            </button>
            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Scholarships */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-emerald-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {totalScholarships}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Total Schemes
          </div>
        </div>

        {/* Verified */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-emerald-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {verifiedCount}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Verified Active
          </div>
        </div>

        {/* Pending / Unverified */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-amber-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {unverifiedCount}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Pending / Review
          </div>
        </div>

        {/* Featured */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-amber-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {featuredCount}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Featured on Home
          </div>
        </div>

        {/* Categories */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-blue-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
            <FolderTree className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {categoriesCount}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Active Categories
          </div>
        </div>

        {/* Open Applications */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs hover:border-emerald-300 transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-editorial">
            {openCount}
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Open Applications
          </div>
        </div>
      </div>

      {/* Distribution Charts & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Geographic Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Geographic Coverage</span>
            </h3>
            <span className="text-[11px] font-semibold text-stone-400">Gujarat vs All India</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-800 dark:text-emerald-300">Gujarat State Initiatives</span>
                <span className="text-stone-600 dark:text-stone-400 font-mono">{gujaratCount} schemes ({gujaratPct}%)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 dark:bg-[#0A1613] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${gujaratPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-blue-800 dark:text-blue-300">All India (National / Central)</span>
                <span className="text-stone-600 dark:text-stone-400 font-mono">{allIndiaCount} schemes ({allIndiaPct}%)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 dark:bg-[#0A1613] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${allIndiaPct}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-emerald-950/60 flex items-center justify-between text-xs text-stone-500">
              <span>Database Engine: <strong className="text-stone-800 dark:text-stone-200">SQLite 3 (WAL)</strong></span>
              <span>Size: <strong className="text-stone-800 dark:text-stone-200">{stats?.databaseSizeFormatted || 'Local'}</strong></span>
            </div>
          </div>
        </div>

        {/* Top Social Categories Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-500" />
              <span>Category Distribution</span>
            </h3>
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {stats?.categories?.socialCategories &&
              Object.entries(stats.categories.socialCategories)
                .slice(0, 5)
                .map(([cat, count]: [string, any]) => (
                  <div key={cat} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-[#0A1613] text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{cat}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold font-mono">
                      {count} schemes
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* User Privacy & Session Model Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Users & Privacy Architecture</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              Privacy-by-Design
            </span>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Edvora operates with <strong>Zero PII Collection</strong>. Student questionnaire answers and saved bookmarks reside strictly in client browser sessions (<code>sessionStorage</code> and <code>localStorage</code>).
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Public Accounts Stored:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">0 (Zero tracking)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Admin Authority:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Authenticated (SHA-256)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Session Mode:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">Ephemeral Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recently Updated Scholarships & Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Updated Scholarships Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-editorial">
                Recently Updated Scholarships
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Latest changes saved in the database
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('scholarships')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 cursor-pointer"
            >
              Manage All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-emerald-950/60 text-stone-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Scholarship</th>
                  <th className="pb-3">State</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Updated</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/40">
                {recentUpdated.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/60 dark:hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-stone-900 dark:text-white">{s.shortName}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-xs">{s.provider}</div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        s.state === 'Gujarat'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                      }`}>
                        {s.state}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        s.status === 'Open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-stone-500 font-mono text-[11px]">
                      {s.lastUpdated || 'Recent'}
                    </td>
                    <td className="py-3.5 text-right space-x-1">
                      <button
                        onClick={() => onViewDetails(s)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#0A1613] hover:bg-stone-200 dark:hover:bg-emerald-950 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEditScholarship(s)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Administrative Audit Activity Feed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recent Activity Audit</span>
            </h3>
            <span className="text-[10px] text-stone-400">Last 10 Actions</span>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No recent administrative activity logged yet.</p>
            ) : (
              recentActivity.map((log: any) => (
                <div key={log.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-[#0A1613] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200 uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-stone-200 dark:bg-emerald-950">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-snug">
                    {log.details || `${log.action} on ${log.entity_type}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
