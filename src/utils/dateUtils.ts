import { calculateDeadlineAlert, type DeadlineUrgency } from './deadlineAlerts';

export interface DeadlineStatusInfo {
  status: 'Open' | 'Opening Soon' | 'Closed' | 'Unverified';
  daysRemaining: number;
  displayText: string;
  badgeColorClass: string;
  urgency?: DeadlineUrgency;
  badgeText?: string;
  formattedDate?: string;
  isUrgent?: boolean;
  isWarning?: boolean;
  isExpired?: boolean;
  isUnverified?: boolean;
}

export function calculateDeadlineStatus(
  deadlineStr?: string | null,
  startDateStr?: string | null,
  overrideStatus?: 'Open' | 'Opening Soon' | 'Closed' | string,
  nowDate?: Date
): DeadlineStatusInfo {
  const alert = calculateDeadlineAlert(deadlineStr, startDateStr, overrideStatus, nowDate);

  return {
    status: alert.effectiveStatus,
    daysRemaining: alert.daysRemaining ?? 0,
    displayText: alert.alertHeadline || alert.badgeText,
    badgeColorClass: alert.badgeColorClass,
    urgency: alert.urgency,
    badgeText: alert.badgeText,
    formattedDate: alert.formattedDate,
    isUrgent: alert.isUrgent,
    isWarning: alert.isWarning,
    isExpired: alert.isExpired,
    isUnverified: alert.isUnverified,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getDaysUntilDeadline(deadlineStr?: string): number | null {
  if (!deadlineStr) return null;
  try {
    const now = new Date();
    const deadline = new Date(deadlineStr);
    deadline.setHours(23, 59, 59, 999);
    const diffMs = deadline.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

