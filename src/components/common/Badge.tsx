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
  deadline?: string | null;
  startDate?: string | null;
  overrideStatus?: 'Open' | 'Opening Soon' | 'Closed' | string;
  className?: string;
  nowDate?: Date;
  showDaysRemaining?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  deadline,
  startDate,
  overrideStatus,
  className = '',
  nowDate,
  showDaysRemaining = true,
}) => {
  const { t } = useLanguage();
  const info = calculateDeadlineStatus(deadline, startDate, overrideStatus, nowDate);

  // 1. Closing Today (0 days remaining)
  if (info.urgency === 'closing_today') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide border bg-rose-600 text-white border-rose-700 dark:bg-rose-600 dark:text-white shadow-xs animate-pulse ${className}`}
        title={info.displayText}
      >
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-white" />
        <span>{t('deadline.closingToday', undefined, 'Deadline Today!')}</span>
      </span>
    );
  }

  // 2. Urgent (1 to 3 days remaining)
  if (info.urgency === 'urgent') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800 ${className}`}
        title={info.displayText}
      >
        <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0 animate-ping" />
        <span>{t('deadline.urgentClosingSoon', undefined, 'Apply Now — Closing Soon')}</span>
        {showDaysRemaining && info.daysRemaining > 0 && (
          <span className="font-semibold text-rose-700 dark:text-rose-300 normal-case">
            ({info.daysRemaining}{t('common.dLeft', undefined, 'd left')})
          </span>
        )}
      </span>
    );
  }

  // 3. Closing Soon (4 to 7 days remaining)
  if (info.urgency === 'closing_soon') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800 ${className}`}
        title={info.displayText}
      >
        <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>{t('deadline.deadlineSoon', undefined, 'Deadline Soon')}</span>
        {showDaysRemaining && info.daysRemaining > 0 && (
          <span className="font-semibold text-amber-800 dark:text-amber-300 normal-case">
            ({info.daysRemaining}{t('common.dLeft', undefined, 'd left')})
          </span>
        )}
      </span>
    );
  }

  // 4. Expired / Past Deadline
  if (info.urgency === 'expired' || info.status === 'Closed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-stone-100 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border-stone-300 dark:border-stone-700 ${className}`}
        title={info.displayText}
      >
        <XCircle className="w-3.5 h-3.5 shrink-0 text-stone-500 dark:text-stone-400" />
        <span>{t('deadline.deadlinePassed', undefined, 'Deadline Passed')}</span>
      </span>
    );
  }

  // 5. Unverified / Missing Deadline
  if (info.urgency === 'unverified' || info.status === 'Unverified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 text-stone-600 dark:bg-stone-900/60 dark:text-stone-400 ${className}`}
        title="Official deadline could not be verified from government source"
      >
        <Clock className="w-3 h-3 text-stone-400" />
        <span>{t('deadline.notVerified', undefined, 'Deadline not verified')}</span>
      </span>
    );
  }

  // 6. Opening Soon
  if (info.status === 'Opening Soon') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>{t('common.openingSoon', undefined, 'OPENING SOON')}</span>
        {showDaysRemaining && info.daysRemaining > 0 && (
          <span className="font-normal opacity-85 normal-case">
            ({info.daysRemaining}{t('common.dLeft', undefined, 'd')})
          </span>
        )}
      </span>
    );
  }

  // 7. Open (> 7 days)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
      <span>{t('common.open', undefined, 'OPEN')}</span>
      {showDaysRemaining && info.daysRemaining > 0 && (
        <span className="font-normal opacity-85 normal-case">
          ({info.daysRemaining}{t('common.dLeft', undefined, 'd left')})
        </span>
      )}
    </span>
  );
};

