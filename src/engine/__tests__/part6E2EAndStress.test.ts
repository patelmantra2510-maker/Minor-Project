import { describe, it, expect, beforeEach } from 'vitest';
import type { StudentProfile } from '../../types/studentProfile';
import type { Scholarship } from '../../types/scholarship';
import type { QuestionnaireState } from '../../types/questionnaire';
import { getNextQuestion, invalidateDependentFields } from '../dynamicQuestionEngine';
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

describe('EDVORA — Part 6 End-to-End & Production Hardening Test Suite', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: new MockLocalStorage(),
    };
  });

  // SCENARIO 1: Full New Student Onboarding Flow
  it('Scenario 1: Onboarding flow smoothly guides from 0% to high readiness and persists profile', async () => {
    const storage = new LocalStorageProfileStorage();

    let profile: StudentProfile = {
      id: 'guest_onboarding_e2e',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {},
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    let qState: QuestionnaireState = {
      sessionId: 'sess_e2e_1',
      profileId: profile.id,
      startedAt: new Date().toISOString(),
      askedQuestionIds: [],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: SCHOLARSHIPS_DATA.map((s) => s.id),
      missingFieldIds: [],
      status: 'in_progress',
    };

    const initialCompletion = calculateProfileCompletion(profile);
    expect(initialCompletion.percentage).toBe(0);

    const steps: { fieldId: string; value: any; status: 'known' | 'custom' | 'unknown'; customText?: string }[] = [
      { fieldId: 'field_education_level', value: 'undergraduate', status: 'known' },
      { fieldId: 'field_stream', value: 'engineering', status: 'known' },
      { fieldId: 'field_domicile_state', value: 'Gujarat', status: 'known' },
      { fieldId: 'field_current_state', value: 'Gujarat', status: 'known' },
      { fieldId: 'field_category', value: 'General', status: 'known' },
      { fieldId: 'field_family_income', value: 200000, status: 'known' },
      { fieldId: 'field_latest_score', value: 85, status: 'known' },
      { fieldId: 'field_has_disability', value: false, status: 'known' },
    ];

    let prevPercentage = -1;

    for (const step of steps) {
      const nextRes = getNextQuestion(profile, SCHOLARSHIPS_DATA, qState);
      expect(nextRes.progress).toBeDefined();

      profile = {
        ...profile,
        updatedAt: new Date().toISOString(),
        fields: {
          ...profile.fields,
          [step.fieldId]: {
            value: step.value,
            status: step.status,
            customText: step.customText,
            updatedAt: new Date().toISOString(),
            source: 'questionnaire',
          },
        },
      };

      const completion = calculateProfileCompletion(profile);
      expect(completion.percentage).toBeGreaterThanOrEqual(prevPercentage);
      prevPercentage = completion.percentage;

      qState = {
        ...qState,
        askedQuestionIds: [...qState.askedQuestionIds, `q_${step.fieldId}`],
      };
    }

    const finalCompletion = calculateProfileCompletion(profile);
    expect(finalCompletion.percentage).toBeGreaterThanOrEqual(60);
    expect(finalCompletion.knownFields).toBe(6);
    expect(Object.keys(profile.fields)).toHaveLength(8);

    await storage.saveProfile(profile);
    const loaded = await storage.loadProfile();
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(profile.id);
    expect(loaded?.fields['field_education_level']?.value).toBe('undergraduate');
    expect(loaded?.fields['field_latest_score']?.value).toBe(85);
  });

  // SCENARIO 2: Find Scholarships Missing Information Flow
  it('Scenario 2: Targeted missing field answering unlocks eligible scholarship status immediately', () => {
    let profile: StudentProfile = {
      id: 'guest_missing_flow',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat') || SCHOLARSHIPS_DATA[0];
    expect(mysy).toBeDefined();

    // Initial evaluation: missing family income
    const initialEval = evaluateScholarshipEligibility(mysy, profile);
    expect(initialEval.status).toBe('possible');
    expect(initialEval.missingFields).toContain('field_family_income');

    // Targeted completion of missing income field
    profile = {
      ...profile,
      fields: {
        ...profile.fields,
        field_family_income: {
          value: 200000,
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
    };

    // Re-evaluate: now mandatory rules are met
    const updatedEval = evaluateScholarshipEligibility(mysy, profile);
    expect(updatedEval.status).toBe('eligible');
  });

  // SCENARIO 3: Isolated Profile Reset Protection
  it('Scenario 3: Profile reset strictly wipes profile and questionnaire state while keeping bookmarks, comparisons, and language', async () => {
    const storage = new LocalStorageProfileStorage();
    const mockStorage = (globalThis as any).window.localStorage;

    mockStorage.setItem('edvora_saved_ids', JSON.stringify(['sch_1', 'sch_2']));
    mockStorage.setItem('edvora_compare_ids', JSON.stringify(['sch_1', 'sch_2', 'sch_3']));
    mockStorage.setItem('edvora_language', 'hi');
    mockStorage.setItem('edvora_theme', 'light');

    const profile: StudentProfile = {
      id: 'guest_to_reset',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    await storage.saveProfile(profile);
    await storage.saveQuestionnaireState({
      sessionId: 'sess_reset',
      profileId: profile.id,
      startedAt: new Date().toISOString(),
      askedQuestionIds: ['q_edu'],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: [],
      missingFieldIds: [],
      status: 'in_progress',
    });

    expect(await storage.loadProfile()).not.toBeNull();
    expect(await storage.loadQuestionnaireState()).not.toBeNull();

    await storage.clearProfile();
    await storage.clearQuestionnaireState();

    expect(await storage.loadProfile()).toBeNull();
    expect(await storage.loadQuestionnaireState()).toBeNull();

    expect(JSON.parse(mockStorage.getItem('edvora_saved_ids')!)).toEqual(['sch_1', 'sch_2']);
    expect(JSON.parse(mockStorage.getItem('edvora_compare_ids')!)).toEqual(['sch_1', 'sch_2', 'sch_3']);
    expect(mockStorage.getItem('edvora_language')).toBe('hi');
    expect(mockStorage.getItem('edvora_theme')).toBe('light');
  });

  // SCENARIO 4: Guest Storage Persistence & Round-trip Reload
  it('Scenario 4: Handles round-trip storage persistence of all field value statuses without corruption', async () => {
    const storage = new LocalStorageProfileStorage();

    const complexProfile: StudentProfile = {
      id: 'guest_complex_persist',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T11:00:00Z',
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: '2026-09-20T10:05:00Z',
          source: 'questionnaire',
        },
        field_stream: {
          value: 'other',
          status: 'custom',
          customText: 'Robotics & Automation',
          updatedAt: '2026-09-20T10:10:00Z',
          source: 'questionnaire',
        },
        field_has_disability: {
          value: null,
          status: 'unknown',
          updatedAt: '2026-09-20T10:15:00Z',
          source: 'questionnaire',
        },
        field_family_income: {
          value: null,
          status: 'prefer_not_to_say',
          updatedAt: '2026-09-20T10:20:00Z',
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    await storage.saveProfile(complexProfile);

    const reloaded = await storage.loadProfile();
    expect(reloaded).not.toBeNull();
    expect(reloaded?.id).toBe(complexProfile.id);
    expect(reloaded?.fields['field_education_level']?.status).toBe('known');
    expect(reloaded?.fields['field_stream']?.status).toBe('custom');
    expect(reloaded?.fields['field_stream']?.customText).toBe('Robotics & Automation');
    expect(reloaded?.fields['field_has_disability']?.status).toBe('unknown');
    expect(reloaded?.fields['field_family_income']?.status).toBe('prefer_not_to_say');
  });

  // SCENARIO 5: Handling Unknown & Prefer Not to Say Uncertainty
  it('Scenario 5: Handles unknown and prefer_not_to_say values safely in eligibility engine without runtime error', () => {
    const uncertainProfile: StudentProfile = {
      id: 'guest_uncertain',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_has_disability: {
          value: null,
          status: 'unknown',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_category: {
          value: null,
          status: 'prefer_not_to_say',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    for (const scholarship of SCHOLARSHIPS_DATA) {
      expect(() => {
        const evalResult = evaluateScholarshipEligibility(scholarship, uncertainProfile);
        expect(evalResult).toBeDefined();
        expect(['eligible', 'possible', 'not_eligible']).toContain(evalResult.status);
      }).not.toThrow();
    }
  });

  // SCENARIO 6: Conditional Dependency Invalidation
  it('Scenario 6: Changing parent answers invalidates dependent child fields cleanly', () => {
    const profileWithDeps: StudentProfile = {
      id: 'guest_conditional_deps',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_is_hosteller: {
          value: false,
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_hostel_type: {
          value: 'government_hostel',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_domicile_state: {
          value: 'Gujarat',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const cleaned = invalidateDependentFields(profileWithDeps);

    expect(cleaned.fields['field_hostel_type']).toBeUndefined();
    expect(cleaned.fields['field_is_hosteller']).toBeDefined();
    expect(cleaned.fields['field_domicile_state']?.value).toBe('Gujarat');
  });

  // SCENARIO 7: Dynamic Ingestion of New Scholarship with Complex Criteria
  it('Scenario 7: Seamlessly evaluates new runtime scholarship without altering existing engine logic', () => {
    const newScholarship: Scholarship = {
      id: 'new-maharashtra-tribal-merit-2026',
      slug: 'new-maharashtra-tribal-merit-2026',
      name: 'Maharashtra Tribal Excellence Scholarship',
      shortName: 'MH Tribal Merit',
      provider: 'Tribal Development Department, Maharashtra',
      description: 'Full fellowship for ST postgraduate students with >70% marks.',
      benefits: {
        amountDescription: '₹1,50,000 / year',
      },
      applicationStart: '2026-08-01',
      applicationDeadline: '2026-12-31',
      status: 'Open',
      educationLevels: ['Postgraduate'],
      courses: ['All'],
      categories: ['ST'],
      genderEligibility: 'All',
      state: 'All India',
      incomeLimit: 500000,
      minimumPercentage: 70,
      type: 'Government',
      yearEligibility: ['All'],
      documents: ['Caste Certificate', 'Income Certificate', 'Degree Marksheet'],
      whoCanApply: ['ST postgraduate students with >70% marks'],
      howToApplySteps: ['Apply through the state portal'],
      officialWebsite: 'https://tribal.maharashtra.gov.in',
      applicationWebsite: 'https://tribal.maharashtra.gov.in/apply',
      lastUpdated: '2026-08-01',
      tags: ['Tribal', 'Merit', 'Postgraduate'],
      eligibility: {
        requiredFields: ['field_education_level', 'field_domicile_state', 'field_category', 'field_latest_score'],
        rules: {
          operator: 'AND',
          rules: [
            {
              id: 'rule_mh_state',
              fieldId: 'field_domicile_state',
              operator: 'equals',
              value: 'Maharashtra',
              hardRequirement: true,
              description: 'Domicile of Maharashtra',
            },
            {
              id: 'rule_mh_st_category',
              fieldId: 'field_category',
              operator: 'equals',
              value: 'ST',
              hardRequirement: true,
              description: 'ST Social Category',
            },
            {
              id: 'rule_mh_min_score',
              fieldId: 'field_latest_score',
              operator: 'greater_than_or_equal',
              value: 70,
              hardRequirement: true,
              description: 'Minimum 70% score',
            },
          ],
        },
      },
    };

    const candidateProfile: StudentProfile = {
      id: 'mh_student',
      profileType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: {
        field_education_level: {
          value: 'postgraduate',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_domicile_state: {
          value: 'Maharashtra',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_category: {
          value: 'ST',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
        field_latest_score: {
          value: 78,
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const candidates = getCandidateScholarships([newScholarship], candidateProfile);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].id).toBe('new-maharashtra-tribal-merit-2026');

    const evalResult = evaluateScholarshipEligibility(newScholarship, candidateProfile);
    expect(evalResult.status).toBe('eligible');
    expect(evalResult.passedRules).toHaveLength(3);
    expect(evalResult.failedRules).toHaveLength(0);

    const lowScoreProfile: StudentProfile = {
      ...candidateProfile,
      fields: {
        ...candidateProfile.fields,
        field_latest_score: {
          value: 65,
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        },
      },
    };

    const negativeEval = evaluateScholarshipEligibility(newScholarship, lowScoreProfile);
    expect(negativeEval.status).toBe('not_eligible');
    expect(negativeEval.failedRules.length).toBeGreaterThan(0);
  });
});
