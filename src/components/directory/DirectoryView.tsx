import React, { useState, useMemo } from 'react';
import type { EducationLevel } from '../../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import {
  Search,
  Filter,
  X,
  Sparkles,
  Layers,
  RotateCcw,
  MapPin,
} from 'lucide-react';

interface DirectoryViewProps {
  initialLocationTab?: 'all' | 'Gujarat' | 'All India';
  initialCategoryFilter?: string;
  initialEducationFilter?: string;
  initialGenderFilter?: string;
  initialTypeFilter?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  onViewScholarshipDetails: (slug: string) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  initialLocationTab = 'all',
  initialCategoryFilter = 'all',
  initialEducationFilter = 'all',
  initialGenderFilter = 'all',
  initialTypeFilter = 'all',
  pageTitle = 'Explore Scholarships',
  pageSubtitle = 'The single directory for scholarships across Gujarat and India. Search, filter, and discover verified opportunities.',
  onViewScholarshipDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTab, setLocationTab] = useState<'all' | 'Gujarat' | 'All India'>(
    initialLocationTab
  );
  const [educationFilter, setEducationFilter] = useState<string>(initialEducationFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryFilter);
  const [genderFilter, setGenderFilter] = useState<string>(initialGenderFilter);
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [incomeCeilingFilter, setIncomeCeilingFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'recommended' | 'deadline' | 'updated' | 'benefit'>('recommended');

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTab('all');
    setEducationFilter('all');
    setCategoryFilter('all');
    setGenderFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setIncomeCeilingFilter('all');
    setSortOption('recommended');
  };

  const filteredScholarships = useMemo(() => {
    const list = SCHOLARSHIPS_DATA.filter((s) => {
      // 1. Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query) || s.shortName.toLowerCase().includes(query);
        const matchesProvider = s.provider.toLowerCase().includes(query);
        const matchesCourses = s.courses.some((c) => c.toLowerCase().includes(query));
        const matchesEducation = s.educationLevels.some((e) => e.toLowerCase().includes(query));
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = s.description.toLowerCase().includes(query);

        if (!matchesName && !matchesProvider && !matchesCourses && !matchesEducation && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // 2. Location Tab (All, Gujarat, All India)
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

      // 5. Gender
      if (genderFilter !== 'all') {
        if (s.genderEligibility !== 'All' && s.genderEligibility !== genderFilter) {
          return false;
        }
      }

      // 6. Type
      if (typeFilter !== 'all') {
        if (s.type !== typeFilter) {
          return false;
        }
      }

      // 7. Status
      if (statusFilter !== 'all') {
        if (s.status !== statusFilter) {
          return false;
        }
      }

      // 8. Income Ceiling
      if (incomeCeilingFilter !== 'all') {
        const maxInc = parseInt(incomeCeilingFilter, 10);
        if (s.incomeLimit !== null && s.incomeLimit < maxInc) {
          return false;
        }
      }

      return true;
    });

    // Sort
    list.sort((a, b) => {
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
      return 0; // recommended
    });

    return list;
  }, [
    searchTerm,
    locationTab,
    educationFilter,
    categoryFilter,
    genderFilter,
    typeFilter,
    statusFilter,
    incomeCeilingFilter,
    sortOption,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    locationTab !== 'all' ||
    educationFilter !== 'all' ||
    categoryFilter !== 'all' ||
    genderFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    incomeCeilingFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#142420] border border-emerald-200 dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Complete Scholarship Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
          {pageSubtitle}
        </p>
      </div>

      {/* Location Tabs: All · Gujarat · All India */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#E8E2D7] dark:border-[#1E3A33] pb-3">
        {(
          [
            { key: 'all', label: 'All Opportunities' },
            { key: 'Gujarat', label: 'Gujarat Scholarships' },
            { key: 'All India', label: 'All India Scholarships' },
          ] as { key: 'all' | 'Gujarat' | 'All India'; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setLocationTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
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

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search scholarships by name, course (e.g. computer, engineering, medical), provider, or keyword..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] text-slate-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and Sorting Controls */}
      <div className="bg-white dark:bg-[#142420] rounded-2xl p-4 sm:p-5 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#065F46]" />
            Filters & Sorting
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#065F46] dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Education Level */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Education Level
            </label>
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="School">School</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="SEBC/OBC">SEBC/OBC</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Gender
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female Only</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Scholarship Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Government">Government</option>
              <option value="Merit">Merit</option>
              <option value="Need-based">Need-based</option>
              <option value="Private">Private CSR</option>
              <option value="Special">Special Circumstances</option>
            </select>
          </div>

          {/* Application Status */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Application Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Opening Soon">Opening Soon</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Sort By
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-medium focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="deadline">Deadline Soon</option>
              <option value="updated">Recently Updated</option>
              <option value="benefit">Highest Benefit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
          Showing <span className="text-[#065F46] dark:text-emerald-400 font-bold">{filteredScholarships.length}</span> verified scholarships
        </p>
      </div>

      {/* Cards Grid */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-20 bg-white dark:bg-[#142420] rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] max-w-md mx-auto">
          <Layers className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-stone-200">
            No scholarships match your filters
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search query, location tab, or clearing specific filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
