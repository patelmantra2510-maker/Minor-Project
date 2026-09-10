import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SavedProvider } from './context/SavedContext';
import { CompareProvider } from './context/CompareContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { ExploreByCategory } from './components/home/ExploreByCategory';
import { FeaturedScholarships } from './components/home/FeaturedScholarships';
import { HowItWorks } from './components/home/HowItWorks';
import { QuestionnaireWizard } from './components/questionnaire/QuestionnaireWizard';
import { ResultsView } from './components/results/ResultsView';
import { DirectoryView } from './components/directory/DirectoryView';
import { SavedScholarshipsPage } from './components/pages/SavedScholarshipsPage';
import { AboutPage } from './components/pages/AboutPage';
import { AIPage } from './components/pages/AIPage';
import { ScholarshipDetailPage } from './components/scholarship/ScholarshipDetailPage';
import { ComparisonModal, FloatingCompareBar } from './components/scholarship/ComparisonModal';
import { EdvoraBackground, type BackgroundVariant } from './components/background/EdvoraBackground';
import { AIProvider } from './context/AIContext';
import { AIFloatingButton } from './components/ai/AIFloatingButton';
import { AIChatPanel } from './components/ai/AIChatPanel';
import { useSaved } from './context/SavedContext';

import { ScholarshipProvider, useScholarships } from './context/ScholarshipContext';
import { evaluateAllScholarships, evaluateScholarship } from './engine/eligibilityEngine';
import type { StudentAnswers, MatchResult } from './types/scholarship';

export function AppContent() {
  const { t } = useLanguage();
  const { scholarships } = useScholarships();

  // Helper to parse route path and query parameters (e.g. #/ai?scholarshipId=mysy-gujarat)
  const parseRouteHash = (rawHash: string) => {
    const clean = rawHash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = clean.split('?');
    const params = new URLSearchParams(queryPart || '');
    return {
      route: pathPart || 'home',
      scholarshipId: params.get('scholarshipId') || undefined,
    };
  };

  const [routeInfo, setRouteInfo] = useState(() => parseRouteHash(window.location.hash));
  const currentRoute = routeInfo.route;
  const currentAIScholarshipId = routeInfo.scholarshipId;

  // Directory filter state when navigated from home category cards
  const [directoryFilters, setDirectoryFilters] = useState<{
    locationTab?: 'all' | 'Gujarat' | 'All India';
    educationFilter?: string;
    categoryFilter?: string;
    genderFilter?: string;
    typeFilter?: string;
  }>({
    locationTab: 'all',
    educationFilter: 'all',
    categoryFilter: 'all',
    genderFilter: 'all',
    typeFilter: 'all',
  });

  // Session-only student answers (No accounts, no permanent profile)
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers | null>(() => {
    try {
      const stored = sessionStorage.getItem('edvora_session_answers') || sessionStorage.getItem('vidyasetu_session_answers');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep session answers in sessionStorage for refreshing finder page
  useEffect(() => {
    if (studentAnswers) {
      sessionStorage.setItem('edvora_session_answers', JSON.stringify(studentAnswers));
    }
  }, [studentAnswers]);

  // Sync hash changes with state
  useEffect(() => {
    const handleHashChange = () => {
      setRouteInfo(parseRouteHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route.startsWith('/') ? `#${route}` : `#/${route}`;
    setRouteInfo(parseRouteHash(window.location.hash));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (filterType: string, filterValue: string) => {
    const newFilters = {
      locationTab: 'all' as const,
      educationFilter: 'all',
      categoryFilter: 'all',
      genderFilter: 'all',
      typeFilter: 'all',
    };

    if (filterType === 'education') newFilters.educationFilter = filterValue;
    if (filterType === 'category') newFilters.categoryFilter = filterValue;
    if (filterType === 'gender') newFilters.genderFilter = filterValue;
    if (filterType === 'type') newFilters.typeFilter = filterValue;

    setDirectoryFilters(newFilters);
    navigateTo('explore');
  };

  // Questionnaire completion handler
  const handleQuestionnaireComplete = (answers: StudentAnswers) => {
    setStudentAnswers(answers);
    navigateTo('find');
  };

  // Evaluate matches if studentAnswers exist
  const matchResults: MatchResult[] = React.useMemo(() => {
    if (!studentAnswers) return [];
    return evaluateAllScholarships(scholarships, studentAnswers);
  }, [studentAnswers, scholarships]);

  // Check if current route is a dedicated scholarship detail route e.g. "scholarships/mysy-gujarat"
  const isDetailRoute = currentRoute.startsWith('scholarships/');
  const currentDetailSlug = isDetailRoute ? currentRoute.replace('scholarships/', '') : null;
  const currentScholarship = currentDetailSlug
    ? scholarships.find((s) => s.slug === currentDetailSlug || s.id === currentDetailSlug)
    : null;
  const { savedIds } = useSaved();
  const hasSavedItems = savedIds.length > 0;

  const backgroundVariant: BackgroundVariant = isDetailRoute
    ? 'detail'
    : currentRoute === 'home' || currentRoute === ''
    ? 'home'
    : currentRoute === 'find' || currentRoute === 'results'
    ? studentAnswers && matchResults.length > 0
      ? 'results'
      : 'find'
    : currentRoute === 'explore' || currentRoute === 'all-scholarships' || currentRoute === 'gujarat' || currentRoute === 'all-india'
    ? 'explore'
    : currentRoute === 'saved'
    ? 'saved'
    : currentRoute === 'about'
    ? 'about'
    : currentRoute === 'ai'
    ? 'ai'
    : 'home';

  return (
    <AIProvider studentAnswers={studentAnswers} currentPage={currentRoute}>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0C1513] text-stone-900 dark:text-stone-100 transition-colors relative">
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      <main className="flex-1 relative overflow-hidden">
        <EdvoraBackground variant={backgroundVariant} hasSavedItems={hasSavedItems} />
        <div key={currentRoute} className="animate-page-enter">
        {/* DEDICATED SCHOLARSHIP DETAIL ROUTE */}
        {isDetailRoute && currentScholarship ? (
          <ScholarshipDetailPage
            scholarship={currentScholarship}
            matchResult={
              studentAnswers
                ? evaluateScholarship(currentScholarship, studentAnswers)
                : undefined
            }
            studentAnswers={studentAnswers}
            onNavigate={navigateTo}
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigateTo('explore');
              }
            }}
          />
        ) : isDetailRoute && !currentScholarship ? (
          <div className="max-w-md mx-auto py-20 text-center px-4">
            <h2 className="text-xl font-bold font-editorial text-[#064E3B] dark:text-emerald-400">
              {t('common.notFoundTitle', undefined, 'Scholarship Not Found')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              {t('common.notFoundDesc', undefined, 'The scholarship you requested does not exist or may have been updated.')}
            </p>
            <button
              onClick={() => navigateTo('explore')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-semibold shadow-xs transition-colors"
            >
              {t('common.browseAll', undefined, 'Browse All Scholarships')}
            </button>
          </div>
        ) : null}

        {/* HOME ROUTE */}
        {!isDetailRoute && (currentRoute === 'home' || currentRoute === '') && (
          <div>
            <Hero
              onFindScholarships={() => navigateTo('find')}
              onExploreScholarships={() => navigateTo('explore')}
              onAskAI={() => navigateTo('ai')}
            />
            <HowItWorks onStart={() => navigateTo('find')} />
            <ExploreByCategory onSelectCategory={handleCategorySelect} />
            <FeaturedScholarships
              onViewDetails={(slug) => navigateTo(`scholarships/${slug}`)}
              onExploreAll={() => navigateTo('explore')}
            />
          </div>
        )}

        {/* FIND SCHOLARSHIPS ROUTE */}
        {!isDetailRoute && (currentRoute === 'find' || currentRoute === 'results') && (
          <div>
            {studentAnswers && matchResults.length > 0 ? (
              <ResultsView
                results={matchResults}
                answers={studentAnswers}
                onRetake={() => {
                  setStudentAnswers(null);
                  sessionStorage.removeItem('edvora_session_answers');
                  sessionStorage.removeItem('vidyasetu_session_answers');
                }}
                onExploreAll={() => navigateTo('explore')}
                onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
              />
            ) : (
              <QuestionnaireWizard
                initialAnswers={studentAnswers}
                onComplete={handleQuestionnaireComplete}
              />
            )}
          </div>
        )}

        {/* EXPLORE SCHOLARSHIPS DIRECTORY (Unified Single Directory) */}
        {!isDetailRoute && (currentRoute === 'explore' || currentRoute === 'all-scholarships') && (
          <DirectoryView
            initialLocationTab={directoryFilters.locationTab || 'all'}
            initialCategoryFilter={directoryFilters.categoryFilter || 'all'}
            initialEducationFilter={directoryFilters.educationFilter || 'all'}
            initialGenderFilter={directoryFilters.genderFilter || 'all'}
            initialTypeFilter={directoryFilters.typeFilter || 'all'}
            pageTitle="Explore Scholarships"
            pageSubtitle="The single directory for scholarships across Gujarat and India. Search, filter, and discover verified opportunities."
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
            onNavigate={navigateTo}
          />
        )}

        {/* GUJARAT SCHOLARSHIPS (Route Alias) */}
        {!isDetailRoute && currentRoute === 'gujarat' && (
          <DirectoryView
            initialLocationTab="Gujarat"
            pageTitle={t('directory.gujaratPageTitle', undefined, 'Gujarat State Scholarships')}
            pageSubtitle={t('directory.gujaratPageSub', undefined, 'Explore state government initiatives including MYSY, Digital Gujarat Post-Matric, CMSS, Kanya Kelavani, and SHODH.')}
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
            onNavigate={navigateTo}
          />
        )}

        {/* ALL INDIA SCHOLARSHIPS (Route Alias) */}
        {!isDetailRoute && currentRoute === 'all-india' && (
          <DirectoryView
            initialLocationTab="All India"
            pageTitle={t('directory.allIndiaPageTitle', undefined, 'Popular All India Scholarships')}
            pageSubtitle={t('directory.allIndiaPageSub', undefined, 'Discover selected national scholarships by Ministry of Education, AICTE, DST INSPIRE, and premier philanthropic trusts.')}
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
            onNavigate={navigateTo}
          />
        )}

        {/* SAVED SCHOLARSHIPS */}
        {!isDetailRoute && currentRoute === 'saved' && (
          <SavedScholarshipsPage
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
            onExplore={() => navigateTo('explore')}
            onNavigate={navigateTo}
          />
        )}

        {/* ABOUT PAGE */}
        {!isDetailRoute && currentRoute === 'about' && (
          <AboutPage onStartFinder={() => navigateTo('find')} />
        )}

        {/* DEDICATED AI PAGE */}
        {!isDetailRoute && currentRoute === 'ai' && (
          <AIPage
            onNavigate={navigateTo}
            studentAnswers={studentAnswers}
            initialScholarshipId={currentAIScholarshipId}
          />
        )}
        </div>
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Global Modals & Floating Tools */}
      <ComparisonModal />
      <FloatingCompareBar />

      {/* Global AI Assistant System */}
      <AIFloatingButton currentRoute={currentRoute} />
      <AIChatPanel onNavigate={navigateTo} />
    </div>
  </AIProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScholarshipProvider>
          <SavedProvider>
            <CompareProvider>
              <AppContent />
            </CompareProvider>
          </SavedProvider>
        </ScholarshipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
