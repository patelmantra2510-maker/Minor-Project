import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';

interface AIFloatingButtonProps {
  currentRoute?: string;
}

export const AIFloatingButton: React.FC<AIFloatingButtonProps> = ({ currentRoute }) => {
  const { isOpen, openGlobalAI } = useAI();
  const { compareIds } = useCompare();
  const { t, language } = useLanguage();

  const isAIPage =
    currentRoute === 'ai' ||
    (typeof window !== 'undefined' && window.location.hash.replace(/^#\/?/, '').startsWith('ai'));

  // If chat panel is currently open or user is already on the dedicated AI page, hide button
  if (isOpen || isAIPage) return null;

  // Stacking offset if compare bar is active
  const hasCompareBar = compareIds.length > 0;

  return (
    <div
      className={`fixed right-6 sm:right-8 z-40 transition-all duration-300 ease-out ${
        hasCompareBar ? 'bottom-24 sm:bottom-28' : 'bottom-6 sm:bottom-7'
      }`}
    >
      <button
        onClick={openGlobalAI}
        aria-label="Ask Edvora"
        type="button"
        className="group relative flex items-center h-[52px] sm:h-[58px] pl-2 sm:pl-2.5 pr-4 sm:pr-4.5 rounded-full bg-[#064E3B] hover:bg-[#075944] dark:bg-[#074737] dark:hover:bg-[#085240] text-white shadow-[0_8px_24px_-4px_rgba(6,78,59,0.35),0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-4px_rgba(6,78,59,0.45),0_6px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.75)] border border-emerald-600/50 dark:border-emerald-500/30 hover:border-amber-400/40 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0C1513]"
      >
        {/* 1. Warm-White / Cream Logo Container with Tiny Gold Sparkle AI Indicator */}
        <div className="relative shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] shadow-xs transition-transform duration-200 ease-out group-hover:scale-[1.03]">
          <img
            src="/edvora-emblem.png"
            alt="Edvora"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain select-none pointer-events-none"
            loading="eager"
          />
          {/* Subtle AI Indicator Badge */}
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-300 text-[#064E3B] flex items-center justify-center shadow-2xs ring-1.5 ring-[#064E3B] dark:ring-[#074737]"
            aria-hidden="true"
          >
            <Sparkles className="w-2 h-2 fill-[#064E3B] text-[#064E3B]" />
          </span>
        </div>

        {/* 2. Text Label: "Ask Edvora" */}
        <div className="ml-2.5 sm:ml-3 flex items-center">
          {language === 'en' ? (
            <span className="font-editorial text-sm sm:text-[15px] tracking-wide text-white leading-none select-none flex items-baseline gap-1">
              <span className="font-semibold text-emerald-100/90">Ask</span>
              <span className="font-bold text-white">Edvora</span>
            </span>
          ) : (
            <span className="font-editorial text-xs sm:text-sm font-bold tracking-wide text-white leading-none select-none">
              {t('ai.floatingBtn', undefined, 'Ask Edvora')}
            </span>
          )}
        </div>

        {/* 3. Subtle Gold Status Dot */}
        <div className="ml-3 sm:ml-3.5 flex items-center shrink-0" aria-hidden="true">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          </span>
        </div>
      </button>
    </div>
  );
};
