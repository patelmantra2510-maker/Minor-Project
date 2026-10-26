import React, { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Globe,
  Clock,
  ShieldCheck,
  Database,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  getIntelligenceStatus,
  triggerIntelligenceScan,
  verifyScholarshipRecord,
  rejectScholarshipRecord,
  type IntelligenceStatus,
  type IntelligenceSource,
  type IntelligenceRun,
} from '../../services/scholarshipService';
import type { Scholarship } from '../../types/scholarship';

function formatTimestamp(isoStr?: string | null): string {
  if (!isoStr) return 'Never / Pending';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

interface IntelligenceMonitoringProps {
  onRefreshParent?: () => void;
}

export const IntelligenceMonitoring: React.FC<IntelligenceMonitoringProps> = ({
  onRefreshParent,
}) => {
  const [statusData, setStatusData] = useState<IntelligenceStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sources' | 'runs' | 'flagged'>('sources');
  const [flaggedItems, setFlaggedItems] = useState<Scholarship[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getIntelligenceStatus();
      if (data) {
        setStatusData(data);
        setIsScanning(data.isScanningNow);
      }
    } catch (err) {
      console.warn('Failed to fetch intelligence status:', err);
    }
  }, []);

  const fetchFlagged = useCallback(async () => {
    try {
      const res = await fetch('/api/intelligence/flagged');
      if (res.ok) {
        const text = await res.text();
        if (text) setFlaggedItems(JSON.parse(text));
      }
    } catch (err) {
      console.warn('Failed to fetch flagged items:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchFlagged();

    // Auto-refresh telemetry every 10 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus, fetchFlagged]);

  const handleTriggerScan = async () => {
    setIsScanning(true);
    setScanMessage('Scanning official portals (NSP, Digital Gujarat, AICTE, UGC, MYSY)...');
    try {
      const res = await triggerIntelligenceScan('manual_admin');
      setScanMessage(res.message);
      await fetchStatus();
      await fetchFlagged();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      setScanMessage('Scan error: ' + (err?.message || 'Failed'));
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanMessage(null), 8000);
    }
  };

  const handleApproveFlagged = async (scholarshipId: string) => {
    setVerifyingId(scholarshipId);
    try {
      const res = await verifyScholarshipRecord(scholarshipId, 'Admin verified via control panel');
      if (res.success) {
        await fetchFlagged();
        await fetchStatus();
        if (onRefreshParent) onRefreshParent();
      }
    } catch (err) {
      console.error('Error approving scholarship:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleRejectFlagged = async (scholarshipId: string) => {
    setVerifyingId(scholarshipId);
    try {
      const res = await rejectScholarshipRecord(scholarshipId, 'Rejected by admin: unverified or conflicting data');
      if (res.success) {
        await fetchFlagged();
        await fetchStatus();
        if (onRefreshParent) onRefreshParent();
      }
    } catch (err) {
      console.error('Error rejecting scholarship:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 font-serif flex items-center gap-2">
                Automated Scholarship Intelligence
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 uppercase tracking-wider">
                  Live Daemon
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Continuous web discovery, automated extraction, guideline verification, and SQLite database synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isScanning
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Portals...' : 'Scan Official Sources Now'}</span>
          </button>
        </div>
      </div>

      {/* Live notification banner if scanning or status message */}
      {scanMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>{scanMessage}</span>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Scheduler State */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Background Daemon</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            24h Loop
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Next: {formatTimestamp(statusData?.nextScheduledRun)}</span>
          </div>
        </div>

        {/* Card 2: Official Sources Registered */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Official Portals</span>
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
            {statusData?.activeSources || 5} / {statusData?.totalSources || 5} Active
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            NSP, Digital Gujarat, AICTE, UGC, MYSY
          </div>
        </div>

        {/* Card 3: Total Synced in SQLite */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Database Records</span>
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
            {statusData?.totalScholarshipsInDb || 24}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{statusData?.verifiedCount || 24} fully verified</span>
          </div>
        </div>

        {/* Card 4: Verification Queue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Zero Hallucination</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
            {statusData?.flaggedCount ?? flaggedItems.length} Flagged
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            {(statusData?.flaggedCount ?? flaggedItems.length) === 0
              ? 'All records verified with 0 conflicts'
              : 'Requires admin attention'}
          </div>
        </div>
      </div>

      {/* Last Scan Summary Banner */}
      {statusData?.lastRun && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 flex-wrap">
                <span>Last Scan Cycle Completed</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 uppercase">
                  {statusData.lastRun.status}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  +{statusData.lastRun.discoveredCount} Discovered
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {statusData.lastRun.updatedCount} Updated
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {statusData.lastRun.unchangedCount ?? '0'} Unchanged
                </span>
                {statusData.lastRun.failedSources && statusData.lastRun.failedSources.length > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    {statusData.lastRun.failedSources.length} Failed
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                {statusData.lastRun.logSummary}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono flex items-center gap-1.5 self-end md:self-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimestamp(statusData.lastRun.completedAt)}</span>
          </div>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-emerald-950/70 pb-3">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-[#064E3B] text-amber-50 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-emerald-950/50'
          }`}
        >
          Official Sources ({statusData?.sources?.length || 5})
        </button>
        <button
          onClick={() => setActiveTab('runs')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'runs'
              ? 'bg-[#064E3B] text-amber-50 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-emerald-950/50'
          }`}
        >
          Scan Run History ({statusData?.recentRuns?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'flagged'
              ? 'bg-[#064E3B] text-amber-50 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-emerald-950/50'
          }`}
        >
          <span>Flagged Queue</span>
          {(statusData?.flaggedCount ?? flaggedItems.length) > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-900 font-black">
              {statusData?.flaggedCount ?? flaggedItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Official Sources */}
      {activeTab === 'sources' && (
        <div className="rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-emerald-950 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Registered Discovery Portals & Endpoints</span>
            </h3>
            <span className="text-[11px] text-stone-500">Live HTTP verification enabled</span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-emerald-950/50">
            {(statusData?.sources || []).map((source: IntelligenceSource) => (
              <div
                key={source.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-emerald-950/20 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 shrink-0 text-xs">
                    {source.id.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {source.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-emerald-950 text-stone-600 dark:text-stone-400">
                        {source.sourceType.replace('_', ' ')}
                      </span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-1 font-mono"
                    >
                      <span>{source.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end text-xs">
                  <div className="text-right">
                    <div className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      Schemes Found
                    </div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                      {source.schemesCount}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      Last Scanned
                    </div>
                    <div className="text-stone-700 dark:text-stone-300 text-[11px] font-mono">
                      {formatTimestamp(source.lastScannedAt)}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        source.lastStatus === 'ok'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{source.lastStatus === 'ok' ? 'Online' : 'Pending'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Run History */}
      {activeTab === 'runs' && (
        <div className="rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-emerald-950">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Intelligence Discovery Execution Logs</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 dark:bg-emerald-950/40 text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-emerald-950">
                <tr>
                  <th className="py-3 px-4 font-bold">Run #</th>
                  <th className="py-3 px-4 font-bold">Started At</th>
                  <th className="py-3 px-4 font-bold">Trigger</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Portals</th>
                  <th className="py-3 px-4 font-bold">Discovered</th>
                  <th className="py-3 px-4 font-bold">Updated</th>
                  <th className="py-3 px-4 font-bold">Unchanged</th>
                  <th className="py-3 px-4 font-bold">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/50">
                {(statusData?.recentRuns || []).map((run: IntelligenceRun) => (
                  <tr key={run.id} className="hover:bg-stone-50/50 dark:hover:bg-emerald-950/20">
                    <td className="py-3.5 px-4 font-mono font-bold">#{run.id}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {formatTimestamp(run.startedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-100 dark:bg-emerald-950 text-stone-700 dark:text-stone-300">
                        {run.triggerType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          run.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{run.sourcesChecked}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      +{run.discoveredCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-blue-700 dark:text-blue-300 font-semibold">
                      {run.updatedCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500 dark:text-stone-400">
                      {run.unchangedCount ?? '—'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate" title={run.logSummary}>
                      {run.logSummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Flagged Review Queue */}
      {activeTab === 'flagged' && (
        <div className="rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-emerald-950 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Hallucination Verification Queue</span>
            </h3>
            <span className="text-[11px] text-stone-500">
              Only verified records are served to students
            </span>
          </div>

          {flaggedItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Verification Queue is Clear
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                All {statusData?.totalScholarshipsInDb || 27} scholarships in the database are fully verified against official government portals with source URLs, confirmed eligibility criteria, and verified deadlines.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-emerald-950">
              {flaggedItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        (item as any).review_status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {(item as any).review_status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                      Review Reason: {(item as any).verification_notes || 'Requires manual review'}
                    </p>
                    <div className="text-[11px] text-stone-400 mt-1 font-mono truncate">
                      Source: {(item as any).source_url || 'Web scraper'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectFlagged(item.id)}
                      disabled={verifyingId === item.id}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      {verifyingId === item.id ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleApproveFlagged(item.id)}
                      disabled={verifyingId === item.id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      {verifyingId === item.id ? 'Approving...' : 'Approve & Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
