export interface DeadlineStatusInfo {
  status: 'Open' | 'Opening Soon' | 'Closed';
  daysRemaining: number;
  displayText: string;
  badgeColorClass: string;
}

export function calculateDeadlineStatus(
  deadlineStr: string,
  startDateStr?: string,
  overrideStatus?: 'Open' | 'Opening Soon' | 'Closed'
): DeadlineStatusInfo {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  deadline.setHours(23, 59, 59, 999);

  const diffMs = deadline.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // If start date is in the future
  if (startDateStr) {
    const start = new Date(startDateStr);
    if (start.getTime() > now.getTime()) {
      const daysUntilOpen = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'Opening Soon',
        daysRemaining: daysUntilOpen,
        displayText: `Opens in ${daysUntilOpen} ${daysUntilOpen === 1 ? 'day' : 'days'}`,
        badgeColorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      };
    }
  }

  if (overrideStatus === 'Closed' || daysRemaining < 0) {
    return {
      status: 'Closed',
      daysRemaining: 0,
      displayText: 'Application Closed',
      badgeColorClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  }

  if (overrideStatus === 'Opening Soon') {
    return {
      status: 'Opening Soon',
      daysRemaining: Math.max(daysRemaining, 0),
      displayText: 'Opening Soon',
      badgeColorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    };
  }

  if (daysRemaining === 0) {
    return {
      status: 'Open',
      daysRemaining: 0,
      displayText: 'Closes Today',
      badgeColorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    };
  }

  return {
    status: 'Open',
    daysRemaining,
    displayText: `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`,
    badgeColorClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
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

