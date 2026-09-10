import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface EdvoraLogoProps {
  variant?: 'navbar' | 'mobile' | 'full' | 'emblem-only';
  className?: string;
  showTagline?: boolean;
}

export const EdvoraLogo: React.FC<EdvoraLogoProps> = ({
  variant = 'navbar',
  className = '',
  showTagline = true,
}) => {
  const { t } = useLanguage();
  // Pure transparent official emblem extracted from reference artwork
  const Emblem = ({ height = 42 }: { height?: number }) => (
    <img
      src="/edvora-emblem.png"
      alt="Edvora Emblem"
      className="w-auto shrink-0 object-contain select-none filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
      style={{ height }}
      loading="eager"
    />
  );

  if (variant === 'emblem-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Emblem height={36} />
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <Emblem height={34} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-xl font-black tracking-tight text-[#064E3B] dark:text-emerald-400 font-editorial">
              Edvora
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
          </div>
          <span className="text-[9px] font-semibold text-amber-800 dark:text-amber-400 tracking-wider uppercase mt-0.5">
            Scholarships
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-start gap-2.5 ${className}`}>
        <div className="flex items-center gap-3">
          <Emblem height={48} />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-2xl sm:text-3xl font-black text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
                Edvora
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0 mb-1" />
            </div>
            <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 tracking-widest uppercase mt-1">
              LEARN · EXPLORE · GROW
            </p>
          </div>
        </div>
        {showTagline && (
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium max-w-sm leading-relaxed">
            {t('tagline')}. {t('supportingLine')}
          </p>
        )}
      </div>
    );
  }

  // Default 'navbar' variant: Emblem approximately the same visual height as the wordmark
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <Emblem height={40} />
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-2xl font-black tracking-tight text-[#064E3B] dark:text-emerald-400 font-editorial group-hover:text-[#043E2F] dark:group-hover:text-emerald-300 transition-colors">
            Edvora
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
        </div>
        {showTagline && (
          <span className="text-[9.5px] text-stone-500 dark:text-stone-400 font-medium tracking-wide hidden sm:block mt-0.5">
            {t('tagline')}
          </span>
        )}
      </div>
    </div>
  );
};
