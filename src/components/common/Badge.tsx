import React from 'react';
import type { MatchStatus } from '../../types/scholarship';
import { calculateDeadlineStatus } from '../../utils/dateUtils';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface MatchBadgeProps {
  status: MatchStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  if (status === 'strong_match') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}
      >
        <CheckCircle2 className={size === 'lg' ? 'w-5 h-5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        <span>Strong Match</span>
      </span>
    );
  }

  if (status === 'possible_match') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}
      >
        <AlertTriangle className={size === 'lg' ? 'w-5 h-5 text-amber-600' : 'w-4 h-4 text-amber-600'} />
        <span>Possible Match</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}
    >
      <XCircle className={size === 'lg' ? 'w-5 h-5 text-rose-600' : 'w-4 h-4 text-rose-600'} />
      <span>Not Eligible</span>
    </span>
  );
};

interface StatusBadgeProps {
  deadline: string;
  startDate?: string;
  overrideStatus?: 'Open' | 'Opening Soon' | 'Closed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  deadline,
  startDate,
  overrideStatus,
  className = '',
}) => {
  const info = calculateDeadlineStatus(deadline, startDate, overrideStatus);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${info.badgeColorClass} ${className}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{info.displayText}</span>
    </span>
  );
};
