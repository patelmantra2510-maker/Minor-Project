import React, { useState, useEffect } from 'react';
import type { StudentAnswers, SocialCategory, Gender, EducationLevel, StateLocation } from '../../types/scholarship';
import { useLanguage } from '../../context/LanguageContext';
import { X, ShieldCheck, Sparkles } from 'lucide-react';

interface QuickUpdateFieldModalProps {
  isOpen: boolean;
  fieldId?: string;
  fieldName?: string;
  currentAnswers: StudentAnswers | null;
  onClose: () => void;
  onSave: (updatedAnswers: StudentAnswers) => void;
}

export const QuickUpdateFieldModal: React.FC<QuickUpdateFieldModalProps> = ({
  isOpen,
  fieldId,
  fieldName,
  currentAnswers,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();

  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    return (
      currentAnswers || {
        location: 'Gujarat',
        educationLevel: 'Undergraduate',
        stream: 'Engineering & Technology (B.E. / B.Tech)',
        currentYear: '1st Year',
        category: 'General',
        gender: 'Male',
        annualIncome: 300000,
        academicPercentage: 75,
        isDisability: false,
        disabilityPercentage: 40,
        isOrphan: false,
        isDefenceWard: false,
        isMinority: false,
      }
    );
  });

  const [incomeStr, setIncomeStr] = useState<string>(
    answers.annualIncome ? answers.annualIncome.toString() : '300000'
  );
  const [percentStr, setPercentStr] = useState<string>(
    answers.academicPercentage ? answers.academicPercentage.toString() : '75'
  );

  useEffect(() => {
    if (isOpen && currentAnswers) {
      setAnswers(currentAnswers);
      if (currentAnswers.annualIncome !== undefined) {
        setIncomeStr(currentAnswers.annualIncome.toString());
      }
      if (currentAnswers.academicPercentage !== undefined) {
        setPercentStr(currentAnswers.academicPercentage.toString());
      }
    }
  }, [isOpen, currentAnswers]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: StudentAnswers = {
      ...answers,
      annualIncome: parseInt(incomeStr.replace(/[^0-9]/g, ''), 10) || 0,
      academicPercentage: parseFloat(percentStr) || 0,
    };

    // Persist to session storage
    try {
      sessionStorage.setItem('edvora_session_answers', JSON.stringify(updated));
    } catch {
      // ignore
    }

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#142420] border border-[#DFD8CC] dark:border-[#23453E] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1E3A33] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-editorial text-[#064E3B] dark:text-emerald-300">
                {t('matchScore.updateMissingTitle', undefined, 'Update Missing Information')}
              </h3>
              {fieldName && (
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Target field: <strong>{fieldName}</strong>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Targeted Input or Full Quick Form */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Income Field */}
          {(!fieldId || fieldId.includes('income')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Annual Family Income (₹)
              </label>
              <input
                type="number"
                value={incomeStr}
                onChange={(e) => setIncomeStr(e.target.value)}
                placeholder="e.g. 250000"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#142420] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              />
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                Total combined annual income of your parents/guardian.
              </span>
            </div>
          )}

          {/* Academic Percentage Field */}
          {(!fieldId || fieldId.includes('academic') || fieldId.includes('percentage')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Qualifying Academic Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={percentStr}
                onChange={(e) => setPercentStr(e.target.value)}
                placeholder="e.g. 85"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#142420] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              />
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                Percentage or percentile from your previous qualifying board or degree examination.
              </span>
            </div>
          )}

          {/* Social Category Field */}
          {(!fieldId || fieldId.includes('category')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Social Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {(['General', 'SEBC/OBC', 'SC', 'ST', 'EWS'] as SocialCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, category: cat }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.category === cat
                        ? 'bg-[#064E3B] text-amber-50 border-[#064E3B] shadow-2xs'
                        : 'bg-white dark:bg-[#142420] border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* State Location Field */}
          {(!fieldId || fieldId.includes('location') || fieldId.includes('state') || fieldId.includes('domicile')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                State Domicile / Study
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(['Gujarat', 'Other Indian State'] as StateLocation[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, location: loc }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.location === loc
                        ? 'bg-[#064E3B] text-amber-50 border-[#064E3B] shadow-2xs'
                        : 'bg-white dark:bg-[#142420] border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gender Field */}
          {(!fieldId || fieldId.includes('gender')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['Male', 'Female', 'Other'] as Gender[]).map((gen) => (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, gender: gen }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.gender === gen
                        ? 'bg-[#064E3B] text-amber-50 border-[#064E3B] shadow-2xs'
                        : 'bg-white dark:bg-[#142420] border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Education Level Field */}
          {(!fieldId || fieldId.includes('education')) && (
            <div className="space-y-1.5 bg-[#FAF8F5] dark:bg-[#182E29] p-3.5 rounded-2xl border border-stone-200/70 dark:border-[#23453E]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Education Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {(['Diploma', 'Undergraduate', 'Postgraduate', 'School', 'ITI', 'PhD'] as EducationLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, educationLevel: level }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      answers.educationLevel === level
                        ? 'bg-[#064E3B] text-amber-50 border-[#064E3B] shadow-2xs'
                        : 'bg-white dark:bg-[#142420] border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('matchScore.saveAndRecalculate', undefined, 'Save & Recalculate')}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-[#1C3630] text-stone-700 dark:text-stone-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t('common.close', undefined, 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
