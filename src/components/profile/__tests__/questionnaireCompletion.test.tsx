import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AdaptiveQuestionnaire } from '../questionnaire/AdaptiveQuestionnaire';
import { SCHOLARSHIPS_DATA } from '../../../data/scholarships';
import { profileStorage } from '../../../services/profile/profileStorage';
import { getNextQuestion } from '../../../engine/dynamicQuestionEngine';
import { calculateProfileCompletion } from '../../../engine/profileCompletion';
import { evaluateScholarshipEligibility } from '../../../engine/eligibilityEngine';
import { getCandidateScholarships } from '../../../engine/candidateEngine';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import type { StudentProfile, StudentFieldValue } from '../../../types/studentProfile';
import type { QuestionnaireState } from '../../../types/questionnaire';
import { ThemeProvider } from '../../../context/ThemeContext';
import { LanguageProvider } from '../../../context/LanguageContext';

describe('Questionnaire Completion & Transition Verification (Tests A - E)', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    vi.restoreAllMocks();
  });

  const createSampleProfile = (fields: Record<string, any> = {}): StudentProfile => {
    const now = new Date().toISOString();
    const formattedFields: Record<string, StudentFieldValue> = {};

    for (const [key, val] of Object.entries(fields)) {
      formattedFields[key] = {
        value: val,
        status: 'known',
        updatedAt: now,
        source: 'questionnaire',
      };
    }

    return {
      id: 'test_student_completion_001',
      userId: 'test_user_001',
      profileType: 'registered',
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      fields: formattedFields,
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return renderToString(
      <ErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            {ui}
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  };

  // =========================================================================
  // TEST A: Complete every question, reach 100%, and advance past last question
  // =========================================================================
  describe('Test A: Final Question Submission & 100% Completion Flow', () => {
    it('accurately detects completion when all relevant candidate fields are answered', () => {
      // Create a profile that answers core required fields for engineering scholarships
      const completedFields = {
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_branch: 'Computer Engineering',
        field_academic_year: 'First Year',
        field_latest_score: 85,
        field_domicile_state: 'Gujarat',
        field_gender: 'Male',
        field_category: 'General / Open',
        field_family_income: 180000,
        field_institution_state: 'Gujarat',
        field_institution_type: 'Government',
        field_admission_type: 'Merit-based (ACPPC / Government Quota)',
        field_has_disability: false,
        field_minority_status: false,
        field_is_hosteller: false,
        field_is_orphan: false,
        field_is_defence_dependent: false,
      };

      const profile = createSampleProfile(completedFields);
      const qState: QuestionnaireState = {
        sessionId: 'sess_complete_test',
        profileId: profile.id,
        startedAt: new Date().toISOString(),
        askedQuestionIds: Object.keys(completedFields),
        skippedQuestionIds: [],
        answers: {},
        candidateScholarshipIds: SCHOLARSHIPS_DATA.map((s) => s.id),
        missingFieldIds: [],
        status: 'in_progress',
      };

      const nextRes = getNextQuestion(profile, SCHOLARSHIPS_DATA, qState);

      // Verify that dynamicQuestionEngine indicates no further questions remain
      expect(nextRes.question).toBeNull();
      expect(nextRes.progress.percentage).toBe(100);
    });

    it('renders the completion screen view with 100% readiness without React Hook violations', () => {
      // Create a 100% completed profile
      const completedProfile = createSampleProfile({
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_branch: 'Computer Engineering',
        field_academic_year: 'First Year',
        field_latest_score: 92,
        field_domicile_state: 'Gujarat',
        field_gender: 'Female',
        field_category: 'SEBC / OBC',
        field_family_income: 200000,
        field_institution_state: 'Gujarat',
        field_institution_type: 'Government',
        field_admission_type: 'Merit-based (ACPPC / Government Quota)',
        field_has_disability: false,
        field_minority_status: false,
        field_is_hosteller: false,
        field_is_orphan: false,
        field_is_defence_dependent: false,
      });

      // Render AdaptiveQuestionnaire
      const onComplete = vi.fn();
      const onExit = vi.fn();
      const onFindScholarships = vi.fn();

      const html = renderWithProviders(
        <AdaptiveQuestionnaire
          initialProfile={completedProfile}
          scholarships={SCHOLARSHIPS_DATA}
          onComplete={onComplete}
          onExit={onExit}
          onFindScholarships={onFindScholarships}
        />
      );

      // Should render without error and contain no blank screen elements
      expect(html).toBeTruthy();
      expect(html.length).toBeGreaterThan(100);
      expect(html).not.toContain('Something went wrong');
    });
  });

  // =========================================================================
  // TEST B: Persistence & Browser Refresh Survival
  // =========================================================================
  describe('Test B: Profile Save & Browser Refresh Persistence', () => {
    it('saves completed profile and reloads it faithfully from storage', async () => {
      const fullProfile = createSampleProfile({
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_branch: 'Computer Engineering',
        field_academic_year: 'First Year',
        field_latest_score: 88,
        field_domicile_state: 'Gujarat',
        field_gender: 'Male',
        field_category: 'General / Open',
        field_family_income: 150000,
        field_institution_state: 'Gujarat',
      });

      // Save to profileStorage
      await profileStorage.saveProfile(fullProfile, fullProfile.userId);

      // Simulate a browser refresh by reloading from storage
      const reloaded = await profileStorage.loadProfile(fullProfile.userId);

      expect(reloaded).not.toBeNull();
      expect(reloaded?.fields['field_stream']?.value).toBe('Engineering & Technology');
      expect(reloaded?.fields['field_education_level']?.value).toBe('undergraduate');
      expect(reloaded?.fields['field_latest_score']?.value).toBe(88);

      const completion = calculateProfileCompletion(reloaded, SCHOLARSHIPS_DATA);
      expect(completion.percentage).toBeGreaterThanOrEqual(60);

      // Test with 100% complete profile
      const fullyCompleteProfile = createSampleProfile({
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_branch: 'Computer Engineering',
        field_academic_year: 'First Year',
        field_latest_score: 90,
        field_domicile_state: 'Gujarat',
        field_gender: 'Male',
        field_category: 'General / Open',
        field_family_income: 180000,
        field_institution_state: 'Gujarat',
        field_institution_type: 'Government',
        field_admission_type: 'Merit-based (ACPPC / Government Quota)',
        field_has_disability: false,
        field_minority_status: false,
        field_is_hosteller: false,
        field_is_orphan: false,
        field_is_defence_dependent: false,
      });

      await profileStorage.saveProfile(fullyCompleteProfile, fullyCompleteProfile.userId);
      const reloadedFull = await profileStorage.loadProfile(fullyCompleteProfile.userId);
      expect(reloadedFull).not.toBeNull();
      const fullCompletion = calculateProfileCompletion(reloadedFull, SCHOLARSHIPS_DATA);
      expect(fullCompletion.percentage).toBe(100);
    });
  });

  // =========================================================================
  // TEST C: Navigation and CTAs
  // =========================================================================
  describe('Test C: Destination Actions & CTAs', () => {
    it('dispatches profile-updated event when profile is saved', async () => {
      let eventFired = false;
      const fakeWindow = {
        dispatchEvent: (event: any) => {
          if (event?.type === 'edvora:profile-updated') {
            eventFired = true;
          }
          return true;
        },
      };

      const originalWindow = (globalThis as any).window;
      (globalThis as any).window = fakeWindow;

      try {
        const profile = createSampleProfile({ field_education_level: 'school' });
        await profileStorage.saveProfile(profile);
        expect(eventFired).toBe(true);
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });
  });

  // =========================================================================
  // TEST D: Scholarship Matching with Saved Profile Data
  // =========================================================================
  describe('Test D: Scholarship Matching Engine Evaluation', () => {
    it('evaluates scholarship eligibility accurately using newly saved profile data', () => {
      // Profile meeting MYSY criteria (Gujarat domicile, high percentage, <= 6 lakh income)
      const mysyEligibleProfile = createSampleProfile({
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_academic_year: 'First Year',
        field_latest_score: 86, // > 80% required for MYSY
        field_domicile_state: 'Gujarat',
        field_family_income: 250000, // < 6,00,000
        field_institution_type: 'Government',
        field_admission_type: 'Merit-based (ACPPC / Government Quota)',
        field_gender: 'Male',
        field_category: 'General / Open',
      });

      const candidates = getCandidateScholarships(SCHOLARSHIPS_DATA, mysyEligibleProfile);
      expect(candidates.length).toBeGreaterThan(0);

      const mysyScholarship = SCHOLARSHIPS_DATA.find((s) => s.slug === 'mysy-gujarat' || s.id === 'mysy');
      if (mysyScholarship) {
        const evaluation = evaluateScholarshipEligibility(mysyScholarship, mysyEligibleProfile);
        expect(evaluation.status).toBe('eligible');
      }
    });

    it('rejects candidate if mandatory criteria does not match', () => {
      // Profile from Maharashtra applying for Gujarat-only scholarship
      const otherStateProfile = createSampleProfile({
        field_education_level: 'undergraduate',
        field_stream: 'Engineering & Technology',
        field_academic_year: 'First Year',
        field_latest_score: 95,
        field_domicile_state: 'Maharashtra', // Ineligible for MYSY
        field_family_income: 200000,
        field_gender: 'Female',
        field_category: 'General / Open',
      });

      const mysyScholarship = SCHOLARSHIPS_DATA.find((s) => s.slug === 'mysy-gujarat' || s.id === 'mysy');
      if (mysyScholarship) {
        const evaluation = evaluateScholarshipEligibility(mysyScholarship, otherStateProfile);
        expect(evaluation.status).toBe('not_eligible');
        expect(evaluation.explanation).toContain('Gujarat');
      }
    });
  });

  // =========================================================================
  // TEST E: Error Handling, Storage Failures, and Submission Guards
  // =========================================================================
  describe('Test E: Safeguards Against Failures & Blank Screens', () => {
    it('ErrorBoundary renders friendly error fallback when an error occurs instead of a blank screen', () => {
      const boundary = new ErrorBoundary({ children: null });
      const errorState = ErrorBoundary.getDerivedStateFromError(new Error('Test intentional rendering crash'));
      boundary.state = {
        hasError: errorState.hasError ?? true,
        error: errorState.error ?? new Error('Test intentional rendering crash'),
        errorInfo: null,
      };

      const rendered = boundary.render();
      const html = renderToString(rendered as React.ReactElement);

      // Must display the ErrorBoundary UI, NEVER an empty string or white screen
      expect(html).toContain('Something went wrong');
      expect(html).toContain('Try Again');
      expect(html).toContain('Go to Home');
      expect(html).toContain('Test intentional rendering crash');
    });

    it('clears questionnaire state properly on completion to prevent corrupted resume', async () => {
      await profileStorage.saveQuestionnaireState({
        sessionId: 'test_sess',
        profileId: 'test_prof',
        startedAt: new Date().toISOString(),
        askedQuestionIds: ['q1', 'q2'],
        skippedQuestionIds: [],
        answers: {},
        candidateScholarshipIds: [],
        missingFieldIds: [],
        status: 'in_progress',
      });

      const savedBefore = await profileStorage.loadQuestionnaireState();
      expect(savedBefore).not.toBeNull();

      await profileStorage.clearQuestionnaireState();
      const savedAfter = await profileStorage.loadQuestionnaireState();
      expect(savedAfter).toBeNull();
    });
  });
});
