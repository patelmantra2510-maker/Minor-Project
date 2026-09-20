import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  GraduationCap,
  ShieldCheck,
  Compass,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface ProfileOnboardingStateProps {
  onStartProfile: () => void;
  onExploreScholarships: () => void;
}

export const ProfileOnboardingState: React.FC<ProfileOnboardingStateProps> = ({
  onStartProfile,
  onExploreScholarships,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-14 px-4 sm:px-6">
      {/* Hero Badge & Main Heading */}
      <div className="relative text-center space-y-4">
        {/* Subtle 3D Floating Document Motif (Desktop only, restrained) */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#142420]/95 border border-stone-200/90 dark:border-[#23453E] shadow-md absolute -left-20 top-8 opacity-80 hover:opacity-100 transition-opacity animate-float motion-reduce:animate-none pointer-events-none"
          style={{ animationDuration: '14s', transform: 'rotate(-4deg)' }}
          aria-hidden="true"
        >
          <div className="w-6 h-6 rounded-lg bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-stone-800 dark:text-stone-200">Eligibility Profile</div>
            <div className="text-[9px] text-stone-400">Personalized criteria</div>
          </div>
        </div>

        {/* Subtle 3D Floating Scholarship Motif (Desktop only, restrained) */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#142420]/95 border border-emerald-600/30 dark:border-emerald-700/40 shadow-md absolute -right-20 top-16 opacity-80 hover:opacity-100 transition-opacity animate-float-alt motion-reduce:animate-none pointer-events-none"
          style={{ animationDuration: '16s', transform: 'rotate(4deg)' }}
          aria-hidden="true"
        >
          <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-[#2A2315] text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-stone-800 dark:text-stone-200">Verified Match</div>
            <div className="text-[9px] text-[#065F46] dark:text-emerald-400 font-semibold">Central & State</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3EE] dark:bg-[#163328] border border-[#D1E7DD] dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 text-xs font-semibold shadow-2xs">
          <GraduationCap className="w-4 h-4" />
          <span>{t('profile.title', undefined, 'Student Profile')}</span>
        </div>

        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-stone-900 dark:text-white tracking-tight leading-tight">
          {t('profile.buildProfileTitle', undefined, 'Build Your Scholarship Profile')}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
          {t(
            'profile.buildProfileDesc',
            undefined,
            'Tell Edvora a little about yourself. Your profile helps us find scholarships that match your education, background, and eligibility.'
          )}
        </p>

        {/* Primary CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartProfile}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-sm font-bold shadow-xs transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
          >
            <span>{t('profile.startProfile', undefined, 'Start My Profile')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={onExploreScholarships}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/80 dark:bg-[#142420]/80 hover:bg-stone-100 dark:hover:bg-[#1C3630] text-stone-700 dark:text-stone-300 text-sm font-semibold border border-[#E8E2D7] dark:border-[#1E3A33] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] min-h-[44px]"
          >
            <span>{t('common.browseAll', undefined, 'Browse All Scholarships')}</span>
          </button>
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 sm:mt-16">
        <div className="bg-white/80 dark:bg-[#142420]/80 backdrop-blur-xs rounded-2xl p-5 border border-[#E8E2D7] dark:border-[#1E3A33]">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center mb-3">
            <Compass className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold font-editorial text-stone-900 dark:text-white">
            Single Profile Matching
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            Answer your eligibility details once. Edvora matches them across central, state, and trust schemes.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#142420]/80 backdrop-blur-xs rounded-2xl p-5 border border-[#E8E2D7] dark:border-[#1E3A33]">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-[#2A2315] text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold font-editorial text-stone-900 dark:text-white">
            Private & On-Device
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            Your profile stays locally stored on your browser. No mandatory account creation or passwords required.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#142420]/80 backdrop-blur-xs rounded-2xl p-5 border border-[#E8E2D7] dark:border-[#1E3A33]">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center mb-3">
            <FileCheck className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold font-editorial text-stone-900 dark:text-white">
            Document Readiness
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            Keep track of required certificates so you are prepared the moment application portals open.
          </p>
        </div>
      </div>
    </div>
  );
};
