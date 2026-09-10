import React, { useState, useEffect } from 'react';
import type { Scholarship } from '../../types/scholarship';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  CheckSquare,
  Square,
  FileCheck,
  Printer,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface DocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarships: Scholarship[];
}

interface ChecklistItem {
  id: string;
  name: string;
  category: 'identity' | 'academic' | 'income' | 'banking';
  requiredBy: string[]; // Names of scholarships requiring it
}

export const DocumentChecklistModal: React.FC<DocumentChecklistModalProps> = ({
  isOpen,
  onClose,
  scholarships,
}) => {
  const { t } = useLanguage();
  const STORAGE_KEY = 'edvora_saved_doc_checklist_v1';

  // Checked item IDs stored in localStorage
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save checked state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage errors
    }
  }, [checkedIds]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aggregate and deduplicate documents across all saved scholarships
  const docMap = new Map<string, { category: 'identity' | 'academic' | 'income' | 'banking'; requiredBy: string[] }>();

  scholarships.forEach((s) => {
    (s.documents || []).forEach((doc: string) => {
      const docLower = doc.toLowerCase();
      let category: 'identity' | 'academic' | 'income' | 'banking' = 'academic';

      if (
        docLower.includes('aadhaar') ||
        docLower.includes('domicile') ||
        docLower.includes('identity') ||
        docLower.includes('ration') ||
        docLower.includes('residence') ||
        docLower.includes('photo') ||
        docLower.includes('passport')
      ) {
        category = 'identity';
      } else if (
        docLower.includes('income') ||
        docLower.includes('caste') ||
        docLower.includes('category') ||
        docLower.includes('creamy') ||
        docLower.includes('ews') ||
        docLower.includes('mamlatdar') ||
        docLower.includes('disability') ||
        docLower.includes('pwd')
      ) {
        category = 'income';
      } else if (
        docLower.includes('bank') ||
        docLower.includes('passbook') ||
        docLower.includes('account') ||
        docLower.includes('cheque') ||
        docLower.includes('fee') ||
        docLower.includes('receipt') ||
        docLower.includes('bonafide') ||
        docLower.includes('hostel')
      ) {
        category = 'banking';
      }

      // Normalization key
      const normalizedKey = doc.trim();
      const existing = docMap.get(normalizedKey);
      if (existing) {
        if (!existing.requiredBy.includes(s.shortName || s.name)) {
          existing.requiredBy.push(s.shortName || s.name);
        }
      } else {
        docMap.set(normalizedKey, {
          category,
          requiredBy: [s.shortName || s.name],
        });
      }
    });
  });

  const allItems: ChecklistItem[] = Array.from(docMap.entries()).map(([name, data]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name,
    category: data.category,
    requiredBy: data.requiredBy,
  }));

  const totalCount = allItems.length;
  const completedCount = allItems.filter((item) => checkedIds.includes(item.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCheckedIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const categories: { key: 'identity' | 'academic' | 'income' | 'banking'; label: string; iconBg: string }[] = [
    { key: 'identity', label: t('savedPage.checklistCatIdentity', undefined, 'Identity & Domicile'), iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' },
    { key: 'academic', label: t('savedPage.checklistCatAcademic', undefined, 'Academic Records'), iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
    { key: 'income', label: t('savedPage.checklistCatIncome', undefined, 'Income & Social Category'), iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
    { key: 'banking', label: t('savedPage.checklistCatFinancial', undefined, 'Banking & Institution'), iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] dark:bg-[#142420] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2D7] dark:border-[#1E3A33] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E2D7] dark:border-[#1E3A33] bg-white/80 dark:bg-[#12221E]/80 backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <FileCheck className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
                {t('savedPage.checklistModalTitle', undefined, 'Unified Document Checklist')}
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('savedPage.checklistModalSubtitle', { count: String(scholarships.length) }, `Consolidated documents required across your ${scholarships.length} saved scholarship(s).`)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-[#1C3630] text-stone-500 dark:text-stone-400 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Actions Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-amber-50/60 dark:bg-[#182C26] border-b border-[#E8E2D7] dark:border-[#1E3A33] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-stone-600 dark:text-stone-300">
                {t('savedPage.checklistReady', { ready: String(completedCount), total: String(totalCount) }, `Ready (${completedCount}/${totalCount})`)}
              </span>
              <span className="text-[#065F46] dark:text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 dark:bg-stone-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-[#065F46] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#142420] border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-[#1A302A] transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('savedPage.checklistPrint', undefined, 'Print')}</span>
            </button>
            {completedCount > 0 && (
              <button
                onClick={resetChecklist}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#142420] border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Checklist Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {totalCount === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No document requirements found for the saved scholarships.
            </div>
          ) : (
            categories.map((cat) => {
              const catItems = allItems.filter((i) => i.category === cat.key);
              if (catItems.length === 0) return null;

              return (
                <div key={cat.key} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${cat.iconBg}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">({catItems.length})</span>
                  </div>

                  <div className="space-y-2">
                    {catItems.map((item) => {
                      const isChecked = checkedIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isChecked
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                              : 'bg-white dark:bg-[#182C26] border-[#E8E2D7] dark:border-[#1E3A33] text-stone-800 dark:text-stone-200 hover:border-amber-400 dark:hover:border-emerald-600'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 focus:outline-hidden"
                            aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs sm:text-sm font-semibold transition-all ${
                                isChecked ? 'line-through text-stone-400 dark:text-stone-500' : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="text-[11px] text-stone-400">Required by:</span>
                              {item.requiredBy.map((schName, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#12221E] text-[10px] font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60"
                                >
                                  {schName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Privacy Note */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('savedPage.checklistNote', undefined, 'All checklist progress is saved locally in your browser storage.')}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E2D7] dark:border-[#1E3A33] bg-white/80 dark:bg-[#12221E]/80 backdrop-blur-md flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#064E3B]/20"
          >
            {t('savedPage.checklistClose', undefined, 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
