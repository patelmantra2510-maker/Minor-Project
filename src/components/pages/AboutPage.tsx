import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Globe2,
  MapPin,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AboutPageProps {
  onStartFinder: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartFinder }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in duration-300 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#142420] border border-emerald-200 dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('aboutPage.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-editorial tracking-tight">
          {t('aboutPage.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          {t('aboutPage.subtitle')}
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#065F46] dark:text-emerald-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-editorial">
            {t('aboutPage.zeroRegTitle')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('aboutPage.zeroRegDesc')}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#2A2415] text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-editorial">
            {t('aboutPage.transparentTitle')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('aboutPage.transparentDesc')}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#132A24] text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-editorial">
            {t('aboutPage.acrossIndiaTitle')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('aboutPage.acrossIndiaDesc')}
          </p>
        </div>
      </div>

      {/* Brand Identity & Emblem Story */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-8 sm:p-10 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100 dark:border-[#1E3A33]">
          <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C3630] border border-[#E8E2D7] dark:border-[#23453E] p-2.5 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/edvora-emblem-transparent.png"
              alt="Official Edvora Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#065F46] dark:text-emerald-400">
              {t('aboutPage.emblemBadge')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-editorial">
              {t('aboutPage.emblemTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
              {t('aboutPage.emblemSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E] space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              📖
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-editorial">
              {t('aboutPage.bookTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('aboutPage.bookDesc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E] space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              🌿
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-editorial">
              {t('aboutPage.leafTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('aboutPage.leafDesc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E] space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-[#2A2415] text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
              🎓
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-editorial">
              {t('aboutPage.capTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('aboutPage.capDesc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E] space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-[#2A2415] text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-editorial">
              {t('aboutPage.starTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('aboutPage.starDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Scope Section */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-6">
        <h2 className="text-xl font-bold text-[#064E3B] dark:text-white font-editorial">
          {t('aboutPage.whatCoveredTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#065F46] dark:text-emerald-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>{t('aboutPage.stateGovTitle')}</span>
            </div>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
              <li>• Mukhyamantri Yuva Swavalamban Yojana (MYSY)</li>
              <li>• Hon. Chief Minister Scholarship Scheme (CMSS)</li>
              <li>• Digital Gujarat Post-Matric (SC, ST, SEBC/OBC)</li>
              <li>• Kanya Kelavani Nidhi for Girl Students</li>
              <li>• Swami Vivekananda ITI Stipend Scheme</li>
              <li>• SHODH Ph.D. Research Fellowships</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
              <Globe2 className="w-4 h-4" />
              <span>{t('aboutPage.nationalGrantsTitle')}</span>
            </div>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
              <li>• PM-USP CSSS (Ministry of Education / NSP)</li>
              <li>• AICTE Pragati Scholarship for Girls</li>
              <li>• AICTE Saksham for Specially-Abled Students</li>
              <li>• AICTE Swanath for Orphans & Defence Wards</li>
              <li>• DST INSPIRE Scholarship for Higher Education</li>
              <li>• Post-Matric Scholarships for Minorities</li>
              <li>• Kotak Kanya & Tata Trusts Education Grants</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-[#201C12] border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{t('aboutPage.noticeTitle')}</span>
        </div>
        <p className="leading-relaxed">
          {t('aboutPage.noticeP1')}
        </p>
        <p className="leading-relaxed">
          {t('aboutPage.noticeP2')}
        </p>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onStartFinder}
          className="px-8 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-md shadow-[#064E3B]/20 transition-all hover:scale-105"
        >
          {t('aboutPage.findMyScholarshipsBtn')}
        </button>
      </div>
    </div>
  );
};
