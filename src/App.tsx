import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SavedProvider } from './context/SavedContext';
import { CompareProvider } from './context/CompareContext';
import { LanguageProvider } from './context/LanguageContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { Features } from './components/home/Features';
import { HowItWorks } from './components/home/HowItWorks';
import { QuestionnaireWizard } from './components/questionnaire/QuestionnaireWizard';
import { ResultsView } from './components/results/ResultsView';
import { DirectoryView } from './components/directory/DirectoryView';
import { SavedScholarshipsPage } from './components/pages/SavedScholarshipsPage';
import { AboutPage } from './components/pages/AboutPage';
import { ScholarshipDetailPage } from './components/scholarship/ScholarshipDetailPage';
import { ComparisonModal, FloatingCompareBar } from './components/scholarship/ComparisonModal';

import { SCHOLARSHIPS_DATA } from './data/scholarships';
import { evaluateAllScholarships, evaluateScholarship } from './engine/eligibilityEngine';
import type { StudentAnswers, MatchResult } from './types/scholarship';

export function AppContent() {
  // Hash-based client route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  });

  // Session-only student answers (No accounts, no permanent profile)
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers | null>(() => {
    try {
      const stored = sessionStorage.getItem('vidyasetu_session_answers');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep session answers in sessionStorage for refreshing finder page
  useEffect(() => {
    if (studentAnswers) {
      sessionStorage.setItem('vidyasetu_session_answers', JSON.stringify(studentAnswers));
    }
  }, [studentAnswers]);

  // Sync hash changes with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      setCurrentRoute(hash || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Questionnaire completion handler
  const handleQuestionnaireComplete = (answers: StudentAnswers) => {
    setStudentAnswers(answers);
    navigateTo('find');
  };

  // Evaluate matches if studentAnswers exist
  const matchResults: MatchResult[] = React.useMemo(() => {
    if (!studentAnswers) return [];
    return evaluateAllScholarships(SCHOLARSHIPS_DATA, studentAnswers);
  }, [studentAnswers]);

  // Check if current route is a dedicated scholarship detail route e.g. "scholarships/mysy-gujarat"
  const isDetailRoute = currentRoute.startsWith('scholarships/');
  const currentDetailSlug = isDetailRoute ? currentRoute.replace('scholarships/', '') : null;
  const currentScholarship = currentDetailSlug
    ? SCHOLARSHIPS_DATA.find((s) => s.slug === currentDetailSlug || s.id === currentDetailSlug)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      <main className="flex-1">
        {/* DEDICATED SCHOLARSHIP DETAIL ROUTE */}
        {isDetailRoute && currentScholarship ? (
          <ScholarshipDetailPage
            scholarship={currentScholarship}
            matchResult={
              studentAnswers
                ? evaluateScholarship(currentScholarship, studentAnswers)
                : undefined
            }
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigateTo('all-scholarships');
              }
            }}
          />
        ) : isDetailRoute && !currentScholarship ? (
          <div className="max-w-md mx-auto py-20 text-center px-4">
            <h2 className="text-xl font-bold">Scholarship Not Found</h2>
            <p className="text-sm text-slate-500 mt-2">
              The scholarship you requested does not exist or may have been updated.
            </p>
            <button
              onClick={() => navigateTo('all-scholarships')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Browse All Scholarships
            </button>
          </div>
        ) : null}

        {/* HOME ROUTE */}
        {!isDetailRoute && (currentRoute === 'home' || currentRoute === '') && (
          <div>
            <Hero
              onFindScholarships={() => navigateTo('find')}
              onExploreScholarships={() => navigateTo('all-scholarships')}
            />
            <Features />
            <HowItWorks onStart={() => navigateTo('find')} />
          </div>
        )}

        {/* FIND SCHOLARSHIPS ROUTE */}
        {!isDetailRoute && currentRoute === 'find' && (
          <div>
            {studentAnswers && matchResults.length > 0 ? (
              <ResultsView
                results={matchResults}
                answers={studentAnswers}
                onRetake={() => {
                  setStudentAnswers(null);
                  sessionStorage.removeItem('vidyasetu_session_answers');
                }}
                onExploreAll={() => navigateTo('all-scholarships')}
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

        {/* ALL SCHOLARSHIPS DIRECTORY */}
        {!isDetailRoute && currentRoute === 'all-scholarships' && (
          <DirectoryView
            initialLocationFilter="all"
            pageTitle="All Scholarships Directory"
            pageSubtitle="Browse and filter through all verified Gujarat state and popular All-India scholarships."
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
          />
        )}

        {/* GUJARAT SCHOLARSHIPS */}
        {!isDetailRoute && currentRoute === 'gujarat' && (
          <DirectoryView
            initialLocationFilter="Gujarat"
            pageTitle="Gujarat State Scholarships"
            pageSubtitle="Explore state government initiatives including MYSY, Digital Gujarat Post-Matric, CMSS, Kanya Kelavani, and SHODH."
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
          />
        )}

        {/* ALL INDIA SCHOLARSHIPS */}
        {!isDetailRoute && currentRoute === 'all-india' && (
          <DirectoryView
            initialLocationFilter="All India"
            pageTitle="Popular All India Scholarships"
            pageSubtitle="Discover selected national scholarships by Ministry of Education, AICTE, DST INSPIRE, and premier philanthropic trusts."
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
          />
        )}

        {/* SAVED SCHOLARSHIPS */}
        {!isDetailRoute && currentRoute === 'saved' && (
          <SavedScholarshipsPage
            onViewScholarshipDetails={(slug) => navigateTo(`scholarships/${slug}`)}
            onExplore={() => navigateTo('all-scholarships')}
          />
        )}

        {/* ABOUT PAGE */}
        {!isDetailRoute && currentRoute === 'about' && (
          <AboutPage onStartFinder={() => navigateTo('find')} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Global Modals & Floating Tools */}
      <ComparisonModal />
      <FloatingCompareBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SavedProvider>
          <CompareProvider>
            <AppContent />
          </CompareProvider>
        </SavedProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
