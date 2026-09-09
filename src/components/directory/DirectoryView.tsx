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
} from 'lucide-react';

interface DirectoryViewProps {
  initialLocationFilter?: 'Gujarat' | 'All India' | 'all';
  pageTitle?: string;
  pageSubtitle?: string;
  onViewScholarshipDetails: (slug: string) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  initialLocationFilter = 'all',
  pageTitle = 'Explore Scholarships',
  pageSubtitle = 'Search and filter across Gujarat government and popular national scholarships.',
  onViewScholarshipDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'Gujarat' | 'All India'>(
    initialLocationFilter
  );
  const [educationFilter, setEducationFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter(initialLocationFilter);
    setEducationFilter('all');
    setCategoryFilter('all');
    setGenderFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const filteredScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((s) => {
      // 1. Search keyword query
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

      // 2. Location
      if (locationFilter !== 'all' && s.state !== locationFilter) {
        return false;
      }

      // 3. Education
      if (educationFilter !== 'all') {
        if (!s.educationLevels.includes(educationFilter as EducationLevel)) {
          return false;
        }
      }

      // 4. Category
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
      if (typeFilter !== 'all' && s.type !== typeFilter) {
        return false;
      }

      // 7. Status
      if (statusFilter !== 'all' && s.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [
    searchTerm,
    locationFilter,
    educationFilter,
    categoryFilter,
    genderFilter,
    typeFilter,
    statusFilter,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    locationFilter !== initialLocationFilter ||
    educationFilter !== 'all' ||
    categoryFilter !== 'all' ||
    genderFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Header & Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {pageSubtitle}
        </p>
      </div>

      {/* Live Search Bar */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by scholarship name, provider, course (e.g. computer, medical, diploma), or keyword..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Faceted Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Location Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Locations</option>
              <option value="Gujarat">Gujarat</option>
              <option value="All India">All India</option>
            </select>
          </div>

          {/* Education Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Education Level
            </label>
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
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

          {/* Category Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="SEBC/OBC">SEBC/OBC</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female Only</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Scholarship Type Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Scholarship Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Government">Government</option>
              <option value="Merit">Merit</option>
              <option value="Private">Private CSR</option>
              <option value="Special">Special Needs</option>
            </select>
          </div>

          {/* Application Status Filter */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Application Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Opening Soon">Opening Soon</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Showing <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredScholarships.length}</span> scholarships
        </p>
      </div>

      {/* Scholarship Cards Grid */}
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
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No scholarships matched your filter criteria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try clearing some filters or searching with a different keyword.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
