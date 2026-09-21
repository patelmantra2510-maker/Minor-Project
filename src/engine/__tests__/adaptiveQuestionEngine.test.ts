import { describe, it, expect } from 'vitest';
import type { Scholarship } from '../../types/scholarship';
import type { StudentProfile } from '../../types/studentProfile';
import type { QuestionnaireState } from '../../types/questionnaire';
import {
  getNextQuestion,
  isQuestionVisible,
  invalidateDependentFields,
} from '../dynamicQuestionEngine';
import { questionById } from '../../data/eligibility/questions';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';

function createMockScholarship(id: string, requiredFields: string[]): Scholarship {
  return {
    id,
    slug: id,
    name: `Scholarship ${id}`,
    shortName: id.toUpperCase(),
    provider: 'Test Foundation',
    state: 'All India',
    type: 'Merit',
    educationLevels: ['Undergraduate'],
    courses: ['All'],
    categories: ['All'],
    genderEligibility: 'All',
    incomeLimit: 500000,
    minimumPercentage: 50,
    yearEligibility: ['All'],
    benefits: {
      amountDescription: '₹25,000',
    },
    applicationStart: '2026-08-01',
    applicationDeadline: '2026-11-30',
    status: 'Open',
    documents: [],
    description: 'Test description',
    whoCanApply: [],
    howToApplySteps: [],
    officialWebsite: 'https://example.com',
    applicationWebsite: 'https://example.com/apply',
    lastUpdated: '2026-08-01',
    tags: ['Merit'],
    eligibility: {
      requiredFields,
      rules: {
        operator: 'AND',
        rules: requiredFields.map((f) => ({
          id: `rule_${f}`,
          fieldId: f,
          operator: 'is_true' as const,
          hardRequirement: true,
        })),
      },
    },
  };
}

function createEmptyProfile(): StudentProfile {
  return {
    id: 'test_student',
    profileType: 'guest',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: {},
    preferences: {
      language: 'en',
      theme: 'system',
    },
  };
}

function createEmptyQuestionnaireState(profileId = 'test_student'): QuestionnaireState {
  return {
    sessionId: 'session_1',
    profileId,
    startedAt: new Date().toISOString(),
    askedQuestionIds: [],
    skippedQuestionIds: [],
    answers: {},
    candidateScholarshipIds: [],
    missingFieldIds: [],
    status: 'in_progress',
  };
}

describe('Adaptive Question Engine (Part 3)', () => {
  describe('Question Selection & Candidate Relevance', () => {
    it('selects a relevant question when profile is empty', () => {
      const profile = createEmptyProfile();
      const scholarships = [createMockScholarship('s1', ['field_education_level', 'field_gender'])];
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, scholarships, state);

      expect(result.question).not.toBeNull();
      expect(['field_education_level', 'field_gender']).toContain(result.question?.fieldId);
    });

    it('skips fields that are already answered in the profile', () => {
      const profile = createEmptyProfile();
      profile.fields['field_education_level'] = {
        value: 'undergraduate',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const scholarships = [createMockScholarship('s1', ['field_education_level'])];
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, scholarships, state);

      expect(result.question?.fieldId).not.toBe('field_education_level');
    });

    it('skips questions that are in askedQuestionIds or skippedQuestionIds', () => {
      const profile = createEmptyProfile();
      const scholarships = [createMockScholarship('s1', ['field_gender'])];
      const state = createEmptyQuestionnaireState();

      const genderQuestion = questionById['q_gender'];
      expect(genderQuestion).toBeDefined();

      state.askedQuestionIds.push(genderQuestion!.id);

      const result = getNextQuestion(profile, scholarships, state);
      expect(result.question?.id).not.toBe(genderQuestion!.id);
    });

    it('prioritizes preferredFieldId when specified and visible', () => {
      const profile = createEmptyProfile();
      const scholarships = [createMockScholarship('s1', ['field_education_level'])];
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, scholarships, state, 'field_domicile_state');
      expect(result.question?.fieldId).toBe('field_domicile_state');
    });

    it('returns question: null when all questions are answered or skipped', () => {
      const profile = createEmptyProfile();
      const state = createEmptyQuestionnaireState();

      state.skippedQuestionIds = Object.keys(questionById);

      const result = getNextQuestion(profile, [], state);
      expect(result.question).toBeNull();
    });
  });

  describe('Conditional Questions & Visibility Rules', () => {
    it('hides dependent question when condition is not met', () => {
      const profile = createEmptyProfile();
      const hostelTypeQuestion = questionById['q_hostel_type'];
      expect(hostelTypeQuestion).toBeDefined();

      expect(isQuestionVisible(hostelTypeQuestion!, profile)).toBe(false);

      profile.fields['field_is_hosteller'] = {
        value: false,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(hostelTypeQuestion!, profile)).toBe(false);
    });

    it('shows dependent question when condition is met', () => {
      const profile = createEmptyProfile();
      const hostelTypeQuestion = questionById['q_hostel_type'];
      expect(hostelTypeQuestion).toBeDefined();

      profile.fields['field_is_hosteller'] = {
        value: true,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(hostelTypeQuestion!, profile)).toBe(true);
    });

    it('handles disability conditional questions correctly', () => {
      const profile = createEmptyProfile();
      const disabilityTypeQuestion = questionById['q_disability_type'];
      expect(disabilityTypeQuestion).toBeDefined();

      expect(isQuestionVisible(disabilityTypeQuestion!, profile)).toBe(false);

      profile.fields['field_has_disability'] = {
        value: true,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(disabilityTypeQuestion!, profile)).toBe(true);
    });
  });

  describe('Dependency Invalidation', () => {
    it('prunes dependent hostel fields when is_hosteller changes to false', () => {
      const profile = createEmptyProfile();
      profile.fields['field_is_hosteller'] = {
        value: false,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_hostel_type'] = {
        value: 'government_hostel',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const cleaned = invalidateDependentFields(profile);

      expect(cleaned.fields['field_hostel_type']).toBeUndefined();
      expect(cleaned.fields['field_is_hosteller']).toBeDefined();
    });

    it('prunes dependent disability fields when has_disability changes to false', () => {
      const profile = createEmptyProfile();
      profile.fields['field_has_disability'] = {
        value: false,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_disability_percentage'] = {
        value: 40,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_disability_type'] = {
        value: 'locomotor',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const cleaned = invalidateDependentFields(profile);

      expect(cleaned.fields['field_disability_percentage']).toBeUndefined();
      expect(cleaned.fields['field_disability_type']).toBeUndefined();
      expect(cleaned.fields['field_has_disability']).toBeDefined();
    });

    it('does not prune fields when conditions remain satisfied', () => {
      const profile = createEmptyProfile();
      profile.fields['field_is_hosteller'] = {
        value: true,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_hostel_type'] = {
        value: 'private_hostel',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const cleaned = invalidateDependentFields(profile);

      expect(cleaned.fields['field_hostel_type']).toBeDefined();
      expect(cleaned.fields['field_hostel_type']?.value).toBe('private_hostel');
    });
  });

  describe('Uncertainty Handling (Known vs Unknown vs Prefer Not to Say vs Custom)', () => {
    it('does not re-ask questions marked with prefer_not_to_say', () => {
      const profile = createEmptyProfile();
      profile.fields['field_family_income'] = {
        value: null,
        status: 'prefer_not_to_say',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const scholarships = [createMockScholarship('s1', ['field_family_income'])];
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, scholarships, state);
      expect(result.question?.fieldId).not.toBe('field_family_income');
    });

    it('does not re-ask questions marked with custom status and custom text', () => {
      const profile = createEmptyProfile();
      profile.fields['field_stream'] = {
        value: null,
        status: 'custom',
        customText: 'Biotechnology & Bioinformatics',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const scholarships = [createMockScholarship('s1', ['field_stream'])];
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, scholarships, state);
      expect(result.question?.fieldId).not.toBe('field_stream');
    });
  });

  describe('Dynamic Scholarship Compatibility', () => {
    it('dynamically prioritizes questions required by candidate scholarships without code modification', () => {
      const profile = createEmptyProfile();
      profile.fields['field_education_level'] = {
        value: 'undergraduate',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const sportsScholarship = createMockScholarship('sports_scheme', ['field_sports_achievement']);
      const state = createEmptyQuestionnaireState();

      const result = getNextQuestion(profile, [sportsScholarship], state);

      expect(result.question?.fieldId).toBe('field_sports_achievement');
    });
  });

  describe('EDVORA — Complete Path-Aware & Adaptive Questionnaire Scenarios', () => {
    it('Scenario A (Diploma Path): Never asks Class 12 marks or school board and focuses on Diploma', () => {
      const profile = createEmptyProfile();
      const state = createEmptyQuestionnaireState();

      // Student starts questionnaire and selects Diploma
      profile.fields['field_education_level'] = {
        value: 'diploma',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      state.askedQuestionIds.push('q_education_level');

      // Verify that q_class_12_percentage and q_board are NEVER visible
      const qClass12 = questionById['q_class_12_percentage'];
      const qBoard = questionById['q_board'];
      expect(qClass12).toBeDefined();
      expect(qBoard).toBeDefined();
      expect(isQuestionVisible(qClass12!, profile)).toBe(false);
      expect(isQuestionVisible(qBoard!, profile)).toBe(false);

      // Advance through Diploma questions
      const askedFields: string[] = [];
      let iterations = 0;
      while (iterations < 20) {
        iterations++;
        const next = getNextQuestion(profile, SCHOLARSHIPS_DATA, state);
        if (!next.question) break;

        askedFields.push(next.question.fieldId);
        state.askedQuestionIds.push(next.question.id);
        profile.fields[next.question.fieldId] = {
          value: next.question.fieldId === 'field_family_income' ? 120000 : 'Gujarat',
          status: 'known',
          updatedAt: new Date().toISOString(),
          source: 'questionnaire',
        };
      }

      // Assertions
      expect(askedFields).not.toContain('field_class_12_percentage');
      expect(askedFields).not.toContain('field_board');
      expect(askedFields).not.toContain('field_research_experience');
      expect(askedFields).toContain('field_stream');
    });

    it('Scenario B (12th / School Path): Activates Class 12 percentage and Board questions', () => {
      const profile = createEmptyProfile();
      profile.fields['field_education_level'] = {
        value: 'school',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const qClass12 = questionById['q_class_12_percentage'];
      const qBoard = questionById['q_board'];
      expect(isQuestionVisible(qClass12!, profile)).toBe(true);
      expect(isQuestionVisible(qBoard!, profile)).toBe(true);
    });

    it('Scenario C (Undergraduate Path): Focuses on degree education and does not ask 12th by default', () => {
      const profile = createEmptyProfile();
      profile.fields['field_education_level'] = {
        value: 'undergraduate',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const qClass12 = questionById['q_class_12_percentage'];
      const qBoard = questionById['q_board'];
      expect(isQuestionVisible(qClass12!, profile)).toBe(false);
      expect(isQuestionVisible(qBoard!, profile)).toBe(false);

      const qBranch = questionById['q_branch'];
      expect(isQuestionVisible(qBranch!, profile)).toBe(true);
    });

    it('Scenario D (Disability): Toggles child questions dynamically and invalidates dependent data', () => {
      const profile = createEmptyProfile();
      const qDisabilityPercentage = questionById['q_disability_percentage'];
      const qDisabilityType = questionById['q_disability_type'];

      // When has_disability is unknown / not set
      expect(isQuestionVisible(qDisabilityPercentage!, profile)).toBe(false);
      expect(isQuestionVisible(qDisabilityType!, profile)).toBe(false);

      // When has_disability = false
      profile.fields['field_has_disability'] = {
        value: false,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(qDisabilityPercentage!, profile)).toBe(false);
      expect(isQuestionVisible(qDisabilityType!, profile)).toBe(false);

      // When has_disability = true
      profile.fields['field_has_disability'] = {
        value: true,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(qDisabilityPercentage!, profile)).toBe(true);
      expect(isQuestionVisible(qDisabilityType!, profile)).toBe(true);
    });

    it('Scenario E (Hostel): Toggles hostel_type dynamically and prunes on false', () => {
      const profile = createEmptyProfile();
      const qHostelType = questionById['q_hostel_type'];

      expect(isQuestionVisible(qHostelType!, profile)).toBe(false);

      // When is_hosteller = true
      profile.fields['field_is_hosteller'] = {
        value: true,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(qHostelType!, profile)).toBe(true);

      // Set hostel type value, then user toggles is_hosteller to false
      profile.fields['field_hostel_type'] = {
        value: 'government_hostel',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_is_hosteller'].value = false;

      const cleaned = invalidateDependentFields(profile);
      expect(cleaned.fields['field_hostel_type']).toBeUndefined();
    });

    it('Scenario F (Caste Certificate & Minimum-Data): Never asks caste certificate for General category', () => {
      const profile = createEmptyProfile();
      const qCasteCert = questionById['q_has_caste_certificate'];

      // General category
      profile.fields['field_category'] = {
        value: 'general',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      expect(isQuestionVisible(qCasteCert!, profile)).toBe(false);

      // Reserved category (SEBC / OBC)
      profile.fields['field_category'].value = 'sebc_obc';
      expect(isQuestionVisible(qCasteCert!, profile)).toBe(true);
    });
  });
});
