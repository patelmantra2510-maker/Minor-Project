import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Check } from 'lucide-react';
import type { StudentProfile, StudentFieldValue } from '../../types/studentProfile';
import { fieldById } from '../../data/eligibility/fields';
import type { EligibilityFieldDefinition } from '../../types/eligibility';

interface ProfileEditModalProps {
  sectionId: string;
  sectionTitle: string;
  fieldIds: string[];
  currentProfile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: Record<string, StudentFieldValue>) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  sectionTitle,
  fieldIds,
  currentProfile,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();

  // Local form state initialized from current profile
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    for (const fid of fieldIds) {
      const existing = currentProfile.fields[fid];
      initial[fid] = existing ? existing.value : '';
    }
    return initial;
  });

  if (!isOpen) return null;

  const handleChange = (fieldId: string, val: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields: Record<string, StudentFieldValue> = {};
    const now = new Date().toISOString();

    for (const fid of fieldIds) {
      const rawVal = formData[fid];
      if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
        const fieldDef = fieldById[fid];
        let parsedVal: any = rawVal;

        if (fieldDef?.dataType === 'number' || fieldDef?.dataType === 'currency') {
          parsedVal = Number(rawVal);
          if (isNaN(parsedVal)) parsedVal = null;
        } else if (fieldDef?.dataType === 'boolean') {
          parsedVal = rawVal === true || rawVal === 'true';
        }

        if (parsedVal !== null) {
          updatedFields[fid] = {
            value: parsedVal,
            status: 'known',
            updatedAt: now,
            source: 'profile',
          };
        }
      }
    }

    onSave(updatedFields);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
          <h3 id="modal-title" className="text-lg font-bold font-editorial text-stone-900 dark:text-white">
            {t('profile.editSection', { section: sectionTitle }, `Edit ${sectionTitle}`)}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {fieldIds.map((fid) => {
            const def: EligibilityFieldDefinition | undefined = fieldById[fid];
            if (!def) return null;

            const val = formData[fid] ?? '';

            return (
              <div key={fid} className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {def.label}
                </label>
                {def.description && (
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-tight">
                    {def.description}
                  </p>
                )}

                {/* Input render by data type */}
                {def.dataType === 'single_select' && def.options ? (
                  <select
                    value={val}
                    onChange={(e) => handleChange(fid, e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/50 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                  >
                    <option value="">Select option...</option>
                    {def.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : def.dataType === 'boolean' ? (
                  <div className="flex items-center gap-4 pt-1">
                    <label className="inline-flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        name={fid}
                        checked={val === true || val === 'true'}
                        onChange={() => handleChange(fid, true)}
                        className="text-[#065F46] focus:ring-[#065F46]"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        name={fid}
                        checked={val === false || val === 'false'}
                        onChange={() => handleChange(fid, false)}
                        className="text-[#065F46] focus:ring-[#065F46]"
                      />
                      <span>No</span>
                    </label>
                  </div>
                ) : def.dataType === 'number' || def.dataType === 'currency' ? (
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleChange(fid, e.target.value)}
                    placeholder={def.dataType === 'currency' ? 'e.g. 250000' : 'e.g. 75'}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/50 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(fid, e.target.value)}
                    placeholder="Enter details..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DFD8CC] dark:border-[#23453E] bg-stone-50/50 dark:bg-[#182E29] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                  />
                )}
              </div>
            );
          })}

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#E8E2D7] dark:border-[#1E3A33] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors cursor-pointer"
            >
              {t('profile.cancel', undefined, 'Cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs font-bold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('profile.saveChanges', undefined, 'Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
