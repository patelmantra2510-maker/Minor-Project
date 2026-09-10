import React, { useState, useMemo } from 'react';
import { useSaved } from '../../context/SavedContext';
import { useCompare } from '../../context/CompareContext';
import { useAI } from '../../context/AIContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { ScholarshipCard } from '../scholarship/ScholarshipCard';
import { DocumentChecklistModal } from '../saved/DocumentChecklistModal';
import { StatusBadge } from '../common/Badge';
import { formatDate, getDaysUntilDeadline } from '../../utils/dateUtils';
import {
  Bookmark,
  Compass,
  Clock,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle,
  SlidersHorizontal,
  Bot,
  ShieldCheck,
  Plus,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SavedScholarshipsPageProps {
  onViewScholarshipDetails: (slug: string) => void;
  onExplore: () => void;
  onNavigate?: (route: string) => void;
}

export const SavedScholarshipsPage: React.FC<SavedScholarshipsPageProps> = ({
  onViewScholarshipDetails,
  onExplore,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { savedIds, recentlyViewedIds, clearSaved, clearRecentlyViewed, toggleSave } = useSaved();
  const { compareIds, addToCompare, openCompareModal } = useCompare();
  const { openGlobalAI, sendMessage } = useAI();

  // Local UI states
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'gujarat' | 'all-india'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'benefit' | 'az' | 'recent'>('deadline');
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filter saved scholarships by savedIds preserving insertion order or sort order
  const savedScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((s) => savedIds.includes(s.id));
  }, [savedIds]);

  const recentlyViewed = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((s) => recentlyViewedIds.includes(s.id));
  }, [recentlyViewedIds]);

  // Recommended popular starter schemes for empty state
  const popularSuggestions = useMemo(() => {
    const popularIds = ['mysy-gujarat', 'nsp-central-sector', 'pm-yasasvi-obc'];
    return SCHOLARSHIPS_DATA.filter((s) => popularIds.includes(s.id));
  }, []);

  // Check for upcoming urgent deadlines (< 14 days)
  const urgentDeadlineScholarship = useMemo(() => {
    return savedScholarships.find((s) => {
      const days = getDaysUntilDeadline(s.applicationDeadline);
      return days !== null && days >= 0 && days <= 14;
    });
  }, [savedScholarships]);

  // Filtered & Sorted saved scholarships
  const displayedScholarships = useMemo(() => {
    let list = [...savedScholarships];

    // Region filter
    if (selectedRegion === 'gujarat') {
      list = list.filter((s) => s.state === 'Gujarat');
    } else if (selectedRegion === 'all-india') {
      list = list.filter((s) => s.state === 'All India');
    }

    // Sorting
    if (sortBy === 'deadline') {
      list.sort((a, b) => {
        const daysA = getDaysUntilDeadline(a.applicationDeadline) ?? 999;
        const daysB = getDaysUntilDeadline(b.applicationDeadline) ?? 999;
        return daysA - daysB;
      });
    } else if (sortBy === 'benefit') {
      list.sort((a, b) => {
        const amtA = a.benefits.maxAnnualAmount || 0;
        const amtB = b.benefits.maxAnnualAmount || 0;
        return amtB - amtA;
      });
    } else if (sortBy === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'recent') {
      list.sort((a, b) => savedIds.indexOf(b.id) - savedIds.indexOf(a.id));
    }

    return list;
  }, [savedScholarships, selectedRegion, sortBy, savedIds]);

  // Quick Compare Saved Handler
  const handleCompareSaved = () => {
    if (savedScholarships.length === 0) return;
    // Add up to 3 saved scholarships to compare tray if not already added
    const toAdd = savedScholarships.slice(0, 3);
    toAdd.forEach((s) => {
      if (!compareIds.includes(s.id)) {
        addToCompare(s.id);
      }
    });
    openCompareModal();
  };

  // AI Assistant Query for Saved Scholarships
  const handleAskAIAboutSaved = () => {
    if (savedScholarships.length === 0) {
      openGlobalAI();
      return;
    }
    const names = savedScholarships.map((s) => s.shortName || s.name).join(', ');
    const prompt = `I have bookmarked the following scholarships in Edvora: ${names}. Can you give me a summary checklist of all documents I will need and what critical deadlines I should watch out for?`;
    openGlobalAI();
    setTimeout(() => {
      sendMessage(prompt);
    }, 150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* 1. Page Header & Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-[#1E2E28] border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2.5">
            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{t('savedPage.browserSavedBadge', undefined, 'Browser-Saved Scholarships (Private to this device)')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
            {t('savedPage.title', undefined, 'Saved Scholarships')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
            {t('savedPage.heroSubtitle', undefined, 'Review deadlines, compare benefits, and track required documents for your bookmarked schemes.')}
          </p>
        </div>

        {/* Global Storage Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-stone-500 dark:text-stone-400 bg-white/70 dark:bg-[#142420]/70 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-stone-200/80 dark:border-[#1E3A33] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
          <span>Local Storage · Zero Account Needed</span>
        </div>
      </div>

      {/* 2. Contextual AI Helper Bar */}
      <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-emerald-50/70 via-amber-50/50 to-emerald-50/70 dark:from-[#13241F] dark:via-[#192E26] dark:to-[#13241F] border border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <p className="text-xs text-stone-700 dark:text-stone-200 font-medium">
            {t('savedPage.aiPromptHelper', undefined, 'Have questions about your saved schemes or deadlines? Ask Edvora AI to guide you.')}
          </p>
        </div>

        <button
          onClick={handleAskAIAboutSaved}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#054333] text-amber-300 font-bold text-xs shadow-xs transition-all hover:scale-[1.02] shrink-0 self-start sm:self-auto"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{t('savedPage.aiPromptBtn', undefined, 'Ask Edvora AI')}</span>
        </button>
      </div>

      {/* 3. Urgent Deadline Alert Banner (if deadline < 14 days away) */}
      {urgentDeadlineScholarship && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Application Deadline Alert:{' '}
                <span className="underline decoration-amber-500 underline-offset-2">
                  {urgentDeadlineScholarship.name}
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                Closes in {getDaysUntilDeadline(urgentDeadlineScholarship.applicationDeadline)} days ({formatDate(urgentDeadlineScholarship.applicationDeadline)}). Ensure your documents are ready.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-2xs transition-colors"
          >
            Check Documents
          </button>
        </div>
      )}

      {/* 4. Action & Filter Bar (when scholarships are saved) */}
      {savedScholarships.length > 0 && (
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#142420] p-3.5 sm:p-4 rounded-2xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCompareSaved}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-100 font-bold text-xs transition-all shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('savedPage.compareBtn', { count: String(Math.min(savedScholarships.length, 3)) }, `Compare Saved (${Math.min(savedScholarships.length, 3)})`)}</span>
            </button>

            <button
              onClick={() => setIsChecklistOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 font-semibold text-xs transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t('savedPage.documentChecklistBtn', undefined, 'Document Checklist')}</span>
            </button>

            {/* Region Filter Pills */}
            <div className="flex items-center rounded-xl bg-stone-100 dark:bg-[#1A302A] p-1 border border-stone-200/60 dark:border-stone-700/60">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === 'all'
                    ? 'bg-white dark:bg-[#12221E] text-[#064E3B] dark:text-emerald-400 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                All ({savedScholarships.length})
              </button>
              <button
                onClick={() => setSelectedRegion('gujarat')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === 'gujarat'
                    ? 'bg-white dark:bg-[#12221E] text-[#064E3B] dark:text-emerald-400 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                Gujarat
              </button>
              <button
                onClick={() => setSelectedRegion('all-india')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === 'all-india'
                    ? 'bg-white dark:bg-[#12221E] text-[#064E3B] dark:text-emerald-400 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                All India
              </button>
            </div>
          </div>

          {/* Sort Dropdown & Clear List */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort saved scholarships"
                className="bg-stone-50 dark:bg-[#1A302A] border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-[#065F46]"
              >
                <option value="deadline">{t('savedPage.sortDeadline', undefined, 'Deadline Soon')}</option>
                <option value="benefit">{t('savedPage.sortBenefit', undefined, 'Highest Benefit')}</option>
                <option value="az">{t('savedPage.sortAZ', undefined, 'A – Z')}</option>
                <option value="recent">{t('savedPage.sortRecent', undefined, 'Recently Saved')}</option>
              </select>
            </div>

            <button
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('savedPage.clearListBtn', undefined, 'Clear All')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Saved Scholarships Cards Grid or High-Caliber Empty State */}
      {displayedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayedScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onViewDetails={onViewScholarshipDetails}
              showMatchStatus={false}
            />
          ))}
        </div>
      ) : savedScholarships.length > 0 ? (
        /* Zero matches for regional filter */
        <div className="text-center py-12 px-4 bg-white dark:bg-[#142420] rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] mb-16">
          <p className="text-stone-600 dark:text-stone-400 text-sm font-semibold">
            No saved scholarships match the selected region filter.
          </p>
          <button
            onClick={() => setSelectedRegion('all')}
            className="mt-3 text-xs font-bold text-[#065F46] dark:text-emerald-400 underline"
          >
            Show all saved scholarships
          </button>
        </div>
      ) : (
        /* 6. Refined Academic Dossier Empty State */
        <div className="mb-16">
          <div className="text-center py-12 sm:py-16 px-6 max-w-xl mx-auto bg-white/90 dark:bg-[#142420]/90 backdrop-blur-md rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-md">
            {/* Dossier Icon Graphic */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 dark:bg-[#1A302A] border border-emerald-200 dark:border-emerald-800/50 text-[#064E3B] dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 fill-amber-400/20" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-editorial tracking-tight">
              {t('savedPage.emptyTitle', undefined, 'Your Saved Scholarship Dossier is Empty')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed max-w-md mx-auto">
              {t(
                'savedPage.emptySubtitle',
                undefined,
                'As you explore scholarships across Gujarat and India, bookmark schemes here to organize your applications, track deadlines, and compare benefits side-by-side.'
              )}
            </p>

            {/* Dual Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onExplore}
                className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-md shadow-[#064E3B]/20 transition-all inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{t('savedPage.exploreBtn', undefined, 'Explore Scholarships')}</span>
              </button>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('find')}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#1A302A] hover:bg-stone-50 dark:hover:bg-[#203D35] text-[#064E3B] dark:text-emerald-400 border border-emerald-600/30 font-bold text-xs sm:text-sm shadow-2xs transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t('savedPage.findBtn', undefined, 'Find My Matches')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Suggested Starter Scholarships Shelf */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('savedPage.popularSuggestionsTitle', undefined, 'Popular Schemes to Consider')}
                </h3>
                <p className="text-xs text-stone-500">
                  {t('savedPage.popularSuggestionsSub', undefined, 'Click the bookmark icon to start building your personal dossier')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popularSuggestions.map((s) => {
                const isSaved = savedIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-amber-400 transition-all flex flex-col justify-between shadow-2xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#065F46] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {s.state}
                        </span>
                        <button
                          onClick={() => toggleSave(s.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSaved
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-stone-50 dark:bg-[#1A302A] text-stone-400 hover:text-amber-600 border-stone-200 dark:border-stone-700'
                          }`}
                          title={isSaved ? 'Saved' : 'Bookmark this scheme'}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <h4
                        onClick={() => onViewScholarshipDetails(s.slug)}
                        className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer group-hover:text-[#065F46] dark:group-hover:text-emerald-400 transition-colors font-editorial"
                      >
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {s.provider}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#065F46] dark:text-emerald-400">
                        {s.benefits.amountDescription.split('·')[0]}
                      </span>
                      <button
                        onClick={() => onViewScholarshipDetails(s.slug)}
                        className="text-stone-400 hover:text-[#065F46] dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Recently Viewed Scholarships Tray */}
      {recentlyViewed.length > 0 && (
        <div className="pt-10 border-t border-[#E8E2D7] dark:border-[#1E3A33]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#065F46] dark:text-emerald-400" />
              <h2 className="text-base font-bold text-[#064E3B] dark:text-white font-editorial">
                {t('savedPage.recentlyViewed', undefined, 'Recently Viewed Scholarships')}
              </h2>
              <span className="text-xs text-stone-400 font-semibold">({recentlyViewed.length})</span>
            </div>

            <button
              onClick={clearRecentlyViewed}
              className="text-xs font-medium text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              {t('savedPage.clearHistoryBtn', undefined, 'Clear History')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.map((s) => {
              const isSaved = savedIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 transition-all flex items-center justify-between gap-3 group shadow-2xs"
                >
                  <div
                    onClick={() => onViewScholarshipDetails(s.slug)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <StatusBadge deadline={s.applicationDeadline} startDate={s.applicationStart} overrideStatus={s.status} />
                      <span className="text-[10px] text-stone-400">· {s.state}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#065F46] dark:group-hover:text-emerald-400 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {s.provider}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleSave(s.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-stone-50 dark:bg-[#1A302A] text-stone-400 hover:text-amber-600 border-stone-200 dark:border-stone-700'
                      }`}
                      title={isSaved ? 'Saved' : 'Bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                    </button>
                    <ArrowRight
                      onClick={() => onViewScholarshipDetails(s.slug)}
                      className="w-4 h-4 text-stone-400 group-hover:text-[#065F46] group-hover:translate-x-0.5 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. Unified Document Checklist Modal */}
      <DocumentChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        scholarships={savedScholarships}
      />

      {/* 9. Clear All Saved Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#142420] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E2D7] dark:border-[#1E3A33] text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-editorial">
              {t('savedPage.clearConfirmTitle', undefined, 'Clear all saved scholarships?')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
              {t(
                'savedPage.clearConfirmDesc',
                undefined,
                'This will remove all saved scholarships from your browser storage. This action cannot be undone.'
              )}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-[#1A302A] text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                {t('savedPage.cancel', undefined, 'Cancel')}
              </button>
              <button
                onClick={() => {
                  clearSaved();
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                {t('savedPage.confirmClear', undefined, 'Yes, Clear All')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

