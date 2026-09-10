import React, { useState, useMemo, useEffect } from 'react';
import type { EducationLevel } from '../../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import {
  Search,
  Filter,
  X,
  Sparkles,
  RotateCcw,
  MapPin,
  Compass,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAI } from '../../context/AIContext';

interface DirectoryViewProps {
  initialLocationTab?: 'all' | 'Gujarat' | 'All India';
  initialCategoryFilter?: string;
  initialEducationFilter?: string;
  initialGenderFilter?: string;
  initialTypeFilter?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  onViewScholarshipDetails: (slug: string) => void;
  onNavigate?: (route: string) => void;
}

type SortOption = 'recommended' | 'deadline' | 'updated' | 'benefit' | 'az';

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  initialLocationTab = 'all',
  initialCategoryFilter = 'all',
  initialEducationFilter = 'all',
  initialGenderFilter = 'all',
  initialTypeFilter = 'all',
  pageTitle,
  pageSubtitle,
  onViewScholarshipDetails,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { openGlobalAI } = useAI();

  const heroEyebrow = t('directory.heroEyebrow', undefined, 'EXPLORE SCHOLARSHIPS');
  const heroHeading = pageTitle || t('directory.heroHeading', undefined, 'Find Scholarships Worth Exploring');
  const heroDescription =
    pageSubtitle ||
    t(
      'directory.heroDescription',
      undefined,
      'Browse scholarships across Gujarat and India, then filter them by what matters to you.'
    );

  const [searchTerm, setSearchTerm] = useState('');
  const [locationTab, setLocationTab] = useState<'all' | 'Gujarat' | 'All India'>(initialLocationTab);
  const [educationFilter, setEducationFilter] = useState<string>(initialEducationFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter);
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>(initialGenderFilter);
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');

  const [isDesktopFilterExpanded, setIsDesktopFilterExpanded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync initial props if they change (e.g. clicking category on home)
  useEffect(() => {
    if (initialLocationTab) setLocationTab(initialLocationTab);
    if (initialCategoryFilter) setCategoryFilter(initialCategoryFilter);
    if (initialEducationFilter) setEducationFilter(initialEducationFilter);
    if (initialGenderFilter) setGenderFilter(initialGenderFilter);
    if (initialTypeFilter) setTypeFilter(initialTypeFilter);
  }, [initialLocationTab, initialCategoryFilter, initialEducationFilter, initialGenderFilter, initialTypeFilter]);

  // Keyboard shortcut: Escape clears search or closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileFilterOpen) {
          setIsMobileFilterOpen(false);
        } else if (searchTerm) {
          setSearchTerm('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileFilterOpen, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTab('all');
    setEducationFilter('all');
    setCategoryFilter('all');
    setStreamFilter('all');
    setGenderFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setSortOption('recommended');
  };

  const filteredScholarships = useMemo(() => {
    const list = SCHOLARSHIPS_DATA.filter((s) => {
      // 1. Search Query (Case-insensitive partial matching)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query) || s.shortName.toLowerCase().includes(query);
        const matchesProvider = s.provider.toLowerCase().includes(query);
        const matchesCourses = s.courses.some((c) => c.toLowerCase().includes(query));
        const matchesEducation = s.educationLevels.some((e) => e.toLowerCase().includes(query));
        const matchesTags = s.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesCategories = s.categories.some((c) => c.toLowerCase().includes(query));
        const matchesDesc = s.description.toLowerCase().includes(query);
        const matchesState = s.state.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesProvider &&
          !matchesCourses &&
          !matchesEducation &&
          !matchesTags &&
          !matchesCategories &&
          !matchesDesc &&
          !matchesState
        ) {
          return false;
        }
      }

      // 2. Location Discovery Tab
      if (locationTab !== 'all') {
        if (s.state !== locationTab) {
          return false;
        }
      }

      // 3. Education Level
      if (educationFilter !== 'all') {
        if (!s.educationLevels.includes(educationFilter as EducationLevel)) {
          return false;
        }
      }

      // 4. Social Category
      if (categoryFilter !== 'all') {
        const catList = s.categories as string[];
        if (!catList.includes('All') && !catList.includes(categoryFilter)) {
          return false;
        }
      }

      // 5. Stream / Course
      if (streamFilter !== 'all') {
        const qStream = streamFilter.toLowerCase();
        const matchesStream = s.courses.some((c) => c.toLowerCase().includes(qStream));
        if (!matchesStream) {
          return false;
        }
      }

      // 6. Gender
      if (genderFilter !== 'all') {
        if (s.genderEligibility !== 'All' && s.genderEligibility !== genderFilter) {
          return false;
        }
      }

      // 7. Scholarship Type
      if (typeFilter !== 'all') {
        if (s.type !== typeFilter) {
          return false;
        }
      }

      // 8. Application Status
      if (statusFilter !== 'all') {
        if (s.status !== statusFilter) {
          return false;
        }
      }

      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortOption === 'recommended') {
        // Neutral default: active schemes first, then by deadline
        if (a.status !== b.status) {
          if (a.status === 'Open') return -1;
          if (b.status === 'Open') return 1;
        }
        return (
          new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime()
        );
      }
      if (sortOption === 'deadline') {
        return (
          new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime()
        );
      }
      if (sortOption === 'updated') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      if (sortOption === 'benefit') {
        const valA = a.benefits.maxAnnualAmount || 0;
        const valB = b.benefits.maxAnnualAmount || 0;
        return valB - valA;
      }
      if (sortOption === 'az') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [
    searchTerm,
    locationTab,
    educationFilter,
    categoryFilter,
    streamFilter,
    genderFilter,
    typeFilter,
    statusFilter,
    sortOption,
  ]);

  // Count active filters (excluding location tab which is shown as main discovery pill)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (educationFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (streamFilter !== 'all') count++;
    if (genderFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [educationFilter, categoryFilter, streamFilter, genderFilter, typeFilter, statusFilter]);

  const hasAnyFilterOrSearch =
    searchTerm !== '' ||
    locationTab !== 'all' ||
    activeFiltersCount > 0;

  const navigateToFinder = () => {
    if (onNavigate) {
      onNavigate('find');
    } else {
      window.location.hash = '#/find';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH SUBTLE EDUCATIONAL VISUAL                            */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#0A261E] text-white shadow-xl border border-[#0B5441]">
        {/* Soft background radial ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 text-amber-300 text-xs font-bold mb-3 border border-emerald-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span className="tracking-wide uppercase">{heroEyebrow}</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-editorial text-white">
              {heroHeading}
            </h1>

            {/* Supporting Description */}
            <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed font-normal max-w-xl">
              {heroDescription}
            </p>

            {/* Contextual AI Prompt */}
            <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                {t('directory.aiHelperText', undefined, 'Need help finding the right scholarship?')}
              </span>
              <button
                onClick={() => openGlobalAI()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#064E3B] font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 fill-current" />
                <span>{t('directory.aiHelperBtn', undefined, 'Ask Edvora')}</span>
              </button>
            </div>
          </div>

          {/* Subtle Educational Hero Decorative Element (Folded Certificate & Discovery Trail) */}
          <div className="hidden md:flex items-center justify-center shrink-0 pr-4 pointer-events-none select-none opacity-85">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft Radial Ambient */}
              <circle cx="70" cy="70" r="60" fill="url(#heroDecorGlow)" opacity="0.4" />
              <defs>
                <radialGradient id="heroDecorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#065F46" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Discovery Orbit Arc */}
              <circle cx="70" cy="70" r="54" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />

              {/* Folded Paper Card */}
              <g transform="translate(32, 26)">
                <rect x="0" y="0" width="76" height="92" rx="6" fill="#0A261E" stroke="#10B981" strokeWidth="1.5" />
                <path d="M 54,0 L 76,22 L 76,92 L 0,92 L 0,0 Z" fill="#064E3B" />
                <path d="M 54,0 L 54,22 L 76,22" stroke="#10B981" strokeWidth="1.2" fill="#043D2E" />

                {/* Content lines */}
                <line x1="14" y1="32" x2="48" y2="32" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="14" y1="44" x2="62" y2="44" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="14" y1="54" x2="52" y2="54" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="14" y1="64" x2="38" y2="64" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                {/* Golden Verified Seal */}
                <circle cx="52" cy="74" r="10" fill="#F59E0B" opacity="0.9" />
                <circle cx="52" cy="74" r="7" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 49,74 L 51,76 L 56,71" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Sparkle */}
              <path d="M 112,24 L 114,31 L 121,33 L 114,35 L 112,42 L 110,35 L 103,33 L 110,31 Z" fill="#FBBF24" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DISCOVERY LOCATION TABS                                                */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#E8E2D7] dark:border-[#1E3A33] pb-3">
        {(
          [
            { key: 'all', label: t('directory.allTab', undefined, 'All Scholarships') },
            { key: 'Gujarat', label: t('directory.gujaratTab', undefined, 'Gujarat State') },
            { key: 'All India', label: t('directory.indiaTab', undefined, 'All India') },
          ] as { key: 'all' | 'Gujarat' | 'All India'; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setLocationTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              locationTab === tab.key
                ? 'bg-[#064E3B] text-amber-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#142420]'
            }`}
          >
            {tab.key !== 'all' && <MapPin className="w-3.5 h-3.5 text-amber-400" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH & MAIN DISCOVERY CONTROLS ROW                                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 mb-6">
        {/* Prominent Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('directory.searchPlaceholder', undefined, 'Search scholarships by name, course, provider, or keyword...')}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] text-slate-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#065F46] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls: Filter Toggle, Sort, Result Count */}
        <div className="bg-white dark:bg-[#142420] rounded-2xl p-4 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Desktop Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDesktopFilterExpanded(!isDesktopFilterExpanded)}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#E8E2D7] dark:border-[#1E3A33] bg-stone-50 dark:bg-[#1C3630] hover:bg-stone-100 dark:hover:bg-[#23453E] text-slate-800 dark:text-stone-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
              <span>
                {activeFiltersCount > 0
                  ? t('directory.filtersCountBtn', { count: String(activeFiltersCount) })
                  : t('directory.filtersTitle', undefined, 'Filters')}
              </span>
              {activeFiltersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDesktopFilterExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Filter Toggle Button (Opens Sheet) */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#E8E2D7] dark:border-[#1E3A33] bg-stone-50 dark:bg-[#1C3630] text-slate-800 dark:text-stone-200"
            >
              <Filter className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
              <span>
                {activeFiltersCount > 0
                  ? t('directory.filtersCountBtn', { count: String(activeFiltersCount) })
                  : t('directory.filtersTitle', undefined, 'Filters')}
              </span>
              {activeFiltersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Result count */}
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 ml-2">
              {filteredScholarships.length === 1
                ? t('directory.resultsFoundSingular', undefined, '1 scholarship')
                : t('directory.resultsFoundPlural', { count: String(filteredScholarships.length) })}
            </span>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-bold text-stone-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t('directory.sortBy', undefined, 'Sort')}:</span>
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="recommended">{t('directory.recommended', undefined, 'Recommended')}</option>
              <option value="deadline">{t('directory.deadlineSoon', undefined, 'Deadline Soon')}</option>
              <option value="updated">{t('directory.recentlyUpdated', undefined, 'Recently Updated')}</option>
              <option value="benefit">{t('directory.highestBenefit', undefined, 'Highest Benefit')}</option>
              <option value="az">{t('directory.sortAZ', undefined, 'A – Z')}</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ACTIVE FILTERS CHIPS                                                   */}
        {/* ========================================================================= */}
        {hasAnyFilterOrSearch && (
          <div className="flex flex-wrap items-center gap-2 text-xs animate-in fade-in">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
              {t('directory.activeFiltersLabel', undefined, 'Active Filters')}:
            </span>

            {/* Location Tab Chip */}
            {locationTab !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#064E3B]/10 text-[#064E3B] dark:bg-emerald-950/50 dark:text-emerald-300 border border-[#064E3B]/20 font-semibold">
                <span>{locationTab}</span>
                <button
                  onClick={() => setLocationTab('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Search Term Chip */}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-[#1C3630] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-[#23453E] font-semibold">
                <span>&quot;{searchTerm}&quot;</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Education Chip */}
            {educationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#142420] text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                <span>{educationFilter}</span>
                <button
                  onClick={() => setEducationFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Chip */}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#142420] text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                <span>{categoryFilter}</span>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Stream Chip */}
            {streamFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-[#142420] text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                <span>{streamFilter}</span>
                <button
                  onClick={() => setStreamFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Status Chip */}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
                <span>{statusFilter}</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Type Chip */}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E] font-semibold">
                <span>{typeFilter}</span>
                <button
                  onClick={() => setTypeFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Gender Chip */}
            {genderFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E] font-semibold">
                <span>{genderFilter}</span>
                <button
                  onClick={() => setGenderFilter('all')}
                  className="hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear All Action */}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#065F46] dark:text-emerald-400 hover:underline flex items-center gap-1 ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('directory.clearAll', undefined, 'Clear All')}</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. DESKTOP EXPANDABLE FILTER PANEL                                        */}
        {/* ========================================================================= */}
        {isDesktopFilterExpanded && (
          <div className="hidden lg:block bg-white dark:bg-[#142420] rounded-2xl p-5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1E3A33] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400" />
                <span>{t('directory.filterSort', undefined, 'Filter Scholarships')}</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#065F46] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('directory.clearFiltersBtn', undefined, 'Clear All Filters')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Education Level */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.educationLevel', undefined, 'Education Level')}
                </label>
                <select
                  value={educationFilter}
                  onChange={(e) => setEducationFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allLevels', undefined, 'All Levels')}</option>
                  <option value="School">{t('questionnaire.step3.school', undefined, 'School')}</option>
                  <option value="Diploma">{t('questionnaire.step3.diploma', undefined, 'Diploma')}</option>
                  <option value="Undergraduate">{t('questionnaire.step3.undergraduate', undefined, 'Undergraduate')}</option>
                  <option value="Postgraduate">{t('questionnaire.step3.postgraduate', undefined, 'Postgraduate')}</option>
                  <option value="PhD">{t('questionnaire.step3.phd', undefined, 'PhD')}</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.category', undefined, 'Category')}
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allCategories', undefined, 'All Categories')}</option>
                  <option value="General">{t('questionnaire.step4.general', undefined, 'General')}</option>
                  <option value="SC">{t('questionnaire.step4.sc', undefined, 'SC')}</option>
                  <option value="ST">{t('questionnaire.step4.st', undefined, 'ST')}</option>
                  <option value="SEBC/OBC">{t('questionnaire.step4.obc', undefined, 'SEBC/OBC')}</option>
                  <option value="EWS">{t('questionnaire.step4.ews', undefined, 'EWS')}</option>
                </select>
              </div>

              {/* Stream / Field */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.streamCourse', undefined, 'Stream / Field')}
                </label>
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allStreams', undefined, 'All Streams')}</option>
                  <option value="Engineering">Engineering / Tech</option>
                  <option value="Medical">Medical / Healthcare</option>
                  <option value="Sciences">Pure Sciences</option>
                  <option value="Commerce">Commerce / Management</option>
                  <option value="Arts">Arts / Humanities</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
              </div>

              {/* Application Status */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.applicationStatus', undefined, 'Status')}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allStatus', undefined, 'All Status')}</option>
                  <option value="Open">{t('openStatus', undefined, 'Open')}</option>
                  <option value="Opening Soon">{t('openingSoonStatus', undefined, 'Opening Soon')}</option>
                  <option value="Closed">{t('closedStatus', undefined, 'Closed')}</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.scholarshipType', undefined, 'Type')}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allTypes', undefined, 'All Types')}</option>
                  <option value="Government">{t('directory.government', undefined, 'Government')}</option>
                  <option value="Merit">{t('directory.merit', undefined, 'Merit')}</option>
                  <option value="Private">{t('directory.privateCSR', undefined, 'Private CSR')}</option>
                  <option value="Special">{t('directory.special', undefined, 'Special')}</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  {t('directory.gender', undefined, 'Gender')}
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('directory.allGenders', undefined, 'All Genders')}</option>
                  <option value="Female">{t('directory.femaleOnly', undefined, 'Female Only')}</option>
                  <option value="Male">{t('directory.male', undefined, 'Male')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. SCHOLARSHIP CARDS GRID                                                 */}
      {/* ========================================================================= */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onViewDetails={onViewScholarshipDetails}
              showMatchStatus={false}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 sm:py-20 bg-white dark:bg-[#142420] rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] max-w-lg mx-auto mb-12 px-6 animate-in fade-in">
          <Compass className="w-12 h-12 text-stone-400 dark:text-stone-500 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-stone-200 font-editorial">
            {t('directory.noMatchTitle', undefined, 'No scholarships match your filters')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {t(
              'directory.noMatchSubtitle',
              undefined,
              'Try adjusting your search query, location tab, or clearing specific filters.'
            )}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {t('directory.clearFiltersBtn', undefined, 'Clear All Filters')}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EXPLORE → FIND CONNECTION CARD                                         */}
      {/* ========================================================================= */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-[#142420] border border-emerald-100 dark:border-[#1E3A33] flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="max-w-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-[#1E3A33] text-[#065F46] dark:text-emerald-300 text-[11px] font-bold mb-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t('directory.findCtaTitle', undefined, 'Not sure where to start?')}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-editorial">
            {t('directory.findCtaDesc', undefined, 'Answer a few questions and let Edvora find scholarships that may fit you.')}
          </h3>
        </div>

        <button
          onClick={navigateToFinder}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs sm:text-sm font-bold shadow-md shadow-[#064E3B]/15 transition-all cursor-pointer"
        >
          <span>{t('directory.findCtaBtn', undefined, 'Find Scholarships')}</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 8. MOBILE FILTERS BOTTOM SHEET / MODAL                                     */}
      {/* ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-h-[85vh] bg-white dark:bg-[#142420] rounded-t-3xl border-t border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Filter Scholarships"
          >
            {/* Sheet Header */}
            <div className="p-4 border-b border-stone-100 dark:border-[#1E3A33] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span>{t('directory.filtersTitle', undefined, 'Filters')}</span>
                {activeFiltersCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#065F46] dark:text-emerald-300 font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Content (Scrollable) */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Education Level */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  {t('directory.educationLevel', undefined, 'Education Level')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'School', 'Diploma', 'Undergraduate', 'Postgraduate', 'PhD'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEducationFilter(lvl)}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        educationFilter === lvl
                          ? 'bg-[#064E3B] text-amber-50 border-[#064E3B]'
                          : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {lvl === 'all' ? t('directory.allLevels', undefined, 'All') : lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  {t('directory.category', undefined, 'Category')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'General', 'SC', 'ST', 'SEBC/OBC', 'EWS'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-[#064E3B] text-amber-50 border-[#064E3B]'
                          : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {cat === 'all' ? t('directory.allCategories', undefined, 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream / Field */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  {t('directory.streamCourse', undefined, 'Stream / Field')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'all', label: t('directory.allStreams', undefined, 'All Streams') },
                    { key: 'Engineering', label: 'Engineering' },
                    { key: 'Medical', label: 'Medical' },
                    { key: 'Sciences', label: 'Sciences' },
                    { key: 'Commerce', label: 'Commerce' },
                    { key: 'Arts', label: 'Arts' },
                  ].map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStreamFilter(st.key)}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        streamFilter === st.key
                          ? 'bg-[#064E3B] text-amber-50 border-[#064E3B]'
                          : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  {t('directory.applicationStatus', undefined, 'Status')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Open', 'Opening Soon', 'Closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-[#064E3B] text-amber-50 border-[#064E3B]'
                          : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {st === 'all' ? t('directory.allStatus', undefined, 'All') : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  {t('directory.scholarshipType', undefined, 'Type')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Government', 'Merit', 'Private', 'Special'].map((tp) => (
                    <button
                      key={tp}
                      type="button"
                      onClick={() => setTypeFilter(tp)}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        typeFilter === tp
                          ? 'bg-[#064E3B] text-amber-50 border-[#064E3B]'
                          : 'bg-stone-50 dark:bg-[#1C3630] border-stone-200 dark:border-[#23453E] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {tp === 'all' ? t('directory.allTypes', undefined, 'All') : tp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sheet Footer */}
            <div className="p-4 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between gap-3 bg-stone-50 dark:bg-[#142420]">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-rose-600 cursor-pointer"
              >
                {t('directory.clearAll', undefined, 'Clear All')}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {t('directory.showResultsBtn', { count: String(filteredScholarships.length) })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

