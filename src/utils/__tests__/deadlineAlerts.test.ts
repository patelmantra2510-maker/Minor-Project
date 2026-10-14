import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateDeadlineAlert,
  getApproachingDeadlines,
  isNotificationDismissed,
  dismissNotification,
  clearDismissedNotifications,
} from '../deadlineAlerts';
import type { Scholarship } from '../../types/scholarship';

describe('calculateDeadlineAlert', () => {
  const baseNow = new Date('2026-10-10T12:00:00Z');

  it('handles 10 days away (Open, >7 days)', () => {
    const alert = calculateDeadlineAlert('2026-10-20', null, undefined, baseNow);
    expect(alert.urgency).toBe('open');
    expect(alert.daysRemaining).toBe(10);
    expect(alert.effectiveStatus).toBe('Open');
    expect(alert.badgeText).toBe('OPEN');
    expect(alert.isUrgent).toBe(false);
    expect(alert.isWarning).toBe(false);
    expect(alert.isExpired).toBe(false);
    expect(alert.isUnverified).toBe(false);
  });

  it('handles 7 days away ("Deadline Soon", 4-7 days)', () => {
    const alert = calculateDeadlineAlert('2026-10-17', null, undefined, baseNow);
    expect(alert.urgency).toBe('closing_soon');
    expect(alert.daysRemaining).toBe(7);
    expect(alert.effectiveStatus).toBe('Open');
    expect(alert.badgeText).toBe('Deadline Soon');
    expect(alert.isUrgent).toBe(false);
    expect(alert.isWarning).toBe(true);
    expect(alert.isExpired).toBe(false);
  });

  it('handles 4 days away ("Deadline Soon", 4-7 days)', () => {
    const alert = calculateDeadlineAlert('2026-10-14', null, undefined, baseNow);
    expect(alert.urgency).toBe('closing_soon');
    expect(alert.daysRemaining).toBe(4);
    expect(alert.badgeText).toBe('Deadline Soon');
    expect(alert.isUrgent).toBe(false);
    expect(alert.isWarning).toBe(true);
  });

  it('handles 3 days away ("Apply Now — Closing Soon", 1-3 days)', () => {
    const alert = calculateDeadlineAlert('2026-10-13', null, undefined, baseNow);
    expect(alert.urgency).toBe('urgent');
    expect(alert.daysRemaining).toBe(3);
    expect(alert.effectiveStatus).toBe('Open');
    expect(alert.badgeText).toBe('Apply Now — Closing Soon');
    expect(alert.isUrgent).toBe(true);
    expect(alert.isWarning).toBe(true);
    expect(alert.isExpired).toBe(false);
  });

  it('handles 1 day away ("Apply Now — Closing Soon", 1-3 days)', () => {
    const alert = calculateDeadlineAlert('2026-10-11', null, undefined, baseNow);
    expect(alert.urgency).toBe('urgent');
    expect(alert.daysRemaining).toBe(1);
    expect(alert.badgeText).toBe('Apply Now — Closing Soon');
    expect(alert.isUrgent).toBe(true);
    expect(alert.isWarning).toBe(true);
  });

  it('handles Closing Today (0 calendar days remaining)', () => {
    const alert = calculateDeadlineAlert('2026-10-10', null, undefined, baseNow);
    expect(alert.urgency).toBe('closing_today');
    expect(alert.daysRemaining).toBe(0);
    expect(alert.effectiveStatus).toBe('Open');
    expect(alert.badgeText).toBe('Deadline Today!');
    expect(alert.isUrgent).toBe(true);
    expect(alert.isWarning).toBe(true);
    expect(alert.isExpired).toBe(false);
  });

  it('handles Expired (< 0 calendar days remaining)', () => {
    const alert = calculateDeadlineAlert('2026-10-09', null, undefined, baseNow);
    expect(alert.urgency).toBe('expired');
    expect(alert.daysRemaining).toBeLessThanOrEqual(0);
    expect(alert.effectiveStatus).toBe('Closed');
    expect(alert.badgeText).toBe('Deadline Passed');
    expect(alert.isExpired).toBe(true);
    expect(alert.isUrgent).toBe(false);
    expect(alert.isWarning).toBe(false);
  });

  it('handles overrideStatus === "Closed" even if future date', () => {
    const alert = calculateDeadlineAlert('2026-11-01', null, 'Closed', baseNow);
    expect(alert.urgency).toBe('expired');
    expect(alert.effectiveStatus).toBe('Closed');
    expect(alert.badgeText).toBe('Deadline Passed');
    expect(alert.isExpired).toBe(true);
  });

  it('handles Missing / Unverified deadlines without guessing', () => {
    const missing = calculateDeadlineAlert(undefined, null, undefined, baseNow);
    expect(missing.urgency).toBe('unverified');
    expect(missing.daysRemaining).toBeNull();
    expect(missing.badgeText).toBe('Deadline not verified');
    expect(missing.isUnverified).toBe(true);

    const empty = calculateDeadlineAlert('', null, undefined, baseNow);
    expect(empty.urgency).toBe('unverified');
    expect(empty.daysRemaining).toBeNull();

    const invalid = calculateDeadlineAlert('not-a-valid-date', null, undefined, baseNow);
    expect(invalid.urgency).toBe('unverified');
    expect(invalid.daysRemaining).toBeNull();
    expect(invalid.badgeText).toBe('Deadline not verified');
  });

  it('handles future start date ("opening_soon")', () => {
    const alert = calculateDeadlineAlert('2026-11-30', '2026-10-15', undefined, baseNow);
    expect(alert.urgency).toBe('opening_soon');
    expect(alert.effectiveStatus).toBe('Opening Soon');
    expect(alert.badgeText).toBe('Opening Soon');
    expect(alert.daysRemaining).toBe(5);
  });
});

describe('in-app deadline notifications & deduplication', () => {
  const baseNow = new Date('2026-10-10T12:00:00Z');

  const mockScholarships: Scholarship[] = [
    {
      id: 'sch-today',
      name: 'Today Scholarship',
      slug: 'today-scholarship',
      provider: 'Gov',
      state: 'Gujarat',
      status: 'Open',
      applicationDeadline: '2026-10-10',
      educationLevel: ['Undergraduate'],
      category: ['Open'],
      gender: 'All',
      benefits: { amountDescription: 'Rs 10,000' },
      eligibilitySummary: 'All students',
    } as any,
    {
      id: 'sch-urgent',
      name: 'Urgent Scholarship',
      slug: 'urgent-scholarship',
      provider: 'Gov',
      state: 'Gujarat',
      status: 'Open',
      applicationDeadline: '2026-10-12', // 2 days away
      educationLevel: ['Undergraduate'],
      category: ['Open'],
      gender: 'All',
      benefits: { amountDescription: 'Rs 15,000' },
      eligibilitySummary: 'All students',
    } as any,
    {
      id: 'sch-soon',
      name: 'Soon Scholarship',
      slug: 'soon-scholarship',
      provider: 'Gov',
      state: 'Gujarat',
      status: 'Open',
      applicationDeadline: '2026-10-16', // 6 days away
      educationLevel: ['Undergraduate'],
      category: ['Open'],
      gender: 'All',
      benefits: { amountDescription: 'Rs 20,000' },
      eligibilitySummary: 'All students',
    } as any,
    {
      id: 'sch-far',
      name: 'Far Scholarship',
      slug: 'far-scholarship',
      provider: 'Gov',
      state: 'Gujarat',
      status: 'Open',
      applicationDeadline: '2026-10-30', // 20 days away
      educationLevel: ['Undergraduate'],
      category: ['Open'],
      gender: 'All',
      benefits: { amountDescription: 'Rs 5,000' },
      eligibilitySummary: 'All students',
    } as any,
    {
      id: 'sch-expired',
      name: 'Expired Scholarship',
      slug: 'expired-scholarship',
      provider: 'Gov',
      state: 'Gujarat',
      status: 'Closed',
      applicationDeadline: '2026-10-05',
      educationLevel: ['Undergraduate'],
      category: ['Open'],
      gender: 'All',
      benefits: { amountDescription: 'Rs 5,000' },
      eligibilitySummary: 'All students',
    } as any,
  ];

  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = v;
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
        clear: () => {
          mockStorage = {};
        },
      },
    };
    (globalThis as any).localStorage = (globalThis as any).window.localStorage;
    clearDismissedNotifications();
  });

  it('filters only approaching deadlines (<= 7 days) and sorts by days remaining', () => {
    const approaching = getApproachingDeadlines(mockScholarships, 7, baseNow, true);
    expect(approaching.length).toBe(3);
    expect(approaching[0].scholarship.id).toBe('sch-today'); // 0 days
    expect(approaching[1].scholarship.id).toBe('sch-urgent'); // 2 days
    expect(approaching[2].scholarship.id).toBe('sch-soon'); // 6 days
  });

  it('dismisses notifications persistently in localStorage and avoids duplicate alerts', () => {
    expect(isNotificationDismissed('sch-urgent', '2026-10-12')).toBe(false);

    dismissNotification('sch-urgent', '2026-10-12');
    expect(isNotificationDismissed('sch-urgent', '2026-10-12')).toBe(true);

    const approachingAfterDismiss = getApproachingDeadlines(mockScholarships, 7, baseNow, false);
    expect(approachingAfterDismiss.map((a) => a.scholarship.id)).not.toContain('sch-urgent');
    expect(approachingAfterDismiss.length).toBe(2);
  });

  it('reactivates notification if deadline is updated/extended', () => {
    dismissNotification('sch-urgent', '2026-10-12');
    expect(isNotificationDismissed('sch-urgent', '2026-10-12')).toBe(true);

    // If deadline is extended to 2026-10-15, it should not be considered dismissed
    expect(isNotificationDismissed('sch-urgent', '2026-10-15')).toBe(false);
  });

  it('clearDismissedNotifications restores all notifications', () => {
    dismissNotification('sch-today', '2026-10-10');
    dismissNotification('sch-urgent', '2026-10-12');
    expect(isNotificationDismissed('sch-today', '2026-10-10')).toBe(true);

    clearDismissedNotifications();
    expect(isNotificationDismissed('sch-today', '2026-10-10')).toBe(false);
    expect(isNotificationDismissed('sch-urgent', '2026-10-12')).toBe(false);
  });
});
