import React, { useEffect, useState, useMemo } from 'react';
import type { Scholarship, MatchResult, StudentAnswers } from '../../types/scholarship';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { StatusBadge, MatchBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from './ScholarshipCard';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  GraduationCap,
  FileText,
  AlertCircle,
  Share2,
  Clock,
  Ban,
  Sparkles,
  Maximize2,
  ChevronRight,
  HelpCircle,
  Info,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAI } from '../../context/AIContext';

interface ScholarshipDetailPageProps {
  scholarship: Scholarship;
  matchResult?: MatchResult;
  studentAnswers?: StudentAnswers | null;
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  scholarship,
  matchResult,
  studentAnswers: _studentAnswers,
  onBack,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { openScholarshipAI } = useAI();
  const { isSaved, toggleSave, addRecentlyViewed } = useSaved();
  const { isComparing, toggleCompare, compareIds } = useCompare();

  const saved = isSaved(scholarship.id);
  const comparing = isComparing(scholarship.id);

  // Document checklist interactive state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Sticky action bar state
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    addRecentlyViewed(scholarship.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCheckedDocs({});
  }, [scholarship.id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(t('detail.copiedAlert', undefined, 'Scholarship link copied to clipboard!'));
    }
  };

  const handleCompareClick = () => {
    if (!comparing && compareIds.length >= 3) {
      alert(t('detail.compareLimitReached', undefined, 'You can compare up to 3 scholarships at a time.'));
      return;
    }
    toggleCompare(scholarship.id);
  };

  const toggleDocCheck = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Derive "Who Cannot Apply" from verified hard constraints
  const whoCannotApplyList = useMemo(() => {
    return [
      scholarship.state === 'Gujarat'
        ? 'Students without Gujarat domicile or not enrolled in Gujarat recognized institutions.'
        : null,
      scholarship.genderEligibility === 'Female'
        ? 'Male students (this scheme is exclusively for eligible girl students).'
        : null,
      scholarship.genderEligibility === 'Male'
        ? 'Female students (this scheme is designated for male students).'
        : null,
      scholarship.incomeLimit
        ? `Candidates whose total family annual income exceeds ₹${scholarship.incomeLimit.toLocaleString('en-IN')}.`
        : null,
      scholarship.minimumPercentage
        ? `Candidates scoring below the minimum ${scholarship.minimumPercentage}% qualifying cutoff.`
        : null,
      scholarship.specialConditions?.disabilityRequired
        ? 'Candidates without a verified UDID / benchmark disability certificate (>= 40%).'
        : null,
      scholarship.specialConditions?.orphanRequired
        ? 'Candidates who do not meet the official orphan or COVID-affected ward criteria.'
        : null,
      scholarship.specialConditions?.defenceWardRequired
        ? 'Candidates who are not registered wards of armed forces or CAPF personnel.'
        : null,
      scholarship.specialConditions?.minorityRequired
        ? 'Students outside notified religious minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).'
        : null,
      'Students pursuing unapproved, distance, or correspondence courses unless explicitly recognized by the scheme guidelines.',
    ].filter(Boolean) as string[];
  }, [scholarship]);

  // Deadline & Countdown Calculation
  const deadlineInfo = useMemo(() => {
    if (!scholarship.applicationDeadline) {
      return {
        label: t('detail.deadlineUnavailable', undefined, 'Deadline information unavailable'),
        isClosed: false,
      };
    }
    const deadline = new Date(scholarship.applicationDeadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0 || scholarship.status === 'Closed') {
      return {
        label: t('detail.applicationClosed', undefined, 'Application Closed'),
        isClosed: true,
        formatted: formatDate(scholarship.applicationDeadline),
      };
    }
    return {
      label: `${formatDate(scholarship.applicationDeadline)} • ${diffDays} ${t('detail.daysRemaining', { count: diffDays }, `${diffDays} days remaining`)}`,
      isClosed: false,
      days: diffDays,
      formatted: formatDate(scholarship.applicationDeadline),
    };
  }, [scholarship.applicationDeadline, scholarship.status, t]);

  // Related Scholarships (3 verified schemes with similar state, education level, or type)
  const relatedScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((s) => s.id !== scholarship.id)
      .map((s) => {
        let score = 0;
        if (s.state === scholarship.state) score += 3;
        if (s.educationLevels.some((lvl) => scholarship.educationLevels.includes(lvl))) score += 3;
        if (s.type === scholarship.type) score += 2;
        if (s.categories.some((cat) => cat === 'All' || scholarship.categories.includes(cat))) score += 1;
        return { scholarship: s, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.scholarship);
  }, [scholarship]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMB / BACK NAVIGATION                                           */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
          <button
            onClick={() => (onNavigate ? onNavigate('explore') : onBack())}
            className="hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {t('detail.exploreScholarships', undefined, 'Explore Scholarships')}
          </button>
          <span className="text-stone-300 dark:text-stone-600">/</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold truncate max-w-sm lg:max-w-md">
            {scholarship.shortName || scholarship.name}
          </span>
        </nav>

        <button
          onClick={onBack}
          className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('detail.backToScholarships', undefined, 'Back to Scholarships')}</span>
        </button>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#1E3A33] bg-white dark:bg-[#142420] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] text-xs font-semibold transition-colors cursor-pointer"
            title={t('detail.copyLink', undefined, 'Copy link')}
            aria-label="Share scholarship"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('detail.copyLink', undefined, 'Copy Link')}</span>
          </button>

          <button
            onClick={handleCompareClick}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
              comparing
                ? 'bg-[#064E3B] text-amber-100 border-[#064E3B]'
                : 'bg-white dark:bg-[#142420] border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630]'
            }`}
          >
            {comparing ? `✓ ${t('common.inCompare', undefined, 'In Compare')}` : t('common.addCompare', undefined, '+ Compare')}
          </button>

          <button
            onClick={() => toggleSave(scholarship.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              saved
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                : 'bg-white dark:bg-[#142420] border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{saved ? t('common.saved', undefined, 'Saved') : t('common.saveForLater', undefined, 'Save')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCHOLARSHIP HERO SECTION                                               */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-xs mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">
          <StatusBadge
            deadline={scholarship.applicationDeadline}
            startDate={scholarship.applicationStart}
            overrideStatus={scholarship.status}
          />
          {matchResult && <MatchBadge status={matchResult.status} size="sm" />}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
            {scholarship.state === 'Gujarat'
              ? `${t('common.gujarat', undefined, 'Gujarat')} State Scheme`
              : `${t('common.allIndia', undefined, 'All India')} Scheme`}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-[#132A24] text-[#064E3B] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Layers className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
            {scholarship.type}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300">
            <GraduationCap className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            {scholarship.educationLevels.join(', ')}
          </span>
        </div>

        {/* Title (Responsive wrapping without truncation or overflow) */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-editorial tracking-tight leading-tight break-words">
          {scholarship.name}
        </h1>

        {/* Provider */}
        <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
          <Building2 className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0" />
          <span>
            {t('detail.providedBy', undefined, 'Provided by')}{' '}
            <strong className="text-stone-800 dark:text-stone-200">{scholarship.provider}</strong>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl mt-3">
          {scholarship.description}
        </p>

        {/* Deadline Information */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-[#1E3A33] flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {t('detail.deadline', undefined, 'Application Deadline')}:{' '}
              <strong className={`font-semibold ${deadlineInfo.isClosed ? 'text-rose-600 dark:text-rose-400' : 'text-stone-900 dark:text-stone-100'}`}>
                {deadlineInfo.label}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#065F46] dark:text-emerald-400 shrink-0" />
            <span>
              {t('directory.recentlyUpdated', undefined, 'Updated')}:{' '}
              <strong className="font-semibold text-stone-900 dark:text-stone-100">{formatDate(scholarship.lastUpdated)}</strong>
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-stone-100 dark:border-[#1E3A33]">
          {/* Apply on Official Portal Button */}
          {scholarship.applicationWebsite ? (
            <a
              href={scholarship.applicationWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span>{t('detail.applyOfficial', undefined, 'Apply on Official Portal')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <a
              href={scholarship.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-stone-200 dark:bg-[#1E3A33] text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{t('detail.viewOfficialSource', undefined, 'View Official Source')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Ask Edvora AI Guide */}
          <button
            onClick={() => openScholarshipAI(scholarship.id)}
            className="px-4 py-3 rounded-xl bg-[#064E3B] hover:bg-[#075944] text-amber-100 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            title={t('detail.askEdvoraAISubtitle', undefined, 'Get a step-by-step guide to this scholarship.')}
          >
            <Sparkles className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-12" />
            <span>{t('ai.askEdvoraAI', undefined, 'Ask Edvora AI')}</span>
          </button>

          {/* Open Full AI Option */}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate(`ai?scholarshipId=${scholarship.id}`);
              } else {
                window.location.hash = `#/ai?scholarshipId=${scholarship.id}`;
              }
            }}
            className="px-3.5 py-3 rounded-xl border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[#064E3B] dark:text-emerald-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open interactive workspace on full AI page"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('aiPage.openInFullAI', undefined, 'Open Full AI')}</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MATCH / ELIGIBILITY SUMMARY                                            */}
      {/* ========================================================================= */}
      {matchResult ? (
        /* Case A: Student completed questionnaire in this session */
        <section className="bg-gradient-to-r from-emerald-50 to-amber-50/40 dark:from-[#142420] dark:to-[#182E29] rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800 shadow-2xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-[#064E3B] text-amber-300 shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-[#064E3B] dark:text-white font-editorial">
                    {t('detail.personalizedAnalysis', undefined, 'Your Personalized Eligibility Analysis')}
                  </h2>
                  <MatchBadge status={matchResult.status} size="md" />
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-2xl">
                  {matchResult.summaryMessage}
                </p>
              </div>
            </div>

            <a
              href="#why-this-matches"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-emerald-400 hover:underline shrink-0"
            >
              <span>{t('detail.whyThisMatches', undefined, 'See Why This Matches You')}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* High-level quick check items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-emerald-200/60 dark:border-[#23453E]">
            {matchResult.checks.slice(0, 3).map((check, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/90 dark:bg-[#1C3630] border border-stone-200/70 dark:border-[#23453E] text-xs flex items-center gap-2"
              >
                {check.status === 'matched' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {check.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                {check.status === 'unmatched' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">{check.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Case B: Student has not completed questionnaire in this session */
        <section className="bg-[#FAF8F5] dark:bg-[#142420] rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-editorial">
                {t('detail.checkEligibilityPrompt', undefined, 'Want to see if this scholarship matches you?')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-xl">
                {t(
                  'detail.checkEligibilityDesc',
                  undefined,
                  'Answer 7 quick anonymous questions to evaluate your match against this scheme.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => (onNavigate ? onNavigate('find') : (window.location.hash = '#/find'))}
            className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#075944] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            {t('detail.checkEligibilityBtn', undefined, 'Check My Eligibility')}
          </button>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. QUICK FACTS SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="mb-8">
        <h2 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-3">
          {t('detail.quickFacts', undefined, 'Quick Facts')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.education', undefined, 'Education')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.educationLevels.join(', ')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.location', undefined, 'Location')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.state === 'Gujarat' ? 'Gujarat' : 'All India'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.category', undefined, 'Category')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.categories.join(', ')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.familyIncome', undefined, 'Family Income')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#064E3B] dark:text-emerald-400 mt-1 block truncate">
              {scholarship.incomeLimit
                ? `≤ ₹${scholarship.incomeLimit.toLocaleString('en-IN')}/yr`
                : t('detail.noIncomeLimit', undefined, 'No income limit')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.academicScore', undefined, 'Academic Score')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.minimumPercentage
                ? `≥ ${scholarship.minimumPercentage}%`
                : t('detail.passingMarks', undefined, 'Passing marks')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.gender', undefined, 'Gender')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.genderEligibility === 'All'
                ? t('directory.allGenders', undefined, 'All Genders')
                : `${scholarship.genderEligibility} Only`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.currentStatus', undefined, 'Status')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-1 block truncate">
              {scholarship.status}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              {t('detail.primaryBenefit', undefined, 'Primary Benefit')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#064E3B] dark:text-emerald-400 mt-1 block truncate">
              {scholarship.benefits.amountDescription}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN EDITORIAL LAYOUT (70% Main, 30% Sidebar)                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* 5. ABOUT SCHOLARSHIP */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#065F46] dark:text-emerald-400" />
              <span>{t('detail.aboutScholarship', undefined, 'About This Scholarship')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {scholarship.description}
            </p>
          </section>

          {/* 6. ELIGIBILITY CRITERIA & CHECKLISTS */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#065F46] dark:text-emerald-400" />
                <span>{t('detail.whoCanApplyTitle', undefined, 'Who Can Apply?')}</span>
              </h2>
              <ul className="space-y-2.5">
                {scholarship.whoCanApply.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who Cannot Apply (Explicit hard boundaries) */}
            <div className="pt-6 border-t border-stone-100 dark:border-[#1E3A33]">
              <h3 className="text-base font-bold text-rose-800 dark:text-rose-400 font-editorial mb-3 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>{t('detail.whoCannotApplyTitle', undefined, 'Who Cannot Apply')}</span>
              </h3>
              <ul className="space-y-2">
                {whoCannotApplyList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                      ✕
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Eligibility Matrix Table */}
            <div className="pt-6 border-t border-stone-100 dark:border-[#1E3A33]">
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 font-editorial mb-3">
                {t('detail.eligibilityMatrixTitle', undefined, 'Eligibility Matrix')}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-stone-200/80 dark:border-[#1E3A33]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-[#142622] border-b border-stone-200 dark:border-[#1E3A33] text-stone-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3.5">{t('compare.feature', undefined, 'Criteria')}</th>
                      <th className="py-2.5 px-3.5">{t('detail.verifiedOfficialRequirement', undefined, 'Verified Requirement')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-[#1E3A33] text-stone-700 dark:text-stone-300">
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('compare.region', undefined, 'Region')}</td>
                      <td className="py-2.5 px-3.5">{scholarship.state === 'Gujarat' ? 'Gujarat Domicile / Gujarat Recognized Institution' : 'All States & UTs across India'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('directory.educationLevel', undefined, 'Education')}</td>
                      <td className="py-2.5 px-3.5">{scholarship.educationLevels.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('compare.familyIncomeLimit', undefined, 'Income Limit')}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-[#064E3B] dark:text-emerald-400">
                        {scholarship.incomeLimit ? `≤ ₹${scholarship.incomeLimit.toLocaleString('en-IN')} per annum` : 'No income ceiling specified'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('compare.minPercentage', undefined, 'Minimum Score')}</td>
                      <td className="py-2.5 px-3.5">
                        {scholarship.minimumPercentage ? `≥ ${scholarship.minimumPercentage}% in qualifying exam` : 'Passing marks in qualifying examination'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('compare.gender', undefined, 'Gender')}</td>
                      <td className="py-2.5 px-3.5">{scholarship.genderEligibility === 'All' ? t('directory.allGenders', undefined, 'All Genders') : `${scholarship.genderEligibility} only`}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">{t('directory.category', undefined, 'Category')}</td>
                      <td className="py-2.5 px-3.5">{scholarship.categories.join(', ')}</td>
                    </tr>
                    {scholarship.specialConditions?.verificationNote && (
                      <tr>
                        <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">Condition Note</td>
                        <td className="py-2.5 px-3.5 text-amber-700 dark:text-amber-400 font-medium">
                          {scholarship.specialConditions.verificationNote}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 7. WHAT YOU RECEIVE (BENEFITS) */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{t('detail.whatYouReceive', undefined, 'What You Receive')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E]">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  {t('detail.benefitsTitle', undefined, 'Primary Financial Assistance')}
                </span>
                <span className="text-sm font-bold text-[#064E3B] dark:text-emerald-400 mt-1 block">
                  {scholarship.benefits.amountDescription}
                </span>
              </div>

              {scholarship.benefits.tuitionFeeCoverage && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E]">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    {t('detail.tuitionCoverage', undefined, 'Tuition Coverage')}
                  </span>
                  <span className="text-xs text-stone-700 dark:text-stone-300 mt-1 block leading-relaxed font-medium">
                    {scholarship.benefits.tuitionFeeCoverage}
                  </span>
                </div>
              )}

              {scholarship.benefits.hostelAllowance && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E]">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    {t('detail.hostelSupport', undefined, 'Hostel Support')}
                  </span>
                  <span className="text-xs text-stone-700 dark:text-stone-300 mt-1 block leading-relaxed font-medium">
                    {scholarship.benefits.hostelAllowance}
                  </span>
                </div>
              )}

              {scholarship.benefits.bookAllowance && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200/80 dark:border-[#23453E]">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    {t('detail.bookGrant', undefined, 'Book & Equipment Grant')}
                  </span>
                  <span className="text-xs text-stone-700 dark:text-stone-300 mt-1 block leading-relaxed font-medium">
                    {scholarship.benefits.bookAllowance}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 8. REQUIRED DOCUMENTS (Interactive Checklist) */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>{t('detail.documentsTitle', undefined, 'Required Documents')}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              {t('detail.documentsSubtitle', undefined, 'Prepare verified, self-attested soft copies:')}
            </p>

            <div className="space-y-2.5">
              {scholarship.documents.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <label
                    key={idx}
                    onClick={() => toggleDocCheck(idx)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/80 dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] hover:border-[#065F46] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                    />
                    <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-stone-400 dark:text-stone-500 font-normal' : 'text-stone-700 dark:text-stone-200 font-medium'}`}>
                      {doc}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>{t('detail.documentDisclaimer', undefined, 'Document requirements can vary. Check the official scholarship instructions before submitting your application.')}</span>
            </div>
          </section>

          {/* 9. HOW TO APPLY */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial mb-4">
              {t('detail.howToApplyTitle', undefined, 'How to Apply')}
            </h2>
            {scholarship.howToApplySteps && scholarship.howToApplySteps.length > 0 ? (
              <ol className="space-y-3.5">
                {scholarship.howToApplySteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                    <span className="w-6 h-6 rounded-full bg-[#064E3B] text-amber-100 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t('detail.howToApplyUnavailable', undefined, 'The detailed application process is not available in Edvora’s verified dataset. Please follow instructions on the official portal.')}
              </p>
            )}
          </section>

          {/* 11. WHY THIS MATCHES YOU (Detailed Breakdown) */}
          {matchResult && (
            <section id="why-this-matches" className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-[#064E3B] dark:text-white font-editorial">
                  {t('detail.whyThisMatches', undefined, 'Why This Matches You')}
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                {t('detail.basedOnSession', undefined, 'Based on your current session answers')}
              </p>

              <div className="space-y-3">
                {matchResult.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-[#182E29] border border-stone-200/70 dark:border-[#23453E] text-xs flex items-start gap-3"
                  >
                    {check.status === 'matched' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'warning' && (
                      <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {check.status === 'unmatched' && (
                      <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 dark:text-stone-200 block text-xs sm:text-sm">
                        {check.label}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed block mt-0.5">
                        {check.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 12. BEFORE YOU APPLY (Trust & Advisory) */}
          <section className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-8 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-editorial mb-1">
              {t('detail.beforeYouApply', undefined, 'Before You Apply')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              {t('detail.beforeYouApplySubtitle', undefined, 'Key things to double check to avoid application rejection.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</span>
                <span>{t('detail.checkPoint1', undefined, 'Verify the latest deadlines and eligibility guidelines on the official portal.')}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</span>
                <span>{t('detail.checkPoint2', undefined, 'Ensure your income certificate, caste certificate, and marksheets are valid for the current academic year.')}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</span>
                <span>{t('detail.checkPoint3', undefined, 'Confirm that your student name, date of birth, and bank account match your Aadhaar card exactly.')}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#182E29] border border-stone-200/60 dark:border-[#23453E] flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">4</span>
                <span>{t('detail.checkPoint4', undefined, 'Link your bank account with Aadhaar (DBT active) to receive direct benefit transfers without delay.')}</span>
              </div>
            </div>
          </section>

          {/* 13. READY TO APPLY? (Official Source Banner) */}
          <section className="bg-gradient-to-br from-[#064E3B] to-[#043326] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800">
            <h2 className="text-xl sm:text-2xl font-bold font-editorial">
              {t('detail.readyToApply', undefined, 'Ready to Apply?')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed max-w-xl">
              {t('detail.readyToApplySubtitle', undefined, 'Continue directly to the official government or provider portal to submit your application.')}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <a
                href={scholarship.applicationWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                <span>{t('detail.applyOfficial', undefined, 'Apply on Official Portal')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={scholarship.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-emerald-600 hover:bg-emerald-900/60 text-emerald-100 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('detail.viewOfficialSource', undefined, 'View Official Source')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Official Domain:{' '}
                  <strong className="text-white font-mono text-[11px]">
                    {new URL(scholarship.officialWebsite).hostname}
                  </strong>
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                {t('detail.sourceDisclaimer', undefined, 'Scholarship information can change. Always verify latest details with the official scholarship authority.')}
              </p>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column (30%) */}
        <div className="space-y-6">
          {/* Ask Edvora AI Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50/60 dark:from-[#142420] dark:to-[#182E29] rounded-3xl p-6 border border-emerald-200/80 dark:border-emerald-800/60 shadow-md">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white font-editorial text-base">
                  {t('ai.askEdvoraAI', undefined, 'Ask Edvora AI')}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase tracking-wider">
                  Interactive Guide
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              {t('ai.getGuideSubtitle', undefined, 'Get a complete step-by-step guide to this scholarship.')}
            </p>
            <button
              onClick={() => openScholarshipAI(scholarship.id)}
              className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#075944] text-amber-100 font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-12" />
              <span>{t('ai.askEdvoraAI', undefined, 'Ask Edvora AI')}</span>
            </button>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate(`ai?scholarshipId=${scholarship.id}`);
                } else {
                  window.location.hash = `#/ai?scholarshipId=${scholarship.id}`;
                }
              }}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#064E3B] dark:text-emerald-400" />
              <span>{t('aiPage.openInFullAI', undefined, 'Open Full AI')}</span>
            </button>
          </div>

          {/* 10. IMPORTANT DATES CARD */}
          <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs text-sm space-y-3">
            <h3 className="font-bold text-[#064E3B] dark:text-white font-editorial flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{t('detail.importantDatesTitle', undefined, 'Important Dates')}</span>
            </h3>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-[#1E3A33]">
                <span className="text-stone-400">{t('detail.openDate', undefined, 'Applications Open')}:</span>
                <span className="font-semibold text-slate-800 dark:text-stone-200">
                  {formatDate(scholarship.applicationStart)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-[#1E3A33]">
                <span className="text-stone-400">{t('detail.deadline', undefined, 'Application Deadline')}:</span>
                <span className="font-semibold text-slate-800 dark:text-stone-200">
                  {formatDate(scholarship.applicationDeadline)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-400">{t('detail.currentStatus', undefined, 'Current Status')}:</span>
                <StatusBadge
                  deadline={scholarship.applicationDeadline}
                  startDate={scholarship.applicationStart}
                  overrideStatus={scholarship.status}
                />
              </div>
            </div>
          </div>

          {/* Scheme Quick Details */}
          <div className="p-5 rounded-3xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-200 dark:border-[#23453E] text-xs text-stone-600 dark:text-stone-300 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-stone-400">{t('detail.type', undefined, 'Scheme Type')}:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{scholarship.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">{t('detail.region', undefined, 'Region')}:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{scholarship.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">{t('detail.lastUpdated', undefined, 'Last Verified')}:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{formatDate(scholarship.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 14. RELATED SCHOLARSHIPS ("You May Also Be Interested In")                */}
      {/* ========================================================================= */}
      {relatedScholarships.length > 0 && (
        <section className="mt-12 sm:mt-16 pt-8 border-t border-stone-200/80 dark:border-[#1E3A33]">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100">
              {t('detail.relatedScholarships', undefined, 'You May Also Be Interested In')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t(
                'detail.relatedScholarshipsSubtitle',
                undefined,
                'Other verified scholarships matching similar education levels, streams, or eligibility criteria.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedScholarships.map((related) => (
              <ScholarshipCard
                key={related.id}
                scholarship={related}
                showMatchStatus={false}
                onViewDetails={(slug) => {
                  if (onNavigate) {
                    onNavigate(`scholarships/${slug}`);
                  } else {
                    window.location.hash = `#/scholarships/${slug}`;
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 15. STICKY QUICK ACTION BAR (Visible on Scroll)                           */}
      {/* ========================================================================= */}
      {showStickyBar && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-2xl p-2.5 sm:px-4 border border-[#DFD8CC] dark:border-[#23453E] shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="min-w-0 flex-1">
            <h4 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
              {scholarship.name}
            </h4>
            <span className="text-[11px] text-[#064E3B] dark:text-emerald-400 font-semibold block truncate">
              {scholarship.benefits.amountDescription}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openScholarshipAI(scholarship.id)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#075944] text-amber-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              title={t('ai.askEdvoraAI', undefined, 'Ask Edvora AI')}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('ai.askEdvoraAI', undefined, 'Ask AI')}</span>
            </button>

            {scholarship.applicationWebsite && (
              <a
                href={scholarship.applicationWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>{t('common.applyNow', undefined, 'Apply')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

