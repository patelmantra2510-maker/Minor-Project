/**
 * Automated Scholarship Deadline Alert Engine
 * 
 * Computes deterministic urgency tiers, human-readable countdowns, 
 * badge styling, and in-app notification filtering based on verified database deadlines.
 */

import type { Scholarship } from '../types/scholarship';
import { formatDate } from './dateUtils';

export type DeadlineUrgency =
  | 'closing_today' // 0 days remaining (same calendar day)
  | 'urgent'        // 1 to 3 days remaining
  | 'closing_soon'  // 4 to 7 days remaining
  | 'open'          // > 7 days remaining
  | 'expired'       // < 0 days (past deadline)
  | 'opening_soon'  // Start date in the future
  | 'unverified';   // Missing, invalid, or conflicting deadline

export interface DeadlineAlertInfo {
  urgency: DeadlineUrgency;
  effectiveStatus: 'Open' | 'Opening Soon' | 'Closed' | 'Unverified';
  daysRemaining: number | null;
  formattedDate: string; // e.g. "17 Oct 2026" or "Deadline not verified"
  badgeText: string;     // e.g. "Deadline Today!", "Apply Now — Closing Soon", "Deadline Soon", "Deadline Passed"
  badgeColorClass: string;
  isUrgent: boolean;     // <= 3 days (including today)
  isWarning: boolean;    // <= 7 days
  isExpired: boolean;
  isUnverified: boolean;
  alertHeadline?: string;
}

/**
 * Calculates deadline alert telemetry using the application's current or mock date.
 * 
 * @param deadlineStr ISO deadline date string (YYYY-MM-DD)
 * @param startDateStr Optional ISO application start date string
 * @param overrideStatus Optional status from database
 * @param now Current Date reference (defaults to new Date())
 */
export function calculateDeadlineAlert(
  deadlineStr?: string | null,
  startDateStr?: string | null,
  overrideStatus?: string,
  now: Date = new Date()
): DeadlineAlertInfo {
  // 1. Missing or unverified deadline check
  if (!deadlineStr || deadlineStr.trim() === '' || deadlineStr.toLowerCase() === 'unverified') {
    return {
      urgency: 'unverified',
      effectiveStatus: 'Unverified',
      daysRemaining: null,
      formattedDate: 'Deadline not verified',
      badgeText: 'Deadline not verified',
      badgeColorClass:
        'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 border-dashed border-stone-300 dark:border-stone-700',
      isUrgent: false,
      isWarning: false,
      isExpired: false,
      isUnverified: true,
      alertHeadline: 'Deadline not verified — Please consult the official portal',
    };
  }

  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) {
    return {
      urgency: 'unverified',
      effectiveStatus: 'Unverified',
      daysRemaining: null,
      formattedDate: 'Deadline not verified',
      badgeText: 'Deadline not verified',
      badgeColorClass:
        'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 border-dashed border-stone-300 dark:border-stone-700',
      isUrgent: false,
      isWarning: false,
      isExpired: false,
      isUnverified: true,
      alertHeadline: 'Deadline not verified — Please consult the official portal',
    };
  }

  // Set boundary to end of deadline day (23:59:59.999 local)
  const deadlineEndOfDay = new Date(deadline);
  deadlineEndOfDay.setHours(23, 59, 59, 999);

  // Normalise today's date boundary
  const nowDate = new Date(now);

  // Compute days difference using calendar midnight difference
  const deadlineMidnight = new Date(deadline);
  deadlineMidnight.setHours(0, 0, 0, 0);

  const nowMidnight = new Date(nowDate);
  nowMidnight.setHours(0, 0, 0, 0);

  const diffTime = deadlineMidnight.getTime() - nowMidnight.getTime();
  const calendarDaysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = formatDate(deadlineStr);

  // 2. Future Start Date (Opening Soon)
  if (startDateStr) {
    const startDate = new Date(startDateStr);
    if (!isNaN(startDate.getTime())) {
      const startMidnight = new Date(startDate);
      startMidnight.setHours(0, 0, 0, 0);
      if (startMidnight.getTime() > nowMidnight.getTime()) {
        const daysUntilOpen = Math.round((startMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));
        return {
          urgency: 'opening_soon',
          effectiveStatus: 'Opening Soon',
          daysRemaining: daysUntilOpen,
          formattedDate,
          badgeText: 'Opening Soon',
          badgeColorClass:
            'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
          isUrgent: false,
          isWarning: false,
          isExpired: false,
          isUnverified: false,
          alertHeadline: `Applications open in ${daysUntilOpen} ${daysUntilOpen === 1 ? 'day' : 'days'}`,
        };
      }
    }
  }

  // 3. Expired / Past Deadline (diff < 0) or explicitly Closed in DB
  if (calendarDaysRemaining < 0 || overrideStatus === 'Closed') {
    return {
      urgency: 'expired',
      effectiveStatus: 'Closed',
      daysRemaining: Math.min(calendarDaysRemaining, 0),
      formattedDate,
      badgeText: 'Deadline Passed',
      badgeColorClass:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900',
      isUrgent: false,
      isWarning: false,
      isExpired: true,
      isUnverified: false,
      alertHeadline: 'Application Window Concluded — Deadline Passed',
    };
  }

  // 4. Closing Today (diff === 0)
  if (calendarDaysRemaining === 0) {
    return {
      urgency: 'closing_today',
      effectiveStatus: 'Open',
      daysRemaining: 0,
      formattedDate,
      badgeText: 'Deadline Today!',
      badgeColorClass:
        'bg-rose-600 text-white dark:bg-rose-600 dark:text-white border border-rose-700 animate-pulse font-black shadow-xs',
      isUrgent: true,
      isWarning: true,
      isExpired: false,
      isUnverified: false,
      alertHeadline: 'Deadline Today! Applications close tonight at 11:59 PM',
    };
  }

  // 5. Urgent: Closing in 1 to 3 days
  if (calendarDaysRemaining >= 1 && calendarDaysRemaining <= 3) {
    return {
      urgency: 'urgent',
      effectiveStatus: 'Open',
      daysRemaining: calendarDaysRemaining,
      formattedDate,
      badgeText: 'Apply Now — Closing Soon',
      badgeColorClass:
        'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold',
      isUrgent: true,
      isWarning: true,
      isExpired: false,
      isUnverified: false,
      alertHeadline: `Urgent: Closing in ${calendarDaysRemaining} ${calendarDaysRemaining === 1 ? 'day' : 'days'} (${formattedDate})`,
    };
  }

  // 6. Closing Soon: Closing in 4 to 7 days
  if (calendarDaysRemaining >= 4 && calendarDaysRemaining <= 7) {
    return {
      urgency: 'closing_soon',
      effectiveStatus: 'Open',
      daysRemaining: calendarDaysRemaining,
      formattedDate,
      badgeText: 'Deadline Soon',
      badgeColorClass:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold',
      isUrgent: false,
      isWarning: true,
      isExpired: false,
      isUnverified: false,
      alertHeadline: `Deadline Soon: ${calendarDaysRemaining} days remaining (${formattedDate})`,
    };
  }

  // 7. Open (> 7 days)
  return {
    urgency: 'open',
    effectiveStatus: 'Open',
    daysRemaining: calendarDaysRemaining,
    formattedDate,
    badgeText: 'OPEN',
    badgeColorClass:
      'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    isUrgent: false,
    isWarning: false,
    isExpired: false,
    isUnverified: false,
    alertHeadline: `Open until ${formattedDate} (${calendarDaysRemaining} days left)`,
  };
}

// =========================================================================
// IN-APP NOTIFICATION TRACKING & DEDUPLICATION (LOCALSTORAGE)
// =========================================================================

const DISMISSED_NOTIFICATIONS_KEY = 'edvora_dismissed_deadline_alerts';

interface DismissedNotificationRecord {
  scholarshipId: string;
  deadline: string;
  dismissedAt: string;
}

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {}
  return null;
}

/**
 * Checks if a specific scholarship deadline notification has already been dismissed by the student.
 * If the deadline changes to a new date, it will alert again automatically.
 */
export function isNotificationDismissed(scholarshipId: string, deadlineStr?: string | null): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const raw = storage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    if (!raw) return false;
    const records: DismissedNotificationRecord[] = JSON.parse(raw);
    return records.some(
      (r) => r.scholarshipId === scholarshipId && (!deadlineStr || r.deadline === deadlineStr)
    );
  } catch {
    return false;
  }
}

/**
 * Dismisses a notification for a specific scholarship and deadline.
 */
export function dismissNotification(scholarshipId: string, deadlineStr: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    const records: DismissedNotificationRecord[] = raw ? JSON.parse(raw) : [];
    const updated = records.filter((r) => r.scholarshipId !== scholarshipId);
    updated.push({
      scholarshipId,
      deadline: deadlineStr,
      dismissedAt: new Date().toISOString(),
    });
    storage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to dismiss notification:', err);
  }
}

/**
 * Clears all dismissed notifications (useful for testing or profile reset).
 */
export function clearDismissedNotifications(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(DISMISSED_NOTIFICATIONS_KEY);
  } catch {}
}

/**
 * Filters scholarships that have approaching deadlines (<= maxDays, default 7 days)
 * and excludes already dismissed notifications.
 */
export function getApproachingDeadlines(
  scholarships: Scholarship[],
  maxDays: number = 7,
  now: Date = new Date(),
  includeDismissed: boolean = false
): Array<{ scholarship: Scholarship; alert: DeadlineAlertInfo }> {
  return scholarships
    .map((s) => ({
      scholarship: s,
      alert: calculateDeadlineAlert(s.applicationDeadline, s.applicationStart, s.status, now),
    }))
    .filter(({ scholarship, alert }) => {
      // Must be currently open and closing within maxDays (e.g. 0 to 7 days)
      if (alert.effectiveStatus !== 'Open' || alert.daysRemaining === null) {
        return false;
      }
      if (alert.daysRemaining < 0 || alert.daysRemaining > maxDays) {
        return false;
      }
      // If we don't want dismissed items, check localStorage
      if (!includeDismissed && isNotificationDismissed(scholarship.id, scholarship.applicationDeadline)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.alert.daysRemaining ?? 999) - (b.alert.daysRemaining ?? 999));
}
