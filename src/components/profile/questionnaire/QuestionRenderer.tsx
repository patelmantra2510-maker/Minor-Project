import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Check, HelpCircle, EyeOff, AlertCircle } from 'lucide-react';
import type { QuestionDefinition } from '../../../types/questionnaire';
import type { EligibilityFieldDefinition, ProfileValueStatus } from '../../../types/eligibility';

interface QuestionRendererProps {
  question: QuestionDefinition;
  fieldDef: EligibilityFieldDefinition;
  currentValue: any;
  currentStatus: ProfileValueStatus;
  customText?: string;
  onChange: (value: any, status: ProfileValueStatus, customText?: string) => void;
  validationError?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  fieldDef,
  currentValue,
  currentStatus,
  customText = '',
  onChange,
  validationError,
}) => {
  const { t } = useLanguage();
  const [localCustomText, setLocalCustomText] = useState(customText);

  const options = question.options || fieldDef.options || [];

  const handleSelectOption = (optVal: string) => {
    onChange(optVal, 'known');
  };

  const handleSelectOther = () => {
    onChange('other', 'custom', localCustomText);
  };

  const handleCustomTextChange = (text: string) => {
    setLocalCustomText(text);
    onChange('other', 'custom', text);
  };

  const handleSelectNotSure = () => {
    onChange(null, 'unknown');
  };

  const handleSelectPreferNotToSay = () => {
    onChange(null, 'prefer_not_to_say');
  };

  return (
    <div className="space-y-4">
      {/* 1. RADIO / SINGLE SELECT CARD OPTIONS */}
      {question.inputType === 'radio' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = currentStatus === 'known' && String(currentValue).toLowerCase() === opt.value.toLowerCase();

            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full min-h-[52px] p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
                  isSelected
                    ? 'bg-[#EAF3EE] dark:bg-[#163328] border-[#065F46] dark:border-emerald-500 shadow-xs'
                    : 'bg-stone-50/60 dark:bg-[#182E29]/60 border-[#E8E2D7] dark:border-[#23453E] hover:border-emerald-700/50 hover:bg-stone-100/80 dark:hover:bg-[#1C3630]'
                }`}
              >
                <div>
                  <div className={`text-xs sm:text-sm font-semibold leading-snug ${
                    isSelected ? 'text-[#064E3B] dark:text-emerald-300' : 'text-stone-800 dark:text-stone-200'
                  }`}>
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 leading-normal">
                      {opt.description}
                    </div>
                  )}
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'border-[#065F46] bg-[#065F46] text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-stone-900'
                    : 'border-stone-300 dark:border-stone-600'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          {/* Option: Other */}
          {question.allowOther && (
            <button
              type="button"
              onClick={handleSelectOther}
              className={`w-full min-h-[52px] p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
                currentStatus === 'custom'
                  ? 'bg-[#EAF3EE] dark:bg-[#163328] border-[#065F46] dark:border-emerald-500 shadow-xs'
                  : 'bg-stone-50/60 dark:bg-[#182E29]/60 border-[#E8E2D7] dark:border-[#23453E] hover:border-emerald-700/50 hover:bg-stone-100/80 dark:hover:bg-[#1C3630]'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                {t('profile.questionnaire.otherOption', undefined, 'Other')}
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                currentStatus === 'custom'
                  ? 'border-[#065F46] bg-[#065F46] text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-stone-900'
                  : 'border-stone-300 dark:border-stone-600'
              }`}>
                {currentStatus === 'custom' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          )}
        </div>
      )}

      {/* 2. BOOLEAN YES / NO CARDS */}
      {question.inputType === 'boolean' && (
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => onChange(true, 'known')}
            className={`min-h-[48px] p-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
              currentStatus === 'known' && (currentValue === true || currentValue === 'true')
                ? 'bg-[#EAF3EE] dark:bg-[#163328] border-[#065F46] dark:border-emerald-500 text-[#064E3B] dark:text-emerald-300 shadow-xs'
                : 'bg-stone-50/60 dark:bg-[#182E29]/60 border-[#E8E2D7] dark:border-[#23453E] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1C3630]'
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() => onChange(false, 'known')}
            className={`min-h-[48px] p-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
              currentStatus === 'known' && (currentValue === false || currentValue === 'false')
                ? 'bg-[#EAF3EE] dark:bg-[#163328] border-[#065F46] dark:border-emerald-500 text-[#064E3B] dark:text-emerald-300 shadow-xs'
                : 'bg-stone-50/60 dark:bg-[#182E29]/60 border-[#E8E2D7] dark:border-[#23453E] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1C3630]'
            }`}
          >
            No
          </button>
        </div>
      )}

      {/* 3. SELECT DROPDOWN */}
      {question.inputType === 'select' && (
        <div className="space-y-3">
          <select
            value={currentStatus === 'custom' ? 'other' : (currentValue ?? '')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'other') {
                handleSelectOther();
              } else if (val) {
                handleSelectOption(val);
              } else {
                onChange(null, 'unknown');
              }
            }}
            className="w-full px-4 py-3 rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/80 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          >
            <option value="">{t('profile.questionnaire.selectAnOption', undefined, 'Select an option...')}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {question.allowOther && (
              <option value="other">{t('profile.questionnaire.otherOption', undefined, 'Other')}</option>
            )}
          </select>
        </div>
      )}

      {/* 4. CURRENCY INPUT (₹) */}
      {question.inputType === 'currency' && (
        <div className="space-y-2">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 font-bold text-base">
              ₹
            </span>
            <input
              type="number"
              value={currentStatus === 'known' ? (currentValue ?? '') : ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                onChange(val, 'known');
              }}
              placeholder={question.placeholder || 'e.g. 250000'}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/80 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#065F46]"
            />
          </div>

          {/* Quick preset chips for Indian family income */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-stone-400 dark:text-stone-500 mr-1">Presets:</span>
            {[
              { label: '₹1.5 Lakh', val: 150000 },
              { label: '₹2.5 Lakh', val: 250000 },
              { label: '₹4.5 Lakh', val: 450000 },
              { label: '₹6.0 Lakh', val: 600000 },
              { label: '₹8.0 Lakh', val: 800000 },
            ].map((preset) => (
              <button
                type="button"
                key={preset.val}
                onClick={() => onChange(preset.val, 'known')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-[#1C3630] hover:bg-[#EAF3EE] dark:hover:bg-[#203D34] text-stone-600 dark:text-stone-300 hover:text-[#065F46] dark:hover:text-emerald-300 border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. NUMBER INPUT */}
      {question.inputType === 'number' && (
        <div className="max-w-xs space-y-1">
          <input
            type="number"
            step="any"
            value={currentStatus === 'known' ? (currentValue ?? '') : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              onChange(val, 'known');
            }}
            placeholder={question.placeholder || 'e.g. 75.5'}
            className="w-full px-4 py-3 rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/80 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          />
          {fieldDef.validation && (
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              Valid range: {fieldDef.validation.min ?? 0} to {fieldDef.validation.max ?? 100}
            </p>
          )}
        </div>
      )}

      {/* 6. TEXT / DATE / OTHER GENERAL INPUTS */}
      {question.inputType === 'text' && (
        <div className="max-w-md">
          <input
            type="text"
            value={currentStatus === 'known' ? (currentValue ?? '') : ''}
            onChange={(e) => onChange(e.target.value, 'known')}
            placeholder={question.placeholder || 'Enter your details...'}
            className="w-full px-4 py-3 rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/80 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          />
        </div>
      )}

      {question.inputType === 'date' && (
        <div className="max-w-xs">
          <input
            type="date"
            value={currentStatus === 'known' ? (currentValue ?? '') : ''}
            onChange={(e) => onChange(e.target.value, 'known')}
            className="w-full px-4 py-3 rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/80 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          />
        </div>
      )}

      {/* OTHER / CUSTOM TEXT INPUT (When Other is active) */}
      {currentStatus === 'custom' && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-[#2A2315]/50 border border-amber-200/80 dark:border-amber-800/60 animate-in fade-in space-y-1.5">
          <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
            {t('profile.questionnaire.pleaseSpecify', undefined, 'Please specify your option')}
          </label>
          <input
            type="text"
            value={localCustomText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#182E29] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* UNCERTAINTY CONTROLS: "Not sure" & "Prefer not to say" */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
        {question.allowUnknown && (
          <button
            type="button"
            onClick={handleSelectNotSure}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
              currentStatus === 'unknown'
                ? 'bg-amber-100/80 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-semibold shadow-xs'
                : 'bg-stone-50 dark:bg-[#182E29]/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-[#23453E] hover:bg-stone-100 dark:hover:bg-[#1C3630]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{t('profile.questionnaire.notSure', undefined, 'Not sure')}</span>
          </button>
        )}

        {question.allowPreferNotToSay && (
          <button
            type="button"
            onClick={handleSelectPreferNotToSay}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] ${
              currentStatus === 'prefer_not_to_say'
                ? 'bg-stone-200/80 text-stone-900 dark:bg-stone-800 dark:text-white border-stone-400 dark:border-stone-600 font-semibold shadow-xs'
                : 'bg-stone-50 dark:bg-[#182E29]/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-[#23453E] hover:bg-stone-100 dark:hover:bg-[#1C3630]'
            }`}
          >
            <EyeOff className="w-4 h-4 text-stone-500" />
            <span>{t('profile.questionnaire.preferNotToSay', undefined, 'Prefer not to say')}</span>
          </button>
        )}
      </div>

      {/* Validation Error Feedback */}
      {validationError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-800 dark:text-rose-200 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
