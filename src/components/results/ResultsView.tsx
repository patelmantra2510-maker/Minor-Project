import React, { useState, useMemo, useEffect } from 'react';
import type { MatchResult, StudentAnswers } from '../../types/scholarship';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Compass,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  X,
  MapPin,
  GraduationCap,
  Percent,
  IndianRupee,
  BookOpen,
  Tag,
  User,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAI } from '../../context/AIContext';

interface ResultsViewProps {
  results: MatchResult[];
  answers: StudentAnswers;
  onRetake: () => void;
  onExploreAll: () => void;
  onViewScholarshipDetails: (slug: string) => void;
}

type MatchTab = 'all' | 'strong' | 'possible';
type SortOption = 'recommended' | 'deadline' | 'benefit' | 'az' | 'updated';
type StatusFilter = 'all' | 'Open' | 'Opening Soon' | 'Closed';

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  answers,
  onRetake,
  onExploreAll,
  onViewScholarshipDetails,
}) => {
  const { t } = useLanguage();
  const { openGlobalAI } = useAI();

  const [activeTab, setActiveTab] = useState<MatchTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'Gujarat' | 'All India'>('all');
  const [isNotEligibleExpanded, setIsNotEligibleExpanded] = useState(false);

  const educationLabelMap: Record<string, string> = {
    School: t('questionnaire.step3.school', undefined, 'School'),
    Diploma: t('questionnaire.step3.diploma', undefined, 'Diploma'),
    Undergraduate: t('questionnaire.step3.undergraduate', undefined, 'Undergraduate'),
    Postgraduate: t('questionnaire.step3.postgraduate', undefined, 'Postgraduate'),
    PhD: t('questionnaire.step3.phd', undefined, 'PhD'),
  };

  const categoryLabelMap: Record<string, string> = {
    General: t('questionnaire.step4.general', undefined, 'General'),
    OBC: t('questionnaire.step4.obc', undefined, 'OBC'),
    SC: t('questionnaire.step4.sc', undefined, 'SC'),
    ST: t('questionnaire.step4.st', undefined, 'ST'),
    EWS: t('questionnaire.step4.ews', undefined, 'EWS'),
  };

  const locLabel =
    answers.location === 'Gujarat'
      ? t('common.gujarat', undefined, 'Gujarat')
      : t('questionnaire.step1.otherStates', undefined, 'Other Indian States');
  const eduLabel = educationLabelMap[answers.educationLevel] || answers.educationLevel;
  const catLabel = categoryLabelMap[answers.category] || answers.category;

  const incomeFormatted = useMemo(() => {
    if (!answers.annualIncome) return null;
    if (answers.annualIncome >= 100000) {
      const lakhs = answers.annualIncome / 100000;
      return `≤ ₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)} Lakh`;
    }
    return `≤ ₹${answers.annualIncome.toLocaleString('en-IN')}`;
  }, [answers.annualIncome]);

  // Group results strictly into 3 categories
  const strongMatches = useMemo(
    () => results.filter((r) => r.status === 'strong_match'),
    [results]
  );
  const possibleMatches = useMemo(
    () => results.filter((r) => r.status === 'possible_match'),
    [results]
  );
  const notEligibleMatches = useMemo(
    () => results.filter((r) => r.status === 'not_eligible'),
    [results]
  );

  const totalPotentiallyEligible = strongMatches.length + possibleMatches.length;

  useEffect(() => {
    if (strongMatches.length > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#047857', '#F59E0B', '#D97706', '#10B981'],
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [strongMatches.length]);

  // Filtering & Sorting
  const filterAndSort = (items: MatchResult[]) => {
    let filtered = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const s = item.scholarship;
        return (
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          s.courses.some((course) => course.toLowerCase().includes(q)) ||
          s.state.toLowerCase().includes(q)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.scholarship.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((item) => item.scholarship.state === locationFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortOption === 'recommended') {
        // Strong matches first
        if (a.status !== b.status) {
          if (a.status === 'strong_match') return -1;
          if (b.status === 'strong_match') return 1;
        }
        // Then soonest deadline
        return (
          new Date(a.scholarship.applicationDeadline).getTime() -
          new Date(b.scholarship.applicationDeadline).getTime()
        );
      }
      if (sortOption === 'deadline') {
        return (
          new Date(a.scholarship.applicationDeadline).getTime() -
          new Date(b.scholarship.applicationDeadline).getTime()
        );
      }
      if (sortOption === 'benefit') {
        const valA = a.scholarship.benefits.maxAnnualAmount || 0;
        const valB = b.scholarship.benefits.maxAnnualAmount || 0;
        return valB - valA;
      }
      if (sortOption === 'az') {
        return a.scholarship.name.localeCompare(b.scholarship.name);
      }
      if (sortOption === 'updated') {
        return (
          new Date(b.scholarship.lastUpdated).getTime() -
          new Date(a.scholarship.lastUpdated).getTime()
        );
      }
      return 0;
    });

    return filtered;
  };

  const processedStrong = useMemo(
    () => filterAndSort(strongMatches),
    [strongMatches, searchQuery, statusFilter, locationFilter, sortOption]
  );

  const processedPossible = useMemo(
    () => filterAndSort(possibleMatches),
    [possibleMatches, searchQuery, statusFilter, locationFilter, sortOption]
  );

  const processedNotEligible = useMemo(
    () => filterAndSort(notEligibleMatches),
    [notEligibleMatches, searchQuery, statusFilter, locationFilter, sortOption]
  );

  const displayedMatches = useMemo(() => {
    if (activeTab === 'strong') return processedStrong;
    if (activeTab === 'possible') return processedPossible;
    // 'all' combines both with strong first
    return filterAndSort([...strongMatches, ...possibleMatches]);
  }, [activeTab, processedStrong, processedPossible, strongMatches, possibleMatches, searchQuery, statusFilter, locationFilter, sortOption]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#0A261E] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#0B5441] mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 text-amber-300 text-xs font-bold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase">
              {t('results.heroEyebrow', undefined, 'YOUR SCHOLARSHIP RESULTS')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-editorial">
            {t('results.foundTitle', undefined, 'Scholarships that may fit you')}
          </h1>

          <p className="text-sm sm:text-base text-stone-200 mt-2 leading-relaxed font-normal">
            {t('results.summaryText', {
              location: locLabel,
              level: eduLabel,
              category: catLabel,
              count: String(totalPotentiallyEligible),
            })}
          </p>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 max-w-lg">
            {/* Strong Matches */}
            <button
              onClick={() => {
                setActiveTab('strong');
                scrollToSection('results-listing-section');
              }}
              className={`p-3.5 rounded-2xl text-left transition-all group cursor-pointer border ${
                activeTab === 'strong'
                  ? 'bg-emerald-500/25 border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-white/10 hover:bg-white/15 border-emerald-400/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('results.strongLabel', undefined, 'Strong')}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {strongMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">
                {t('results.closeMatch', undefined, 'Close Match')}
              </span>
            </button>

            {/* Possible Matches */}
            <button
              onClick={() => {
                setActiveTab('possible');
                scrollToSection('results-listing-section');
              }}
              className={`p-3.5 rounded-2xl text-left transition-all group cursor-pointer border ${
                activeTab === 'possible'
                  ? 'bg-amber-500/25 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white/10 hover:bg-white/15 border-amber-400/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('results.possibleLabel', undefined, 'Possible')}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {possibleMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">
                {t('results.needsCheck', undefined, 'Needs Check')}
              </span>
            </button>

            {/* Not Eligible */}
            <button
              onClick={() => {
                setIsNotEligibleExpanded(true);
                setTimeout(() => scrollToSection('not-eligible-section'), 100);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-stone-500/30 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                <XCircle className="w-4 h-4" />
                <span>{t('results.notEligibleLabel', undefined, 'Not Eligible')}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {notEligibleMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">
                {t('results.unmetCriteria', undefined, 'Unmet Criteria')}
              </span>
            </button>
          </div>

          {/* AI Helper Bar */}
          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-200">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {t('results.aiHelperPrompt', undefined, 'Need help choosing or understanding your options?')}
              </span>
            </div>
            <button
              onClick={() => openGlobalAI()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#064E3B] font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{t('results.aiHelperBtn', undefined, 'Ask Edvora AI')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SESSION ANSWERS SUMMARY CHIP BAR */}
      <div className="bg-white dark:bg-[#142420] rounded-2xl p-4 sm:p-5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
            {t('results.sessionBadgePrefix', undefined, 'Based on your current session answers')}:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {/* Location */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E]">
              <MapPin className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
              {locLabel}
            </span>

            {/* Education Level */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E]">
              <GraduationCap className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
              {eduLabel}
            </span>

            {/* Category */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E]">
              <User className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
              {catLabel}
            </span>

            {/* Academic Score */}
            {answers.academicPercentage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Percent className="w-3 h-3" />
                {answers.academicPercentage}%
              </span>
            )}

            {/* Income Ceiling */}
            {incomeFormatted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <IndianRupee className="w-3 h-3" />
                {incomeFormatted}
              </span>
            )}

            {/* Stream */}
            {answers.stream && answers.stream !== 'All Streams' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E]">
                <BookOpen className="w-3 h-3 text-[#065F46] dark:text-emerald-400" />
                {answers.stream}
              </span>
            )}
          </div>
        </div>

        {/* Retake / Edit Answers Action */}
        <button
          onClick={onRetake}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#065F46] dark:text-emerald-300 bg-emerald-50 dark:bg-[#1C3630] hover:bg-emerald-100 dark:hover:bg-[#23453E] border border-emerald-200 dark:border-[#23453E] transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('results.editAnswers', undefined, 'Edit Answers')}</span>
        </button>
      </div>

      {/* 3. CONTROLS: SEGMENTED TABS, IN-RESULTS SEARCH, FILTERS & SORT */}
      <div id="results-listing-section" className="space-y-4 mb-8">
        {/* Segmented Match Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33]">
            {/* Tab: All Matches */}
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-[#064E3B] text-amber-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{t('results.allMatchesTab', undefined, 'All Matches')}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'all'
                    ? 'bg-emerald-700/60 text-amber-200'
                    : 'bg-stone-200 dark:bg-[#1E3A33] text-stone-600 dark:text-stone-400'
                }`}
              >
                {totalPotentiallyEligible}
              </span>
            </button>

            {/* Tab: Strong Matches */}
            <button
              onClick={() => setActiveTab('strong')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'strong'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('results.strongMatchesTab', undefined, 'Strong Matches')}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'strong'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-200 dark:bg-[#1E3A33] text-stone-600 dark:text-stone-400'
                }`}
              >
                {strongMatches.length}
              </span>
            </button>

            {/* Tab: Possible Matches */}
            <button
              onClick={() => setActiveTab('possible')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'possible'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('results.possibleMatchesTab', undefined, 'Possible Matches')}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'possible'
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-200 dark:bg-[#1E3A33] text-stone-600 dark:text-stone-400'
                }`}
              >
                {possibleMatches.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {t('results.showingCount', { count: String(displayedMatches.length) })}
          </div>
        </div>

        {/* Search, Status Filter & Sort Row */}
        <div className="bg-white dark:bg-[#142420] rounded-2xl p-4 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs flex flex-wrap items-center justify-between gap-4">
          {/* In-results Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('results.searchPlaceholder', undefined, 'Search within your matching scholarships...')}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 focus:outline-none focus:border-[#065F46] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                title={t('results.clearSearch', undefined, 'Clear Search')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#065F46]" />
                {t('results.filterStatus', undefined, 'Status')}:
              </span>
              {(['all', 'Open', 'Opening Soon', 'Closed'] as StatusFilter[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#064E3B] text-amber-50'
                      : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#23453E]'
                  }`}
                >
                  {st === 'all'
                    ? t('results.filterAll', undefined, 'All')
                    : st === 'Open'
                    ? t('results.filterOpen', undefined, 'Open')
                    : st === 'Opening Soon'
                    ? t('results.filterOpeningSoon', undefined, 'Opening Soon')
                    : t('results.filterClosed', undefined, 'Closed')}
                </button>
              ))}
            </div>

            {/* Region / Location Filter */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#065F46]" />
                {t('common.region', undefined, 'Region')}:
              </span>
              {(['all', 'Gujarat', 'All India'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    locationFilter === loc
                      ? 'bg-[#064E3B] text-amber-50'
                      : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#23453E]'
                  }`}
                >
                  {loc === 'all' ? t('common.all', undefined, 'All') : loc === 'Gujarat' ? t('common.gujarat', undefined, 'Gujarat') : t('common.allIndia', undefined, 'All India')}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-700">
              <label className="font-bold text-stone-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                {t('results.sortBy', undefined, 'Sort')}:
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="recommended">{t('results.sortRecommended', undefined, 'Recommended')}</option>
                <option value="deadline">{t('results.sortDeadline', undefined, 'Deadline Soon')}</option>
                <option value="benefit">{t('results.sortBenefit', undefined, 'Highest Benefit')}</option>
                <option value="az">{t('results.sortAZ', undefined, 'A – Z')}</option>
                <option value="updated">{t('results.sortRecentlyUpdated', undefined, 'Recently Updated')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SCHOLARSHIP CARDS LISTING OR EMPTY STATES */}
      {displayedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedMatches.map((res) => (
            <ScholarshipCard
              key={res.scholarshipId}
              scholarship={res.scholarship}
              matchResult={res}
              onViewDetails={onViewScholarshipDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-100/80 dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] text-center max-w-lg mx-auto mb-12 animate-in fade-in">
          {activeTab === 'strong' && strongMatches.length === 0 ? (
            <>
              <HelpCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-stone-200 font-editorial">
                {t('results.noExactMatch', undefined, 'No exact matches yet')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                {t(
                  'results.noExactMatchDesc',
                  undefined,
                  "We couldn't find an exact 100% hard match for your current answers, but we found scholarships below that may be worth checking!"
                )}
              </p>
              {possibleMatches.length > 0 && (
                <button
                  onClick={() => setActiveTab('possible')}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053F30] text-amber-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {t('results.viewPossible', { count: String(possibleMatches.length) })}
                </button>
              )}
            </>
          ) : searchQuery ? (
            <>
              <Search className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-stone-200">
                {t('results.emptyStateTabTitle', undefined, 'No scholarships found')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                No scholarships match &quot;{searchQuery}&quot;. Try clearing your query or adjusting filters.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#1C3630] text-slate-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                {t('results.clearSearch', undefined, 'Clear Search')}
              </button>
            </>
          ) : (
            <>
              <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-stone-200">
                {t('results.emptyStateAllTitle', undefined, 'No matching scholarships found')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {t(
                  'results.emptyStateAllDesc',
                  undefined,
                  'None of the scholarships matched your specific combination of answers. You can edit your session answers or explore all available scholarships.'
                )}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onRetake}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] text-amber-50 text-xs font-bold hover:bg-[#053F30] transition-colors cursor-pointer"
                >
                  {t('results.editAnswers', undefined, 'Edit Answers')}
                </button>
                <button
                  onClick={onExploreAll}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#1C3630] text-slate-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  {t('results.exploreAllBtn', undefined, 'Explore All')}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. COLLAPSIBLE NOT ELIGIBLE SECTION */}
      {notEligibleMatches.length > 0 && (
        <div id="not-eligible-section" className="pt-8 border-t border-[#E8E2D7] dark:border-[#1E3A33]">
          <button
            onClick={() => setIsNotEligibleExpanded(!isNotEligibleExpanded)}
            className="w-full p-4 sm:p-5 rounded-2xl bg-stone-100/80 dark:bg-[#142420] hover:bg-stone-200 dark:hover:bg-[#182E29] border border-[#E8E2D7] dark:border-[#1E3A33] text-left transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-stone-200">
                  {t('results.notEligibleHeading', undefined, 'Scholarships You Do Not Currently Match')} · {notEligibleMatches.length}
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {t(
                    'results.notEligibleDesc',
                    undefined,
                    'These scholarships have requirements (income, percentage, domicile, or gender) that differ from your provided answers.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 shrink-0">
              <span>
                {isNotEligibleExpanded
                  ? t('results.hideSchemes', { count: String(notEligibleMatches.length) })
                  : t('results.showSchemes', { count: String(notEligibleMatches.length) })}
              </span>
              {isNotEligibleExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {isNotEligibleExpanded && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
              {processedNotEligible.map((res) => (
                <ScholarshipCard
                  key={res.scholarshipId}
                  scholarship={res.scholarship}
                  matchResult={res}
                  onViewDetails={onViewScholarshipDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. BOTTOM EXPLORATION DIRECTORY CTA */}
      <div className="mt-16 text-center p-8 sm:p-10 rounded-3xl bg-emerald-50/50 dark:bg-[#142420] border border-emerald-100 dark:border-[#1E3A33]">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-editorial">
          {t('results.browseAllHeading', undefined, 'Want to browse all opportunities regardless of eligibility?')}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl mx-auto">
          {t('results.browseAllDesc', undefined, 'Explore the full searchable catalog of scholarships across Gujarat and India.')}
        </p>
        <button
          onClick={onExploreAll}
          className="mt-5 px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs sm:text-sm font-bold shadow-md shadow-[#064E3B]/20 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>{t('results.exploreAllBtn', undefined, 'Explore All Scholarships')} →</span>
        </button>
      </div>
    </div>
  );
};

