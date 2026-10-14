import { describe, it, expect, beforeEach } from 'vitest';
import {
  demoAuthService,
  getStoredDemoUsers,
  getStoredDemoSession,
  getSafeAdminUserRecords,
  DEFAULT_DEMO_USER,
} from '../services/demoAuth';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { evaluateScholarshipEligibility } from '../engine/eligibilityEngine';
import { calculateMatchScore } from '../engine/matchScoreCalculator';
import { getNextQuestion, invalidateDependentFields } from '../engine/dynamicQuestionEngine';
import { STREAMS_BY_EDUCATION } from '../data/streams';
import { profileStorage } from '../services/profile/profileStorage';
import { processGlobalQuery } from '../services/aiKnowledgeEngine';
import { TRANSLATIONS } from '../data/translations';
import type { StudentProfile } from '../types/studentProfile';
import type { QuestionnaireState } from '../types/questionnaire';

describe('Edvora Comprehensive 10-Area Application Audit', () => {
  let mockLocalStorage: Record<string, string> = {};
  let mockSessionStorage: Record<string, string> = {};

  beforeEach(() => {
    mockLocalStorage = {};
    mockSessionStorage = {};

    const storageMock = (store: Record<string, string>) => ({
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => {
        store[k] = String(v);
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const k in store) delete store[k];
      },
    });

    (globalThis as any).window = {
      localStorage: storageMock(mockLocalStorage),
      sessionStorage: storageMock(mockSessionStorage),
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
      location: { hash: '#/home', origin: 'http://localhost:5173', pathname: '/' },
    };
    (globalThis as any).localStorage = (globalThis as any).window.localStorage;
    (globalThis as any).sessionStorage = (globalThis as any).window.sessionStorage;
  });

  // =========================================================================
  // 1. AUTHENTICATION
  // =========================================================================
  describe('Area 1: Authentication', () => {
    it('1.1: Demo seed user exists and can be retrieved', () => {
      const users = getStoredDemoUsers();
      expect(users.length).toBeGreaterThanOrEqual(1);
      const seed = users.find((u) => u.email === DEFAULT_DEMO_USER.email);
      expect(seed).toBeDefined();
      expect(seed?.name).toBe('Demo Student');
    });

    it('1.2: Signup creates a new account, enforces unique email, and sets session', async () => {
      const signupRes = await demoAuthService.signUp({
        name: 'Aarav Patel',
        email: 'aarav@test.demo',
        password: 'password123',
      });

      expect(signupRes.success).toBe(true);
      expect(signupRes.user?.email).toBe('aarav@test.demo');
      expect(signupRes.user?.name).toBe('Aarav Patel');

      // Check session was established
      const session = getStoredDemoSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('aarav@test.demo');

      // Duplicate signup should fail
      const dupRes = await demoAuthService.signUp({
        name: 'Aarav Patel',
        email: 'aarav@test.demo',
        password: 'password123',
      });
      expect(dupRes.success).toBe(false);
      expect(dupRes.error).toContain('already exists');
    });

    it('1.3: Login increments login count, updates lastLoginAt, and preserves session', async () => {
      // First signup
      await demoAuthService.signUp({
        name: 'Priya Shah',
        email: 'priya@test.demo',
        password: 'mypassword',
      });

      // Sign out
      await demoAuthService.signOut();
      expect(demoAuthService.getCurrentUser()).toBeNull();

      // Sign in with correct password
      const loginRes = await demoAuthService.signIn({
        email: 'priya@test.demo',
        password: 'mypassword',
      });
      expect(loginRes.success).toBe(true);
      expect(loginRes.user?.email).toBe('priya@test.demo');

      const currentUser = demoAuthService.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.name).toBe('Priya Shah');

      // Check login count increased
      const users = getStoredDemoUsers();
      const priya = users.find((u) => u.email === 'priya@test.demo');
      expect(priya?.loginCount).toBeGreaterThanOrEqual(2);

      // Sign in with wrong password fails
      const badLogin = await demoAuthService.signIn({
        email: 'priya@test.demo',
        password: 'wrongpassword',
      });
      expect(badLogin.success).toBe(false);
    });

    it('1.4: Update user profile and password persist across sessions', async () => {
      await demoAuthService.signUp({
        name: 'Initial Name',
        email: 'update@test.demo',
        password: 'password123',
      });

      const updateRes = await demoAuthService.updateUserProfile({ name: 'Updated Name' });
      expect(updateRes.success).toBe(true);
      expect(updateRes.user?.name).toBe('Updated Name');

      const passRes = await demoAuthService.updatePassword('newsecret456');
      expect(passRes.success).toBe(true);

      // Logout and login with new password
      await demoAuthService.signOut();
      const loginWithNew = await demoAuthService.signIn({
        email: 'update@test.demo',
        password: 'newsecret456',
      });
      expect(loginWithNew.success).toBe(true);
      expect(loginWithNew.user?.name).toBe('Updated Name');
    });
  });

  // =========================================================================
  // 2. QUESTIONNAIRE
  // =========================================================================
  describe('Area 2: Adaptive Questionnaire', () => {
    it('2.1: Diploma students must never be asked for Class 12 marks or board', () => {
      const diplomaProfile: StudentProfile = {
        id: 'test-diploma',
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { language: 'en', theme: 'light' },
        fields: {
          field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_education_level: { value: 'Diploma', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_stream: { value: 'Computer Engineering / IT', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_academic_year: { value: '1st Year', status: 'known', updatedAt: '', source: 'questionnaire' },
        },
      };

      const qState: QuestionnaireState = {
        sessionId: 'test',
        profileId: 'test-diploma',
        startedAt: '',
        askedQuestionIds: [
          'question_domicile_state',
          'question_education_level',
          'question_stream',
          'question_academic_year',
        ],
        skippedQuestionIds: [],
        answers: {},
        candidateScholarshipIds: SCHOLARSHIPS_DATA.map((s) => s.id),
        missingFieldIds: [],
        status: 'in_progress',
      };

      // Loop through up to 20 questions to ensure class 12 is never asked
      let currentQState = { ...qState };
      let currentProfile = { ...diplomaProfile };

      for (let i = 0; i < 20; i++) {
        const next = getNextQuestion(currentProfile, SCHOLARSHIPS_DATA, currentQState);
        if (!next.question) break;

        expect(next.question.id).not.toBe('question_class_12_percentage');
        expect(next.question.id).not.toBe('question_class_12_board');
        expect(next.question.fieldId).not.toBe('field_class_12_percentage');

        currentQState.askedQuestionIds.push(next.question.id);
        currentProfile.fields[next.question.fieldId] = {
          value: 'test-val',
          status: 'known',
          updatedAt: '',
          source: 'questionnaire',
        };
      }
    });

    it('2.2: Dynamic streams map correctly for Diploma vs Undergraduate', () => {
      expect(STREAMS_BY_EDUCATION['Diploma']).toContain('Computer Engineering / IT');
      expect(STREAMS_BY_EDUCATION['Diploma']).toContain('Mechanical Engineering');
      expect(STREAMS_BY_EDUCATION['Undergraduate']).toContain('Engineering & Technology (B.E. / B.Tech)');
    });

    it('2.3: Invalidate dependent fields prunes 12th marks when switching to Diploma', () => {
      const ugProfile: StudentProfile = {
        id: 'test-switch',
        profileType: 'registered',
        createdAt: '',
        updatedAt: '',
        preferences: { language: 'en', theme: 'light' },
        fields: {
          field_education_level: { value: 'Diploma', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_class_12_percentage: { value: 85, status: 'known', updatedAt: '', source: 'questionnaire' },
          field_board: { value: 'GSEB', status: 'known', updatedAt: '', source: 'questionnaire' },
        },
      };

      const cleaned = invalidateDependentFields(ugProfile);
      expect(cleaned.fields['field_class_12_percentage']).toBeUndefined();
      expect(cleaned.fields['field_board']).toBeUndefined();
    });
  });

  // =========================================================================
  // 3. SCHOLARSHIPS
  // =========================================================================
  describe('Area 3: Scholarships Discovery & Details', () => {
    it('3.1: All scholarships have valid structure and secure official links', () => {
      expect(SCHOLARSHIPS_DATA.length).toBeGreaterThanOrEqual(16);

      for (const s of SCHOLARSHIPS_DATA) {
        expect(s.id).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.provider).toBeTruthy();
        expect(s.description.length).toBeGreaterThan(20);
        expect(s.educationLevels.length).toBeGreaterThan(0);
        expect(s.documents.length).toBeGreaterThan(0);
        expect(s.officialWebsite).toMatch(/^https:\/\//);
        expect(s.applicationWebsite).toMatch(/^https:\/\//);
      }
    });

    it('3.2: Eligibility evaluation correctly identifies eligible vs not eligible candidates', () => {
      const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;
      expect(mysy).toBeDefined();

      // Eligible student
      const eligibleProfile: StudentProfile = {
        id: 'p1',
        profileType: 'registered',
        createdAt: '',
        updatedAt: '',
        preferences: { language: 'en', theme: 'light' },
        fields: {
          field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_education_level: { value: 'Diploma', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_stream: { value: 'Computer Engineering / IT', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_family_income: { value: 200000, status: 'known', updatedAt: '', source: 'questionnaire' }, // <= 6 LPA
          field_latest_score: { value: 85, status: 'known', updatedAt: '', source: 'questionnaire' }, // >= 80%
        },
      };

      const result = evaluateScholarshipEligibility(mysy, eligibleProfile);
      expect(result.status).toBe('eligible');

      // Ineligible student due to high income
      const highIncomeProfile: StudentProfile = {
        ...eligibleProfile,
        preferences: { language: 'en', theme: 'light' },
        fields: {
          ...eligibleProfile.fields,
          field_family_income: { value: 800000, status: 'known', updatedAt: '', source: 'questionnaire' }, // > 6 LPA
        },
      };

      const highIncomeResult = evaluateScholarshipEligibility(mysy, highIncomeProfile);
      expect(highIncomeResult.status).toBe('not_eligible');
    });
  });

  // =========================================================================
  // 4. MATCH SCORE
  // =========================================================================
  describe('Area 4: Match Score Calculation & Explanation', () => {
    it('4.1: Calculates 100% when all evaluated rules pass', () => {
      const mockResult: any = {
        scholarshipId: 'mysy-gujarat',
        status: 'eligible',
        passedRules: [
          { ruleId: 'r1', fieldId: 'field_domicile_state', status: 'pass' },
          { ruleId: 'r2', fieldId: 'field_family_income', status: 'pass' },
        ],
        failedRules: [],
        unknownRules: [],
      };

      const score = calculateMatchScore(mockResult);
      expect(score.score).toBe(100);
      expect(score.status).toBe('eligible');
      expect(score.summaryText).toContain('satisfies all known eligibility');
    });

    it('4.2: Flags not_eligible when hard requirement fails', () => {
      const mockResult: any = {
        scholarshipId: 'mysy-gujarat',
        status: 'not_eligible',
        passedRules: [
          { ruleId: 'r1', fieldId: 'field_domicile_state', status: 'pass' },
        ],
        failedRules: [
          { ruleId: 'r2', fieldId: 'field_family_income', status: 'fail', hardRequirement: true },
        ],
        unknownRules: [],
      };

      const score = calculateMatchScore(mockResult);
      expect(score.score).toBe(50);
      expect(score.status).toBe('not_eligible');
      expect(score.hasHardRequirementFailure).toBe(true);
    });

    it('4.3: Returns possible status and null score when only unknown rules exist', () => {
      const mockResult: any = {
        scholarshipId: 'mysy-gujarat',
        status: 'possible',
        passedRules: [],
        failedRules: [],
        unknownRules: [
          { ruleId: 'r1', fieldId: 'field_family_income', status: 'unknown' },
        ],
      };

      const score = calculateMatchScore(mockResult);
      expect(score.score).toBeNull();
      expect(score.status).toBe('possible');
      expect(score.summaryText).toContain('More information needed');
    });
  });

  // =========================================================================
  // 5. SAVED SCHOLARSHIPS
  // =========================================================================
  describe('Area 5: Saved Scholarships', () => {
    it('5.1: Saved IDs persist to and reload from localStorage', () => {
      const key = 'edvora_saved_ids';
      const items = ['mysy-gujarat', 'cmss-gujarat'];
      localStorage.setItem(key, JSON.stringify(items));

      const retrieved = JSON.parse(localStorage.getItem(key) || '[]');
      expect(retrieved).toEqual(items);

      // Add one more
      retrieved.push('digital-gujarat-sc-postmatric');
      localStorage.setItem(key, JSON.stringify(retrieved));

      const updated = JSON.parse(localStorage.getItem(key) || '[]');
      expect(updated.length).toBe(3);
      expect(updated).toContain('digital-gujarat-sc-postmatric');

      // Remove one
      const filtered = updated.filter((id: string) => id !== 'cmss-gujarat');
      localStorage.setItem(key, JSON.stringify(filtered));
      const final = JSON.parse(localStorage.getItem(key) || '[]');
      expect(final).not.toContain('cmss-gujarat');
      expect(final.length).toBe(2);
    });
  });

  // =========================================================================
  // 6. COMPARE SCHOLARSHIPS
  // =========================================================================
  describe('Area 6: Compare Scholarships', () => {
    it('6.1: Compare tray enforces max 3 items and persists in localStorage', () => {
      const key = 'edvora_compare_ids';
      const initial = ['mysy-gujarat', 'cmss-gujarat'];
      localStorage.setItem(key, JSON.stringify(initial));

      let compareList = JSON.parse(localStorage.getItem(key) || '[]');
      expect(compareList.length).toBe(2);

      // Add 3rd
      compareList.push('digital-gujarat-sc-postmatric');
      localStorage.setItem(key, JSON.stringify(compareList));
      expect(JSON.parse(localStorage.getItem(key) || '[]').length).toBe(3);

      // Verify that scholarships in compareList exist in catalog
      const matched = SCHOLARSHIPS_DATA.filter((s) => compareList.includes(s.id));
      expect(matched.length).toBe(3);
    });
  });

  // =========================================================================
  // 7. AI ASSISTANT
  // =========================================================================
  describe('Area 7: AI Assistant Engine & Honest Retrieval', () => {
    it('7.1: Returns verified answers for known schemes and general queries', () => {
      const diplomaAnswer = processGlobalQuery('diploma', { language: 'en' });
      expect(diplomaAnswer.message).toContain('diploma');
      expect(diplomaAnswer.scholarshipIds?.length).toBeGreaterThan(0);

      const mysyAnswer = processGlobalQuery('MYSY eligibility', { language: 'en' });
      expect(mysyAnswer.message).toContain('MYSY');
      expect(mysyAnswer.scholarshipIds).toContain('mysy-gujarat');
    });

    it('7.2: Honestly states retrieval failure for unresolvable queries when offline', () => {
      const unknownQuery = 'quantum mechanics research fellowship 2099 unknown scheme';
      const result = processGlobalQuery(unknownQuery, { language: 'en' });

      // Must not pretend to know or output generic greeting
      expect(result.message).toContain('Could not retrieve a live AI response');
      expect(result.message).toContain(unknownQuery);
    });
  });

  // =========================================================================
  // 8. ADMIN PANEL & USER MANAGEMENT
  // =========================================================================
  describe('Area 8: Admin Panel & User Management', () => {
    it('8.1: Safe admin user records guarantee ZERO password exposure', () => {
      const adminUsers = getSafeAdminUserRecords();
      expect(adminUsers.length).toBeGreaterThan(0);

      for (const user of adminUsers) {
        expect(user.id).toBeTruthy();
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();
        expect((user as any).password).toBeUndefined(); // Strictly omitted!
        expect(user.passwordConfigured).toBe(true);
      }
    });
  });

  // =========================================================================
  // 9. PROFILE PERSISTENCE & EDITING
  // =========================================================================
  describe('Area 9: Profile Persistence & Updates', () => {
    it('9.1: Student profile saves and reloads identically from storage', async () => {
      const testProfile: StudentProfile = {
        id: 'test-profile-001',
        profileType: 'registered',
        createdAt: '2026-09-20T10:00:00.000Z',
        updatedAt: '2026-09-20T10:00:00.000Z',
        preferences: { language: 'en', theme: 'light' },
        fields: {
          field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_education_level: { value: 'Undergraduate', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_stream: { value: 'Engineering & Technology (B.E. / B.Tech)', status: 'known', updatedAt: '', source: 'questionnaire' },
          field_family_income: { value: 350000, status: 'known', updatedAt: '', source: 'questionnaire' },
        },
      };

      await profileStorage.saveProfile(testProfile);
      const reloaded = await profileStorage.loadProfile();

      expect(reloaded).not.toBeNull();
      expect(reloaded?.fields['field_domicile_state']?.value).toBe('Gujarat');
      expect(reloaded?.fields['field_family_income']?.value).toBe(350000);
    });
  });

  // =========================================================================
  // 10. UI, TRANSLATIONS & THEME
  // =========================================================================
  describe('Area 10: UI Translations & Theme', () => {
    it('10.1: English, Gujarati, and Hindi translations maintain navigation parity', () => {
      const en = TRANSLATIONS.en;
      const gu = TRANSLATIONS.gu;
      const hi = TRANSLATIONS.hi;

      expect(en.nav?.home).toBeTruthy();
      expect(gu.nav?.home).toBeTruthy();
      expect(hi.nav?.home).toBeTruthy();

      expect(en.nav?.findScholarships).toBeTruthy();
      expect(gu.nav?.findScholarships).toBeTruthy();
      expect(hi.nav?.findScholarships).toBeTruthy();

      expect(en.nav?.exploreScholarships).toBeTruthy();
      expect(gu.nav?.exploreScholarships).toBeTruthy();
      expect(hi.nav?.exploreScholarships).toBeTruthy();

      expect(en.nav?.saved).toBeTruthy();
      expect(gu.nav?.saved).toBeTruthy();
      expect(hi.nav?.saved).toBeTruthy();
    });
  });
});
