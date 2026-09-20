import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Edit3, PlusCircle } from 'lucide-react';
import type { StudentFieldValue } from '../../types/studentProfile';
import { fieldById } from '../../data/eligibility/fields';

export interface DisplayFieldItem {
  fieldId: string;
  label: string;
  fieldValue: StudentFieldValue;
}

interface ProfileSectionCardProps {
  sectionId: string;
  title: string;
  description: string;
  emptyPrompt: string;
  icon: React.ReactNode;
  fields: DisplayFieldItem[];
  onEdit: (sectionId: string) => void;
}

/**
 * Formats a raw profile field value into a human-readable display string.
 */
function formatFieldValue(item: DisplayFieldItem): string {
  const { fieldId, fieldValue } = item;
  const { value, status, customText } = fieldValue;

  if (status === 'prefer_not_to_say') {
    return 'Prefer not to say';
  }
  if (status === 'custom' && customText) {
    return customText;
  }
  if (status === 'unknown') {
    return 'Not sure';
  }
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const def = fieldById[fieldId];
  if (def?.options && typeof value === 'string') {
    const opt = def.options.find((o) => o.value.toLowerCase() === value.toLowerCase());
    if (opt) return opt.label;
  }

  if (def?.dataType === 'currency' && typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
}

export const ProfileSectionCard: React.FC<ProfileSectionCardProps> = ({
  sectionId,
  title,
  description,
  emptyPrompt,
  icon,
  fields,
  onEdit,
}) => {
  const { t } = useLanguage();

  // Filter only fields that have actual meaningful data
  const populatedFields = fields.filter((f) => {
    if (f.fieldValue.status === 'prefer_not_to_say') return true;
    if (f.fieldValue.status === 'custom' && f.fieldValue.customText) return true;
    return (
      f.fieldValue.value !== null &&
      f.fieldValue.value !== undefined &&
      f.fieldValue.value !== ''
    );
  });

  const isEmpty = populatedFields.length === 0;

  return (
    <div className="bg-white dark:bg-[#142420] rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] hover:border-[#D1E7DD] dark:hover:border-emerald-800/80 transition-all flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icon}
            </span>
            <div>
              <h3 className="text-base font-bold font-editorial text-stone-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                {description}
              </p>
            </div>
          </div>

          {!isEmpty && (
            <button
              onClick={() => onEdit(sectionId)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#065F46] dark:text-emerald-400 hover:text-[#044835] dark:hover:text-emerald-300 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#065F46] cursor-pointer"
              aria-label={`Edit ${title}`}
            >
              <span>{t('profile.edit', undefined, 'Edit')}</span>
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Card Body */}
        {isEmpty ? (
          <div className="py-4 px-3.5 my-2 rounded-xl bg-stone-50/70 dark:bg-[#182E29]/50 border border-dashed border-[#DFD8CC] dark:border-[#23453E] text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
              {emptyPrompt}
            </p>
            <button
              onClick={() => onEdit(sectionId)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF3EE] dark:bg-[#163328] hover:bg-[#D1E7DD] dark:hover:bg-emerald-900/60 text-[#065F46] dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('profile.completeSection', { section: title }, `Complete ${title}`)}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {populatedFields.map((field) => (
              <div
                key={field.fieldId}
                className="bg-stone-50/80 dark:bg-[#182E29]/60 rounded-xl p-2.5 border border-stone-100 dark:border-[#1E3A33]/70"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 truncate">
                  {field.label}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 mt-0.5 truncate">
                  {formatFieldValue(field)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
