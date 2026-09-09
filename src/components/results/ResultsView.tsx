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
} from 'lucide-react';

interface ResultsViewProps {
  results: MatchResult[];
  answers: StudentAnswers;
  onRetake: () => void;
  onExploreAll: () => void;
  onViewScholarshipDetails: (slug: string) => void;
}

type SortOption = 'recommended' | 'deadline' | 'updated' | 'benefit';
type StatusFilter = 'all' | 'Open' | 'Opening Soon' | 'Closed';

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  answers,
  onRetake,
  onExploreAll,
  onViewScholarshipDetails,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [educationFilter, setEducationFilter] = useState<'current' | 'all'>('current');
  const [locationFilter, setLocationFilter] = useState<'all' | 'Gujarat' | 'All India'>('all');
  const [isNotEligibleExpanded, setIsNotEligibleExpanded] = useState(false);

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

  useEffect(() => {
    if (strongMatches.length > 0) {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#047857', '#F59E0B', '#D97706'],
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [strongMatches.length]);

  const processGroup = (items: MatchResult[]) => {
    let filtered = [...items];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.scholarship.status === statusFilter);
    }

    if (educationFilter === 'current') {
      filtered = filtered.filter((item) =>
        item.scholarship.educationLevels.includes(answers.educationLevel)
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter((item) => item.scholarship.state === locationFilter);
    }

    filtered.sort((a, b) => {
      if (sortOption === 'deadline') {
        return (
          new Date(a.scholarship.applicationDeadline).getTime() -
          new Date(b.scholarship.applicationDeadline).getTime()
        );
      }
      if (sortOption === 'updated') {
        return (
          new Date(b.scholarship.lastUpdated).getTime() -
          new Date(a.scholarship.lastUpdated).getTime()
        );
      }
      if (sortOption === 'benefit') {
        const valA = a.scholarship.benefits.maxAnnualAmount || 0;
        const valB = b.scholarship.benefits.maxAnnualAmount || 0;
        return valB - valA;
      }
      return 0; // recommended
    });

    return filtered;
  };

  const processedStrong = useMemo(() => processGroup(strongMatches), [
    strongMatches,
    statusFilter,
    educationFilter,
    locationFilter,
    sortOption,
  ]);

  const processedPossible = useMemo(() => processGroup(possibleMatches), [
    possibleMatches,
    statusFilter,
    educationFilter,
    locationFilter,
    sortOption,
  ]);

  const processedNotEligible = useMemo(() => processGroup(notEligibleMatches), [
    notEligibleMatches,
    statusFilter,
    educationFilter,
    locationFilter,
    sortOption,
  ]);

  const totalPotentiallyEligible = strongMatches.length + possibleMatches.length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* 1. Summary Card */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#0A261E] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#0B5441] mb-8 sm:mb-12 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 text-amber-300 text-xs font-bold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eligibility Matching Results</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-editorial">
            We found scholarships for you
          </h1>
          <p className="text-sm sm:text-base text-stone-200 mt-2 leading-relaxed font-normal">
            Based on the information provided ({answers.location} · {answers.educationLevel} · {answers.category}), we found{' '}
            <strong className="text-amber-300 font-bold">
              {totalPotentiallyEligible} {totalPotentiallyEligible === 1 ? 'scholarship' : 'scholarships'}
            </strong>{' '}
            that may match your eligibility.
          </p>

          {/* Interactive Statistics Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 max-w-lg">
            {/* Strong Matches */}
            <button
              onClick={() => scrollToSection('strong-matches-section')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-emerald-400/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {strongMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">Close Match</span>
            </button>

            {/* Possible Matches */}
            <button
              onClick={() => scrollToSection('possible-matches-section')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-amber-400/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Possible</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {possibleMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">Needs Check</span>
            </button>

            {/* Not Eligible */}
            <button
              onClick={() => {
                setIsNotEligibleExpanded(true);
                setTimeout(() => scrollToSection('not-eligible-section'), 100);
              }}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-stone-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                <XCircle className="w-4 h-4" />
                <span>Not Eligible</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {notEligibleMatches.length}
              </div>
              <span className="text-[10px] text-stone-300 block">Unsatisfied</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
            <span className="italic">
              &quot;You appear eligible based on the information provided. Final eligibility is determined by the scholarship authority.&quot;
            </span>
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white font-semibold transition-colors focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Edit Answers</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls: Lightweight Filter & Sort */}
      <div className="bg-white dark:bg-[#142420] rounded-2xl p-4 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#065F46]" />
            Status:
          </span>
          {(['all', 'Open', 'Opening Soon', 'Closed'] as StatusFilter[]).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#064E3B] text-amber-50'
                  : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#23453E]'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}

          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-200 dark:border-stone-700">
            <span className="font-bold text-stone-500">Location:</span>
            {(['all', 'Gujarat', 'All India'] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  locationFilter === loc
                    ? 'bg-[#064E3B] text-amber-50'
                    : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#23453E]'
                }`}
              >
                {loc === 'all' ? 'All' : loc}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-200 dark:border-stone-700">
            <span className="font-bold text-stone-500">Education:</span>
            <button
              onClick={() => setEducationFilter('current')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                educationFilter === 'current'
                  ? 'bg-[#064E3B] text-amber-50'
                  : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300'
              }`}
            >
              {answers.educationLevel}
            </button>
            <button
              onClick={() => setEducationFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                educationFilter === 'all'
                  ? 'bg-[#064E3B] text-amber-50'
                  : 'bg-stone-100 dark:bg-[#1C3630] text-stone-700 dark:text-stone-300'
              }`}
            >
              All Levels
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="font-bold text-stone-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] text-slate-800 dark:text-stone-200 font-semibold focus:outline-none"
          >
            <option value="recommended">Recommended (Best Fit)</option>
            <option value="deadline">Deadline Soon</option>
            <option value="updated">Recently Updated</option>
            <option value="benefit">Highest Benefit</option>
          </select>
        </div>
      </div>

      {/* 3. SECTION: ⭐ STRONG MATCHES (Primary Section) */}
      <div id="strong-matches-section" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-editorial">
              <span>⭐ Strong Matches</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-[#132A24] text-[#065F46] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                {processedStrong.length}
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              All known hard eligibility requirements are satisfied based on your answers.
            </p>
          </div>
        </div>

        {processedStrong.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedStrong.map((res) => (
              <ScholarshipCard
                key={res.scholarshipId}
                scholarship={res.scholarship}
                matchResult={res}
                onViewDetails={onViewScholarshipDetails}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-stone-100/70 dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] text-center max-w-lg mx-auto">
            <HelpCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-stone-200">
              No exact matches yet
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              We couldn&apos;t find an exact 100% hard match for your current answers, but we found scholarships below that may be worth checking!
            </p>
            {possibleMatches.length > 0 && (
              <button
                onClick={() => scrollToSection('possible-matches-section')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#064E3B] text-amber-50 text-xs font-bold transition-colors"
              >
                View Possible Matches ({possibleMatches.length}) ↓
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. SECTION: ⚠ POSSIBLE MATCHES */}
      <div id="possible-matches-section" className="mb-12 pt-8 border-t border-[#E8E2D7] dark:border-[#1E3A33]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-editorial">
              <span>⚠ Possible Matches</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-[#2A2415] text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                {processedPossible.length}
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              These scholarships may be suitable, but one or more eligibility conditions need verification.
            </p>
          </div>
        </div>

        {processedPossible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedPossible.map((res) => (
              <ScholarshipCard
                key={res.scholarshipId}
                scholarship={res.scholarship}
                matchResult={res}
                onViewDetails={onViewScholarshipDetails}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">No additional conditional matches.</p>
        )}
      </div>

      {/* 5. SECTION: ❌ NOT ELIGIBLE (Collapsed) */}
      <div id="not-eligible-section" className="pt-8 border-t border-[#E8E2D7] dark:border-[#1E3A33]">
        <button
          onClick={() => setIsNotEligibleExpanded(!isNotEligibleExpanded)}
          className="w-full p-4 sm:p-5 rounded-2xl bg-stone-100/80 dark:bg-[#142420] hover:bg-stone-200 dark:hover:bg-[#182E29] border border-[#E8E2D7] dark:border-[#1E3A33] text-left transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-rose-500" />
            <div>
              <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-stone-200">
                Not Eligible Scholarships · {notEligibleMatches.length} Opportunities
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Schemes where one or more hard requirements (e.g. domicile, course, income cap) were not satisfied.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400">
            <span>{isNotEligibleExpanded ? 'Hide' : 'Show All'}</span>
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

      {/* Bottom Exploration CTA */}
      <div className="mt-16 text-center p-8 rounded-3xl bg-emerald-50/50 dark:bg-[#142420] border border-emerald-100 dark:border-[#1E3A33]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-editorial">
          Want to browse all opportunities regardless of eligibility?
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Explore the full searchable catalog of scholarships across Gujarat and India.
        </p>
        <button
          onClick={onExploreAll}
          className="mt-4 px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs sm:text-sm font-bold shadow-md shadow-[#064E3B]/20 transition-all inline-flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Explore All Scholarships Directory →</span>
        </button>
      </div>
    </div>
  );
};
