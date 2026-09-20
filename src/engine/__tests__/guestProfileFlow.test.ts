import { describe, it, expect, beforeEach } from 'vitest';
import type { StudentProfile } from '../../types/studentProfile';
import type { Scholarship } from '../../types/scholarship';
import type { QuestionnaireState } from '../../types/questionnaire';
import { getNextQuestion } from '../dynamicQuestionEngine';
import { calculateProfileCompletion } from '../profileCompletion';
import { evaluateScholarshipEligibility } from '../eligibilityEngine';
import { getCandidateScholarships } from '../candidateEngine';
import { LocalStorageProfileStorage } from '../../services/profile/profileStorage';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';

class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('EDVORA — Guest Profile, Questionnaire & Scholarship Eligibility Flow (Section 27)', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: new MockLocalStorage(),
    };
  });

  // 1. NEW GUEST
  it('Scenario 1 (New Guest): Starts without an account, initializes as guest, gets 0% readiness and foundational question', async () => {
    const storage = new LocalStorageProfileStorage();

    const newGuestProfile: StudentProfile = {
      id: 'guest_visitor_001',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {},
      preferences: {
        language: 'en',
        theme: 'system',
      },
    };

    // Verify guest type and 0% completion
    expect(newGuestProfile.profileType).toBe('guest');
    const completion = calculateProfileCompletion(newGuestProfile);
    expect(completion.percentage).toBe(0);
    expect(completion.knownFields).toBe(0);

    // Persist to local storage
    await storage.saveProfile(newGuestProfile);
    const loaded = await storage.loadProfile();
    expect(loaded).not.toBeNull();
    expect(loaded?.profileType).toBe('guest');

    // Dynamic question engine returns the initial foundational question
    const qState: QuestionnaireState = {
      profileId: newGuestProfile.id,
      sessionId: 'sess_001',
      startedAt: new Date().toISOString(),
      askedQuestionIds: [],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: SCHOLARSHIPS_DATA.map((s) => s.id),
      missingFieldIds: [],
      status: 'in_progress',
    };

    const nextQ = getNextQuestion(newGuestProfile, SCHOLARSHIPS_DATA, qState);
    expect(nextQ.question).not.toBeNull();
    // High-yield foundational questions for India scholarships
    expect(['field_education_level', 'field_domicile_state']).toContain(nextQ.question?.fieldId);
  });

  // 2. RETURNING GUEST
  it('Scenario 2 (Returning Guest): Rehydrates saved answers from localStorage without re-asking known fields', async () => {
    const storage = new LocalStorageProfileStorage();

    const previousProfile: StudentProfile = {
      id: 'guest_visitor_002',
      profileType: 'guest',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'Undergraduate',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: {
        language: 'gu',
        theme: 'dark',
      },
    };

    await storage.saveProfile(previousProfile);

    // Rehydrate as returning guest
    const loaded = await storage.loadProfile();
    expect(loaded).not.toBeNull();
    expect(loaded?.profileType).toBe('guest');
    expect(loaded?.fields['field_education_level'].value).toBe('Undergraduate');
    expect(loaded?.fields['field_domicile_state'].value).toBe('Gujarat');

    const qState: QuestionnaireState = {
      profileId: loaded!.id,
      sessionId: 'sess_returning',
      startedAt: new Date().toISOString(),
      askedQuestionIds: ['q_education_level', 'q_domicile_state'],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: SCHOLARSHIPS_DATA.map((s) => s.id),
      missingFieldIds: [],
      status: 'in_progress',
    };

    const nextQ = getNextQuestion(loaded!, SCHOLARSHIPS_DATA, qState);
    expect(nextQ.question).not.toBeNull();
    // Must NOT re-ask already known fields
    expect(nextQ.question?.fieldId).not.toBe('field_education_level');
    expect(nextQ.question?.fieldId).not.toBe('field_domicile_state');
  });

  // 3. MISSING INFORMATION FLOW (INCOME)
  it('Scenario 3 (Missing Information): Yields "possible" with missingFields when income is missing, then flips to "eligible" when income is provided', () => {
    const incomeScholarship: Scholarship = {
      ...SCHOLARSHIPS_DATA[0],
      id: 'test_income_scholarship',
      name: 'Gujarat Higher Education Need Grant',
      slug: 'gujarat-need-grant',
      provider: 'Gujarat Education Department',
      description: 'Financial assistance for undergraduate students in Gujarat with family income up to 2.5 Lakhs.',
      educationLevels: ['Undergraduate'],
      state: 'Gujarat',
      categories: ['All'],
      type: 'Government',
      benefits: {
        amountDescription: '₹25,000 per year',
      },
      applicationDeadline: '2026-12-31',
      eligibility: {
        requiredFields: ['field_education_level', 'field_domicile_state', 'field_family_income'],
        rules: {
          operator: 'AND',
          rules: [
            {
              id: 'rule_edu',
              fieldId: 'field_education_level',
              operator: 'equals',
              value: 'Undergraduate',
              hardRequirement: true,
              description: 'Must be enrolled in Undergraduate degree',
            },
            {
              id: 'rule_state',
              fieldId: 'field_domicile_state',
              operator: 'equals',
              value: 'Gujarat',
              hardRequirement: true,
              description: 'Must be Gujarat domicile',
            },
            {
              id: 'rule_income',
              fieldId: 'field_family_income',
              operator: 'less_than_or_equal',
              value: 250000,
              hardRequirement: true,
              description: 'Annual family income must not exceed ₹2,50,000',
            },
          ],
        },
      },
    };

    // Guest profile lacking income
    let profile: StudentProfile = {
      id: 'guest_missing_info',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'Undergraduate',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    // Step 1: Initial evaluation yields possible match
    const result1 = evaluateScholarshipEligibility(incomeScholarship, profile);
    expect(result1.status).toBe('possible');
    expect(result1.missingFields).toContain('field_family_income');
    expect(result1.passedRules.length).toBe(2);

    // Step 2: Targeted question flow updates family income
    profile = {
      ...profile,
      fields: {
        ...profile.fields,
        field_family_income: {
          value: 180000, // 1.8 Lakhs <= 2.5 Lakhs
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
    };

    // Step 3: Re-evaluation flips immediately to eligible
    const result2 = evaluateScholarshipEligibility(incomeScholarship, profile);
    expect(result2.status).toBe('eligible');
    expect(result2.missingFields.length).toBe(0);
    expect(result2.passedRules.length).toBe(3);
  });

  // 4. UNKNOWN / NOT SURE FLOW
  it('Scenario 4 (Unknown / Not Sure): Answering "Not sure" sets status: "unknown" and does not fabricate eligibility', () => {
    const meritScholarship: Scholarship = {
      ...SCHOLARSHIPS_DATA[0],
      id: 'test_merit_scholarship',
      name: 'National Merit Grant',
      slug: 'national-merit-grant',
      provider: 'National Education Council',
      description: 'Merit scholarship requiring at least 80% marks.',
      educationLevels: ['Undergraduate'],
      state: 'All India',
      categories: ['All'],
      type: 'Government',
      benefits: { amountDescription: '₹50,000' },
      applicationDeadline: '2026-12-31',
      eligibility: {
        requiredFields: ['field_latest_score'],
        rules: {
          operator: 'AND',
          rules: [
            {
              id: 'rule_min_score',
              fieldId: 'field_latest_score',
              operator: 'greater_than_or_equal',
              value: 80,
              hardRequirement: true,
              description: 'Must have at least 80% marks',
            },
          ],
        },
      },
    };

    // Student answered "Not sure" for score
    const profileWithUnknown: StudentProfile = {
      id: 'guest_unknown_score',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_latest_score: {
          value: null,
          status: 'unknown',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    const result = evaluateScholarshipEligibility(meritScholarship, profileWithUnknown);

    // Hard requirement MUST NOT be assumed to pass
    expect(result.status).toBe('possible');
    expect(result.missingFields).toContain('field_latest_score');
  });

  // 5. NOT ELIGIBLE FLOW
  it('Scenario 5 (Not Eligible): Fails hard criteria deterministically with failedRules listed', () => {
    const gujaratOnlyScholarship: Scholarship = {
      ...SCHOLARSHIPS_DATA[0],
      id: 'test_gujarat_only',
      name: 'Gujarat Domicile Engineering Award',
      slug: 'gujarat-engineering-award',
      provider: 'Govt of Gujarat',
      description: 'Exclusively for Gujarat state residents.',
      educationLevels: ['Undergraduate'],
      state: 'Gujarat',
      categories: ['All'],
      type: 'Government',
      benefits: { amountDescription: '₹30,000' },
      applicationDeadline: '2026-12-31',
      eligibility: {
        requiredFields: ['field_domicile_state'],
        rules: {
          operator: 'AND',
          rules: [
            {
              id: 'rule_domicile_gujarat',
              fieldId: 'field_domicile_state',
              operator: 'equals',
              value: 'Gujarat',
              hardRequirement: true,
              description: 'Must be a bona fide resident of Gujarat',
            },
          ],
        },
      },
    };

    const outOfStateProfile: StudentProfile = {
      id: 'guest_out_of_state',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_domicile_state: {
          value: 'Maharashtra', // Disqualifier
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    const result = evaluateScholarshipEligibility(gujaratOnlyScholarship, outOfStateProfile);
    expect(result.status).toBe('not_eligible');
    expect(result.failedRules.length).toBe(1);
    expect(result.failedRules[0].fieldId).toBe('field_domicile_state');
  });

  // 6. GUEST SAVE FLOW (ISOLATION ACROSS PROFILE RESET)
  it('Scenario 6 (Guest Save): Saved scholarships are stored locally and preserved across profile resets', async () => {
    const storage = new LocalStorageProfileStorage();

    // Simulate guest profile with answers
    const guestProfile: StudentProfile = {
      id: 'guest_saver',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'Diploma',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    await storage.saveProfile(guestProfile);

    // Guest saves 3 scholarships into localStorage
    const savedScholarshipIds = ['sch_01', 'sch_02', 'sch_03'];
    window.localStorage.setItem('edvora_saved_v1', JSON.stringify(savedScholarshipIds));

    // Verify saved list is in storage
    expect(JSON.parse(window.localStorage.getItem('edvora_saved_v1')!)).toEqual(savedScholarshipIds);

    // Guest resets their profile
    await storage.clearProfile();

    // Profile is cleared
    const loadedProfile = await storage.loadProfile();
    expect(loadedProfile).toBeNull();

    // Saved scholarships remain 100% intact
    const remainingSaved = JSON.parse(window.localStorage.getItem('edvora_saved_v1')!);
    expect(remainingSaved).toEqual(savedScholarshipIds);
  });

  // 7. GUEST COMPARE FLOW (ISOLATION ACROSS PROFILE RESET)
  it('Scenario 7 (Guest Compare): Comparison list is preserved locally across profile resets', async () => {
    const storage = new LocalStorageProfileStorage();

    const compareScholarshipIds = ['mysy-scheme', 'digital-gujarat'];
    window.localStorage.setItem('edvora_compare_v1', JSON.stringify(compareScholarshipIds));

    // Reset profile
    await storage.clearProfile();

    // Comparison list remains intact
    const remainingCompare = JSON.parse(window.localStorage.getItem('edvora_compare_v1')!);
    expect(remainingCompare).toEqual(compareScholarshipIds);
  });

  // 8. FUTURE REGISTERED ACCOUNT MIGRATION READINESS
  it('Scenario 8 (Future Auth Compatibility): Profile can be associated with registered userId without altering matching evaluations', async () => {
    const storage = new LocalStorageProfileStorage();

    // Completed guest profile
    const richGuestProfile: StudentProfile = {
      id: 'guest_to_migrate',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'Undergraduate',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
        field_family_income: {
          value: 200000,
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
        field_latest_score: {
          value: 85,
          status: 'known',
          source: 'questionnaire',
          updatedAt: new Date().toISOString(),
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    // Calculate guest candidate and eligibility results
    const guestCandidates = getCandidateScholarships(SCHOLARSHIPS_DATA, richGuestProfile);
    const guestEvaluations = guestCandidates.map((s) => ({
      id: s.id,
      res: evaluateScholarshipEligibility(s, richGuestProfile),
    }));

    // Perform future account linking without touching fields or answers
    const registeredProfile: StudentProfile = {
      ...richGuestProfile,
      profileType: 'registered',
      userId: 'auth_usr_edvora_888',
      updatedAt: new Date().toISOString(),
    };

    await storage.saveProfile(registeredProfile);
    const loadedRegistered = await storage.loadProfile();

    expect(loadedRegistered).not.toBeNull();
    expect(loadedRegistered?.profileType).toBe('registered');
    expect(loadedRegistered?.userId).toBe('auth_usr_edvora_888');
    expect(Object.keys(loadedRegistered!.fields).length).toBe(4);

    // Verify candidate engine and eligibility results remain 100% consistent
    const regCandidates = getCandidateScholarships(SCHOLARSHIPS_DATA, loadedRegistered!);
    expect(regCandidates.map((s) => s.id)).toEqual(guestCandidates.map((s) => s.id));

    const regEvaluations = regCandidates.map((s) => ({
      id: s.id,
      res: evaluateScholarshipEligibility(s, loadedRegistered!),
    }));

    for (let i = 0; i < guestEvaluations.length; i++) {
      expect(regEvaluations[i].res.status).toBe(guestEvaluations[i].res.status);
      expect(regEvaluations[i].res.missingFields).toEqual(guestEvaluations[i].res.missingFields);
    }
  });
});
