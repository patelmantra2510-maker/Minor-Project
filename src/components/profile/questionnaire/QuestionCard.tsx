import React from 'react';
import type { QuestionDefinition } from '../../../types/questionnaire';
import type { EligibilityFieldDefinition, ProfileValueStatus } from '../../../types/eligibility';
import { QuestionRenderer } from './QuestionRenderer';
import { Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionDefinition;
  fieldDef: EligibilityFieldDefinition;
  currentValue: any;
  currentStatus: ProfileValueStatus;
  customText?: string;
  onChange: (value: any, status: ProfileValueStatus, customText?: string) => void;
  validationError?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  fieldDef,
  currentValue,
  currentStatus,
  customText,
  onChange,
  validationError,
  cardRef,
}) => {
  return (
    <div
      ref={cardRef}
      tabIndex={-1}
      aria-labelledby="active-question-title"
      className="bg-white dark:bg-[#142420] rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] space-y-6 transition-all focus:outline-none"
    >
      {/* Category Header Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-300 border border-[#D1E7DD] dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{fieldDef.category}</span>
        </span>

        {fieldDef.sensitive && (
          <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Sensitive Field
          </span>
        )}
      </div>

      {/* Question Headline & Subtext */}
      <div className="space-y-2">
        <h2 id="active-question-title" className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-stone-900 dark:text-white leading-tight">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
            {question.description}
          </p>
        )}
      </div>

      {/* Dynamic Input Renderer */}
      <div className="pt-2">
        <QuestionRenderer
          question={question}
          fieldDef={fieldDef}
          currentValue={currentValue}
          currentStatus={currentStatus}
          customText={customText}
          onChange={onChange}
          validationError={validationError}
        />
      </div>
    </div>
  );
};
