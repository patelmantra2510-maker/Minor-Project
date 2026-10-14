import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useScholarships } from '../../context/ScholarshipContext';
import {
  getApproachingDeadlines,
  dismissNotification,
} from '../../utils/deadlineAlerts';
import {
  Bell,
  X,
  Clock,
  ArrowRight,
  CheckCheck,
  Calendar,
} from 'lucide-react';

interface DeadlineNotificationDropdownProps {
  onNavigate: (route: string) => void;
}

export const DeadlineNotificationDropdown: React.FC<DeadlineNotificationDropdownProps> = ({
  onNavigate,
}) => {
  const { scholarships } = useScholarships();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Local state to trigger re-renders when notifications are dismissed
  const [dismissedVersion, setDismissedVersion] = useState(0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Find approaching deadlines (within 7 days) and filter by dismissed
  const activeAlerts = useMemo(() => {
    // Rely on dismissedVersion to recompute when items are dismissed
    void dismissedVersion;
    return getApproachingDeadlines(scholarships, 7, new Date(), false);
  }, [scholarships, dismissedVersion]);

  const handleDismiss = useCallback((scholarshipId: string, deadlineStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dismissNotification(scholarshipId, deadlineStr);
    setDismissedVersion((v) => v + 1);
  }, []);

  const handleDismissAll = useCallback(() => {
    activeAlerts.forEach(({ scholarship }) => {
      dismissNotification(scholarship.id, scholarship.applicationDeadline);
    });
    setDismissedVersion((v) => v + 1);
  }, [activeAlerts]);

  const handleItemClick = (slug: string) => {
    onNavigate(`scholarships/${slug}`);
    setIsOpen(false);
  };

  const hasUrgent = activeAlerts.some(({ alert }) => alert.isUrgent);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
          isOpen
            ? 'bg-stone-100 dark:bg-emerald-950 text-stone-900 dark:text-stone-100'
            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-emerald-950'
        }`}
        aria-label="Scholarship deadline notifications"
        title={
          activeAlerts.length > 0
            ? `${activeAlerts.length} scholarship deadline alert${activeAlerts.length === 1 ? '' : 's'}`
            : 'No upcoming deadline alerts'
        }
      >
        <Bell className="w-4 h-4" />

        {/* Badge count */}
        {activeAlerts.length > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center text-white ${
              hasUrgent ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
            } shadow-xs`}
          >
            {activeAlerts.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#142420] border border-stone-200/90 dark:border-emerald-950/80 shadow-xl z-50 overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-stone-100 dark:border-emerald-950 flex items-center justify-between bg-stone-50/70 dark:bg-[#101D1A]">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  hasUrgent
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">
                  Deadline Alerts
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Closing within 7 days
                </span>
              </div>
            </div>

            {activeAlerts.length > 0 && (
              <button
                onClick={handleDismissAll}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
                title="Dismiss all alerts"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Alert List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-emerald-950/60">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div className="font-bold text-stone-800 dark:text-stone-200">
                  All Deadlines on Schedule
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                  No scholarships are closing within the next 7 days. You will be alerted automatically when a deadline approaches.
                </p>
              </div>
            ) : (
              activeAlerts.map(({ scholarship, alert }) => (
                <div
                  key={scholarship.id}
                  onClick={() => handleItemClick(scholarship.slug)}
                  className={`p-3.5 hover:bg-stone-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group flex items-start justify-between gap-3 ${
                    alert.urgency === 'closing_today'
                      ? 'bg-rose-50/40 dark:bg-rose-950/20'
                      : alert.urgency === 'urgent'
                      ? 'bg-rose-50/20 dark:bg-rose-950/10'
                      : ''
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          alert.urgency === 'closing_today'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : alert.urgency === 'urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {alert.urgency === 'closing_today'
                          ? 'Deadline Today!'
                          : alert.urgency === 'urgent'
                          ? 'Apply Now — Closing Soon'
                          : 'Deadline Soon'}
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 font-mono">
                        {alert.daysRemaining === 0 ? 'Today' : `${alert.daysRemaining}d left`}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {scholarship.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[10.5px] text-stone-500 dark:text-stone-400 font-medium">
                      <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Closes {alert.formattedDate}</span>
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => handleDismiss(scholarship.id, scholarship.applicationDeadline, e)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-emerald-950 shrink-0 transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {activeAlerts.length > 0 && (
            <div className="p-2.5 bg-stone-50/80 dark:bg-[#101D1A] border-t border-stone-100 dark:border-emerald-950 text-center">
              <button
                onClick={() => {
                  onNavigate('explore');
                  setIsOpen(false);
                }}
                className="text-[11px] font-bold text-[#064E3B] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View all scholarships in directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
