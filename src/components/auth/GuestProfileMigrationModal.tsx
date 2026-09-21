import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { migrateGuestProfileToAccount } from '../../services/storage/profileMigration';

interface GuestProfileMigrationModalProps {
  userId: string;
  isOpen: boolean;
  fieldCount?: number;
  savedCount?: number;
  onComplete: () => void;
}

export const GuestProfileMigrationModal: React.FC<GuestProfileMigrationModalProps> = ({
  userId,
  isOpen,
  fieldCount = 0,
  savedCount = 0,
  onComplete,
}) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = async () => {
    setIsProcessing(true);
    try {
      await migrateGuestProfileToAccount(userId, true);
    } finally {
      setIsProcessing(false);
      onComplete();
    }
  };

  const handleStartFresh = async () => {
    setIsProcessing(true);
    try {
      await migrateGuestProfileToAccount(userId, false);
    } finally {
      setIsProcessing(false);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#142420] border border-[#DFD8CC] dark:border-[#23453E] rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#064E3B] dark:text-emerald-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-editorial text-[#064E3B] dark:text-emerald-300">
              {t('auth.migration.title', undefined, 'Save your Edvora profile?')}
            </h3>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Guest Data Detected
            </span>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {t(
            'auth.migration.subtitle',
            undefined,
            "We found information you previously entered as a guest. You can transfer it to your new account so you don't have to enter it again."
          )}
        </p>

        {(fieldCount > 0 || savedCount > 0) && (
          <div className="bg-[#FAF8F5] dark:bg-[#182E29] rounded-xl p-3.5 border border-[#E8E2D7] dark:border-[#1E3A33] text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
            {fieldCount > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>{fieldCount}</strong> eligibility answers ready to transfer
                </span>
              </div>
            )}
            {savedCount > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>{savedCount}</strong> saved scholarships will be merged to your account
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleTransfer}
            disabled={isProcessing}
            className="flex-1 px-5 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{t('auth.migration.transferBtn', undefined, 'Transfer My Profile')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleStartFresh}
            disabled={isProcessing}
            className="px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-[#1C3630] text-stone-700 dark:text-stone-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span>{t('auth.migration.startFreshBtn', undefined, 'Start Fresh')}</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-stone-500 dark:text-stone-400">
          {t(
            'auth.migration.savedScholarshipsNotice',
            undefined,
            'Your saved scholarships and comparison lists will be preserved.'
          )}
        </p>
      </div>
    </div>
  );
};
