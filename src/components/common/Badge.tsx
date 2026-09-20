import React from 'react';
import type { MatchStatus } from '../../types/scholarship';
import { calculateDeadlineStatus } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface MatchBadgeProps {
  status: MatchStatus | 'eligible' | 'possible' | 'not_eligible';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const { t } = useLanguage();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  if (status === 'strong_match' || status === 'eligible') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-100 text-[#065F46] dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}
      >
        <CheckCircle2 className={size === 'lg' ? 'w-5 h-5 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
        <span>{t('profile.matching.eligible', undefined, 'Eligible')}</span>
      </span>
    );
  }

  if (status === 'possible_match' || status === 'possible') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}
      >
        <AlertTriangle className={size === 'lg' ? 'w-5 h-5 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        <span>{t('profile.matching.possibleMatch', undefined, 'Possible Match')}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border border-stone-300 dark:border-stone-700 ${sizeClasses} ${className}`}
    >
      <XCircle className={size === 'lg' ? 'w-5 h-5 text-stone-500' : 'w-3.5 h-3.5 text-stone-500'} />
      <span>{t('profile.matching.notEligible', undefined, 'Not Eligible')}</span>
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
  const { t } = useLanguage();
  const info = calculateDeadlineStatus(deadline, startDate, overrideStatus);

  const statusLabel =
    info.status === 'Open'
      ? t('common.open', undefined, 'OPEN')
      : info.status === 'Opening Soon'
      ? t('common.openingSoon', undefined, 'SOON')
      : t('common.closed', undefined, 'CLOSED');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${info.badgeColorClass} ${className}`}
    >
      {info.status === 'Open' && (
        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
      )}
      {info.status === 'Opening Soon' && <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />}
      {info.status === 'Closed' && <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />}
      <span>{statusLabel}</span>
      {info.status === 'Open' && info.daysRemaining > 0 && (
        <span className="font-normal opacity-80 normal-case">
          ({info.daysRemaining}{t('common.dLeft', undefined, 'd left')})
        </span>
      )}
    </span>
  );
};

