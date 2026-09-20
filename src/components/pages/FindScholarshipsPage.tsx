import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScholarships } from '../../context/ScholarshipContext';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { getCandidateScholarships } from '../../engine/candidateEngine';
import { evaluateScholarshipEligibility } from '../../engine/eligibilityEngine';
import { getField } from '../../engine/fieldRegistry';
import type { Scholarship } from '../../types/scholarship';
import type { ScholarshipEligibilityResult } from '../../types/eligibility';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import { AdaptiveQuestionnaire } from '../profile/questionnaire/AdaptiveQuestionnaire';
import { calculateDeadlineStatus } from '../../utils/dateUtils';
import {
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  User,
  GraduationCap,
  MapPin,
  Coins,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';

interface FindScholarshipsPageProps {
  onNavigate: (route: string) => void;
}

interface SearchPreferences {
  query: string;
  location: 'all' | 'Gujarat' | 'All India';
  education: string;
  category: string;
  type: string;
  openOnly: boolean;
}

const DEFAULT_PREFERENCES: SearchPreferences = {
  query: '',
  location: 'all',
  education: 'all',
  category: 'all',
  type: 'all',
  openOnly: false,
};

const PREFS_STORAGE_KEY = 'edvora_find_search_prefs';

export const FindScholarshipsPage: React.FC<FindScholarshipsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { scholarships } = useScholarships();

  const {
    profile,
    isLoading: loading,
    profileCompletion: completion,
    hasPopulatedFields,
    refreshProfile,
  } = useStudentProfile();

  // Questionnaire interaction
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [questionnaireTargetField, setQuestionnaireTargetField] = useState<string | undefined>(undefined);
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);

  // Accordion state for not eligible
  const [isNotEligibleExpanded, setIsNotEligibleExpanded] = useState(false);

  // Search preferences (preserved in sessionStorage)
  const [preferences, setPreferences] = useState<SearchPreferences>(() => {
    try {
      const stored = sessionStorage.getItem(PREFS_STORAGE_KEY);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Save preferences whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage errors
    }
  }, [preferences]);


  // Check critical missing fields gating candidate matching
  const missingCriticalFields = useMemo(() => {
    if (!profile) return ['field_education_level', 'field_domicile_state'];
    const fields = profile.fields;
    const missing: string[] = [];

    const edu = fields['field_education_level'];
    if (!edu || edu.status !== 'known' || !edu.value) {
      missing.push('field_education_level');
    }

    const state = fields['field_domicile_state'] || fields['field_current_state'];
    if (!state || state.status !== 'known' || !state.value) {
      missing.push('field_domicile_state');
    }

    return missing;
  }, [profile]);

  // Open questionnaire for specific field or general update
  const handleOpenQuestionnaire = (fieldId?: string) => {
    setQuestionnaireTargetField(fieldId);
    setIsQuestionnaireOpen(true);
  };

  // Close questionnaire and reload profile
  const handleQuestionnaireClose = async () => {
    setIsQuestionnaireOpen(false);
    setQuestionnaireTargetField(undefined);
    await refreshProfile();
    setShowUpdatedToast(true);
  };

  // Candidate Engine & Filtering & Eligibility Evaluation
  const evaluatedResults = useMemo(() => {
    if (!profile || !hasPopulatedFields || missingCriticalFields.length > 0) {
      return {
        eligible: [] as { scholarship: Scholarship; result: ScholarshipEligibilityResult }[],
        possible: [] as { scholarship: Scholarship; result: ScholarshipEligibilityResult }[],
        notEligible: [] as { scholarship: Scholarship; result: ScholarshipEligibilityResult }[],
      };
    }

    // 1. Candidate Engine
    const candidates = getCandidateScholarships(scholarships, profile);

    // 2. Search Preferences Filtering
    const filtered = candidates.filter((scholarship) => {
      // Keyword query
      if (preferences.query.trim()) {
        const q = preferences.query.toLowerCase().trim();
        const matchesName = scholarship.name.toLowerCase().includes(q);
        const matchesProvider = scholarship.provider.toLowerCase().includes(q);
        const matchesDesc = scholarship.description.toLowerCase().includes(q);
        const matchesTags = scholarship.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesDesc && !matchesTags) return false;
      }

      // Location filter
      if (preferences.location !== 'all') {
        if (scholarship.state !== preferences.location) return false;
      }

      // Education Level filter
      if (preferences.education !== 'all') {
        const matchEdu = scholarship.educationLevels.some(
          (lvl) => lvl.toLowerCase() === preferences.education.toLowerCase()
        );
        if (!matchEdu) return false;
      }

      // Category filter
      if (preferences.category !== 'all') {
        const matchCat =
          scholarship.categories.includes('All') ||
          scholarship.categories.some((c) => c.toLowerCase() === preferences.category.toLowerCase());
        if (!matchCat) return false;
      }

      // Type filter
      if (preferences.type !== 'all') {
        if (scholarship.type.toLowerCase() !== preferences.type.toLowerCase()) return false;
      }

      // Open only filter
      if (preferences.openOnly) {
        const deadlineInfo = calculateDeadlineStatus(
          scholarship.applicationDeadline,
          scholarship.applicationStart,
          scholarship.status
        );
        if (deadlineInfo.status !== 'Open') return false;
      }

      return true;
    });

    // 3. Eligibility Engine Deterministic Evaluation
    const eligible: { scholarship: Scholarship; result: ScholarshipEligibilityResult }[] = [];
    const possible: { scholarship: Scholarship; result: ScholarshipEligibilityResult }[] = [];
    const notEligible: { scholarship: Scholarship; result: ScholarshipEligibilityResult }[] = [];

    for (const scholarship of filtered) {
      const result = evaluateScholarshipEligibility(scholarship, profile);
      if (result.status === 'eligible') {
        eligible.push({ scholarship, result });
      } else if (result.status === 'possible') {
        possible.push({ scholarship, result });
      } else {
        notEligible.push({ scholarship, result });
      }
    }

    return { eligible, possible, notEligible };
  }, [scholarships, profile, hasPopulatedFields, missingCriticalFields, preferences]);

  // Loading view
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#065F46] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
          {t('profile.matching.findingScholarshipsLoading', undefined, 'Checking your profile against available scholarship eligibility requirements...')}
        </p>
      </div>
    );
  }

  // Active Adaptive Questionnaire Overlay View
  if (isQuestionnaireOpen && profile) {
    return (
      <AdaptiveQuestionnaire
        initialProfile={profile}
        scholarships={scholarships}
        preferredFieldId={questionnaireTargetField}
        onComplete={() => handleQuestionnaireClose()}
        onExit={() => handleQuestionnaireClose()}
        onFindScholarships={() => handleQuestionnaireClose()}
      />
    );
  }

  // Case 1: Empty Profile view
  if (!profile || !hasPopulatedFields) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
            <User className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white">
              {t('profile.matching.findScholarshipsTitle', undefined, 'Find Scholarships Matched to You')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {t(
                'profile.matching.startProfilePrompt',
                undefined,
                'Tell Edvora a little about yourself to unlock tailored scholarship matches based on verified eligibility rules.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-sm font-bold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('profile.matching.startProfileBtn', undefined, 'Build My Profile')}</span>
            </button>

            <button
              onClick={() => onNavigate('explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200 dark:hover:bg-[#23453E] text-stone-800 dark:text-stone-200 text-sm font-semibold border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer"
            >
              <span>{t('profile.matching.exploreScholarshipsBtn', undefined, 'Explore All Scholarships')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile fields helper for Compact Summary
  const eduLevel = profile.fields['field_education_level']?.value || '—';
  const stream = profile.fields['field_stream']?.value || profile.fields['field_stream']?.customText || '';
  const eduDisplay = stream ? `${eduLevel} • ${stream}` : String(eduLevel);
  const location = profile.fields['field_domicile_state']?.value || profile.fields['field_current_state']?.value || '—';
  const category = profile.fields['field_category']?.value || '—';
  const score = profile.fields['field_latest_score']?.value || profile.fields['field_class_12_percentage']?.value || '—';
  const scoreDisplay = score !== '—' ? `${score}%` : '—';

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8">
      {/* Toast Notice: Profile Updated */}
      {showUpdatedToast && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">
              {t('profile.matching.profileUpdatedRefreshed', undefined, 'Your profile was updated. Scholarship matches have been refreshed.')}
            </span>
          </div>
          <button
            onClick={() => setShowUpdatedToast(false)}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Profile-Based Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white tracking-tight">
          {t('profile.matching.findScholarshipsTitle', undefined, 'Find Scholarships Matched to You')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          {t(
            'profile.matching.findScholarshipsSubtitle',
            undefined,
            'Edvora evaluates your saved student profile against verified eligibility rules across India.'
          )}
        </p>
      </div>

      {/* Compact Profile Summary Card */}
      <div className="bg-white/95 dark:bg-[#142420]/95 backdrop-blur-md rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-[#1E3A33]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-200">
              {t('profile.matching.profileSummaryTitle', undefined, 'Your Scholarship Profile')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-stone-400 block">
                {t('profile.profileReadiness', undefined, 'Profile readiness')}
              </span>
              <span className="text-xs font-bold text-[#065F46] dark:text-emerald-400">
                {completion.percentage}%
              </span>
            </div>
            <div className="w-20 sm:w-24 h-2 rounded-full bg-stone-100 dark:bg-[#1C3630] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#065F46] dark:bg-emerald-500 transition-all duration-500"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <button
              onClick={() => handleOpenQuestionnaire()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200 dark:hover:bg-[#23453E] text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer"
            >
              <span>{t('profile.updateProfile', undefined, 'Update Profile')}</span>
            </button>
          </div>
        </div>

        {/* Profile Context Explainer */}
        <p className="text-xs text-stone-600 dark:text-stone-300">
          Matching scholarships using your existing profile:{' '}
          <span className="font-semibold text-stone-800 dark:text-white">{eduDisplay}</span> •{' '}
          <span className="font-semibold text-stone-800 dark:text-white">{String(location)}</span> •{' '}
          <span className="font-semibold text-stone-800 dark:text-white">{String(category)}</span> •{' '}
          <span className="font-semibold text-stone-800 dark:text-white">{scoreDisplay}</span>
        </p>

        {/* 4 Core Summary Matrix Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#162A24] border border-stone-200/60 dark:border-[#1E3A33] min-w-0">
            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase font-bold mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
              <span>Education</span>
            </div>
            <p className="font-semibold text-stone-800 dark:text-stone-200 truncate capitalize">
              {eduDisplay}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#162A24] border border-stone-200/60 dark:border-[#1E3A33] min-w-0">
            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase font-bold mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
              <span>Location</span>
            </div>
            <p className="font-semibold text-stone-800 dark:text-stone-200 truncate capitalize">
              {String(location)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#162A24] border border-stone-200/60 dark:border-[#1E3A33] min-w-0">
            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase font-bold mb-1">
              <Coins className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
              <span>Category</span>
            </div>
            <p className="font-semibold text-stone-800 dark:text-stone-200 truncate uppercase">
              {String(category)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#162A24] border border-stone-200/60 dark:border-[#1E3A33] min-w-0">
            <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
              <span>Academic</span>
            </div>
            <p className="font-semibold text-stone-800 dark:text-stone-200 truncate">
              {scoreDisplay}
            </p>
          </div>
        </div>
      </div>

      {/* Case 2: Missing Critical Information Notice */}
      {missingCriticalFields.length > 0 && (
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
                {t('profile.matching.detailsNeededTitle', undefined, 'A few details are needed')}
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed max-w-xl">
                {t(
                  'profile.matching.detailsNeededDesc',
                  undefined,
                  'We need a little more information to identify scholarships that match your profile.'
                )}
              </p>
            </div>
          </div>

          <div className="pl-11 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/60 dark:text-amber-400/60">
              {t(
                'profile.matching.missingInformationLabel',
                undefined,
                'Missing information required for candidate matching:'
              )}
            </p>
            <ul className="space-y-1.5">
              {missingCriticalFields.map((fid) => (
                <li key={fid} className="flex items-center gap-2 text-xs font-semibold text-amber-950 dark:text-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{getField(fid)?.label || fid}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleOpenQuestionnaire(missingCriticalFields[0])}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('profile.matching.updateMyProfileBtn', undefined, 'Update My Profile')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Preferences Bar ("Tell Edvora what you're looking for") */}
      {missingCriticalFields.length === 0 && (
        <div className="bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
                <span>{t('profile.matching.searchPreferencesTitle', undefined, 'Tell Edvora what you are looking for')}</span>
              </h3>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                {t(
                  'profile.matching.searchPreferencesDesc',
                  undefined,
                  'Optional search preferences to tailor your view without altering your profile.'
                )}
              </p>
            </div>

            <button
              onClick={() => setPreferences(DEFAULT_PREFERENCES)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('profile.matching.resetFilters', undefined, 'Reset Preferences')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={preferences.query}
                onChange={(e) => setPreferences((p) => ({ ...p, query: e.target.value }))}
                placeholder={t('profile.matching.searchPlaceholder', undefined, 'Search by name, provider, or keyword...')}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-[#162A24] border border-stone-200 dark:border-[#23453E] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              />
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={preferences.location}
                onChange={(e) => setPreferences((p) => ({ ...p, location: e.target.value as any }))}
                className="w-full py-2 px-3 rounded-xl text-xs bg-stone-50 dark:bg-[#162A24] border border-stone-200 dark:border-[#23453E] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <option value="all">{t('profile.matching.allLocations', undefined, 'All Locations')}</option>
                <option value="Gujarat">Gujarat</option>
                <option value="All India">All India</option>
              </select>
            </div>

            {/* Education Level Filter */}
            <div>
              <select
                value={preferences.education}
                onChange={(e) => setPreferences((p) => ({ ...p, education: e.target.value }))}
                className="w-full py-2 px-3 rounded-xl text-xs bg-stone-50 dark:bg-[#162A24] border border-stone-200 dark:border-[#23453E] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
              >
                <option value="all">{t('profile.matching.allLevels', undefined, 'All Education Levels')}</option>
                <option value="School">School</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Open Only Toggle */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={preferences.openOnly}
                  onChange={(e) => setPreferences((p) => ({ ...p, openOnly: e.target.checked }))}
                  className="rounded text-[#065F46] focus:ring-[#065F46] border-stone-300"
                />
                <span>{t('profile.matching.openOnly', undefined, 'Open Only')}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Case 3: Matching Results Display */}
      {missingCriticalFields.length === 0 && (
        <div className="space-y-8">
          {/* Empty Results State */}
          {evaluatedResults.eligible.length === 0 && evaluatedResults.possible.length === 0 ? (
            <div className="bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-[#162A24] text-stone-400 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7 stroke-[1.8]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-editorial text-stone-900 dark:text-white">
                  {t('profile.matching.noConfirmedMatchesTitle', undefined, 'No Confirmed Matches Found Yet')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                  {t(
                    'profile.matching.noConfirmedMatchesDesc',
                    undefined,
                    'No scholarships in our verified dataset match your exact combination of criteria. Try broadening your search preferences or reviewing your profile.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="px-5 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {t('profile.matching.reviewProfileBtn', undefined, 'Review Profile')}
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200 dark:hover:bg-[#23453E] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer"
                >
                  {t('profile.matching.exploreScholarshipsBtn', undefined, 'Explore All Scholarships')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Category 1: Eligible Matches */}
              {evaluatedResults.eligible.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        {evaluatedResults.eligible.length}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-editorial text-stone-900 dark:text-white">
                        {t('profile.matching.eligibleMatchesTitle', undefined, 'Eligible Matches')}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-[#065F46] dark:text-emerald-400">
                      ✓ Confirmed Eligibility
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {evaluatedResults.eligible.map(({ scholarship, result }) => (
                      <ScholarshipCard
                        key={scholarship.id}
                        scholarship={scholarship}
                        eligibilityResult={result}
                        onViewDetails={(slug) => onNavigate(`scholarships/${slug}`)}
                        onUpdateMissingField={(fid) => handleOpenQuestionnaire(fid)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: Possible Matches */}
              {evaluatedResults.possible.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                        {evaluatedResults.possible.length}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-editorial text-stone-900 dark:text-white">
                        {t('profile.matching.possibleMatchesTitle', undefined, 'Possible Matches')}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      ○ Needs Confirmation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {evaluatedResults.possible.map(({ scholarship, result }) => (
                      <ScholarshipCard
                        key={scholarship.id}
                        scholarship={scholarship}
                        eligibilityResult={result}
                        onViewDetails={(slug) => onNavigate(`scholarships/${slug}`)}
                        onUpdateMissingField={(fid) => handleOpenQuestionnaire(fid)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Category 3: Not Eligible (Collapsible Accordion) */}
              {evaluatedResults.notEligible.length > 0 && (
                <div className="pt-4 border-t border-stone-200 dark:border-[#1E3A33]">
                  <button
                    onClick={() => setIsNotEligibleExpanded(!isNotEligibleExpanded)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-[#162A24] border border-stone-200/80 dark:border-[#23453E] hover:bg-stone-100/80 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center font-bold text-xs">
                        {evaluatedResults.notEligible.length}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200">
                          {t('profile.matching.notEligibleMatchesTitle', undefined, 'Not Eligible')}
                        </h3>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500">
                          {t(
                            'profile.matching.notEligibleMatchesSubtitle',
                            undefined,
                            'One or more mandatory eligibility requirements do not match your current profile.'
                          )}
                        </p>
                      </div>
                    </div>
                    {isNotEligibleExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </button>

                  {isNotEligibleExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 animate-in fade-in">
                      {evaluatedResults.notEligible.map(({ scholarship, result }) => (
                        <ScholarshipCard
                          key={scholarship.id}
                          scholarship={scholarship}
                          eligibilityResult={result}
                          onViewDetails={(slug) => onNavigate(`scholarships/${slug}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
