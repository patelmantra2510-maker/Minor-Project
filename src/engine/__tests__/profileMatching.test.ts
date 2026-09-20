import { describe, it, expect } from 'vitest';
import type { Scholarship } from '../../types/scholarship';
import type { StudentProfile } from '../../types/studentProfile';
import { getCandidateScholarships } from '../candidateEngine';
import { evaluateScholarshipEligibility } from '../eligibilityEngine';
import { getNextQuestion } from '../dynamicQuestionEngine';

function createMockScholarship(
  id: string,
  overrides: Partial<Scholarship> = {},
  requiredFields: string[] = []
): Scholarship {
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
    minimumPercentage: 60,
    yearEligibility: ['All'],
    benefits: {
      amountDescription: '₹50,000 per year',
    },
    applicationStart: '2026-08-01',
    applicationDeadline: '2026-11-30',
    status: 'Open',
    documents: ['Marksheet'],
    description: 'Test scholarship description',
    whoCanApply: ['Undergraduate students'],
    howToApplySteps: ['Apply online'],
    officialWebsite: 'https://example.com',
    applicationWebsite: 'https://example.com/apply',
    lastUpdated: '2026-08-01',
    tags: ['Merit'],
    eligibility: {
      requiredFields: requiredFields.length > 0 ? requiredFields : ['field_education_level', 'field_family_income'],
      rules: {
        operator: 'AND',
        rules: [
          {
            id: `rule_edu_${id}`,
            fieldId: 'field_education_level',
            operator: 'equals',
            value: 'undergraduate',
            hardRequirement: true,
          },
          {
            id: `rule_income_${id}`,
            fieldId: 'field_family_income',
            operator: 'less_than_or_equal',
            value: 500000,
            hardRequirement: true,
          },
        ],
      },
    },
    ...overrides,
  };
}

function createStudentProfile(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: 'student_test_1',
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
        value: 'gujarat',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      },
    },
    preferences: {
      language: 'en',
      theme: 'system',
    },
    ...overrides,
  };
}

describe('Profile-Based Matching & Eligibility Results (Part 4)', () => {
  describe('Profile Consumption & Candidate Engine', () => {
    it('consumes student profile and identifies candidate scholarships', () => {
      const profile = createStudentProfile();
      const s1 = createMockScholarship('s1', { educationLevels: ['Undergraduate'] });
      const s2 = createMockScholarship('s2', {
        educationLevels: ['School'],
        eligibility: {
          requiredFields: ['field_education_level'],
          rules: {
            operator: 'AND',
            rules: [
              {
                id: 'r_school',
                fieldId: 'field_education_level',
                operator: 'equals',
                value: 'school',
                hardRequirement: true,
              },
            ],
          },
        },
      });

      const candidates = getCandidateScholarships([s1, s2], profile);
      const candidateIds = candidates.map((c) => c.id);

      // s1 matches education level (undergraduate), s2 strictly requires school
      expect(candidateIds).toContain('s1');
      expect(candidateIds).not.toContain('s2');
    });
  });

  describe('Strict Eligibility Status: eligible vs possible vs not_eligible', () => {
    it('returns "eligible" when all required deterministic rules pass', () => {
      const profile = createStudentProfile();
      profile.fields['field_family_income'] = {
        value: 300000,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const s = createMockScholarship('s_merit');
      const result = evaluateScholarshipEligibility(s, profile);

      expect(result.status).toBe('eligible');
      expect(result.missingFields).toHaveLength(0);
      expect(result.failedRules).toHaveLength(0);
      expect(result.passedRules.length).toBeGreaterThan(0);
    });

    it('returns "possible" when a required field is missing or unknown', () => {
      const profile = createStudentProfile();
      // Notice: family income is not answered in profile

      const s = createMockScholarship('s_merit');
      const result = evaluateScholarshipEligibility(s, profile);

      expect(result.status).toBe('possible');
      expect(result.missingFields).toContain('field_family_income');
      expect(result.failedRules).toHaveLength(0);
    });

    it('returns "not_eligible" when a hard requirement definitively fails', () => {
      const profile = createStudentProfile();
      profile.fields['field_family_income'] = {
        value: 800000, // Exceeds 500,000
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const s = createMockScholarship('s_merit');
      const result = evaluateScholarshipEligibility(s, profile);

      expect(result.status).toBe('not_eligible');
      expect(result.failedRules.some((r) => r.fieldId === 'field_family_income')).toBe(true);
    });
  });

  describe('Missing Information Flow', () => {
    it('identifies missing familyIncome and dynamic questionnaire asks familyIncome', () => {
      const profile = createStudentProfile();
      // missing field_family_income
      const s = createMockScholarship('s_income_need', {}, ['field_education_level', 'field_family_income']);

      const result = evaluateScholarshipEligibility(s, profile);
      expect(result.status).toBe('possible');
      expect(result.missingFields).toContain('field_family_income');

      // Questionnaire asks the missing field
      const qState = {
        sessionId: 'test',
        profileId: profile.id,
        startedAt: new Date().toISOString(),
        askedQuestionIds: [],
        skippedQuestionIds: [],
        answers: {},
        candidateScholarshipIds: [s.id],
        missingFieldIds: result.missingFields,
        status: 'in_progress' as const,
      };

      const nextQ = getNextQuestion(profile, [s], qState);
      expect(nextQ.question?.fieldId).toBe('field_family_income');
    });

    it('does not block matching when irrelevant fields are missing', () => {
      const profile = createStudentProfile();
      profile.fields['field_family_income'] = {
        value: 250000,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      // Profile does NOT have field_is_orphan, field_has_disability, field_is_hosteller
      const s = createMockScholarship('s_general');
      const result = evaluateScholarshipEligibility(s, profile);

      // Even though optional/irrelevant fields are not in profile, s is fully eligible
      expect(result.status).toBe('eligible');
    });
  });

  describe('Unknown Information Handling', () => {
    it('unknown income does not satisfy income rule and keeps scholarship as possible', () => {
      const profile = createStudentProfile();
      profile.fields['field_family_income'] = {
        value: null,
        status: 'unknown', // Marked as unknown / not sure
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const s = createMockScholarship('s_need');
      const result = evaluateScholarshipEligibility(s, profile);

      // Unknown must NEVER pass an eligibility requirement
      expect(result.status).toBe('possible');
      expect(result.status).not.toBe('eligible');
    });
  });

  describe('No Mock Fallback & Empty State', () => {
    it('evaluates to empty without crashing when no candidate scholarships match', () => {
      const profile = createStudentProfile();
      profile.fields['field_education_level'] = {
        value: 'phd',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      const s = createMockScholarship('s_undergrad_only', {
        educationLevels: ['Undergraduate'],
      });

      const candidates = getCandidateScholarships([s], profile);
      expect(candidates).toHaveLength(0);

      // Ensure no mock scholarships are generated
      expect(candidates).toEqual([]);
    });
  });

  describe('New Scholarship Dynamic Compatibility', () => {
    it('evaluates a new scholarship with existing rule definitions without changing matching code', () => {
      const profile = createStudentProfile();
      profile.fields['field_family_income'] = {
        value: 400000,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
      profile.fields['field_category'] = {
        value: 'sc',
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };

      // Create a brand new scholarship scheme
      const newScholarshipScheme: Scholarship = {
        id: 'new_state_scheme_2026',
        slug: 'new-state-scheme-2026',
        name: 'New 2026 Advanced Scholarship',
        shortName: 'NAS-2026',
        provider: 'National Education Directorate',
        state: 'Gujarat',
        type: 'Need-based',
        educationLevels: ['Undergraduate'],
        courses: ['All'],
        categories: ['SC'],
        genderEligibility: 'All',
        incomeLimit: 450000,
        minimumPercentage: 50,
        yearEligibility: ['All'],
        benefits: {
          amountDescription: '₹75,000 per year',
        },
        applicationStart: '2026-09-01',
        applicationDeadline: '2026-12-31',
        status: 'Open',
        documents: ['Income certificate', 'Caste certificate'],
        description: 'Newly announced scheme for 2026.',
        whoCanApply: ['SC undergraduate students in Gujarat'],
        howToApplySteps: ['Apply through portal'],
        officialWebsite: 'https://schemes.gov.in',
        applicationWebsite: 'https://schemes.gov.in/apply',
        lastUpdated: '2026-09-01',
        tags: ['Means', 'Gujarat'],
        eligibility: {
          requiredFields: ['field_education_level', 'field_category', 'field_family_income'],
          rules: {
            operator: 'AND',
            rules: [
              {
                id: 'r_edu_new',
                fieldId: 'field_education_level',
                operator: 'equals',
                value: 'undergraduate',
                hardRequirement: true,
              },
              {
                id: 'r_cat_new',
                fieldId: 'field_category',
                operator: 'equals',
                value: 'sc',
                hardRequirement: true,
              },
              {
                id: 'r_inc_new',
                fieldId: 'field_family_income',
                operator: 'less_than_or_equal',
                value: 450000,
                hardRequirement: true,
              },
            ],
          },
        },
      };

      const result = evaluateScholarshipEligibility(newScholarshipScheme, profile);

      expect(result.status).toBe('eligible');
      expect(result.passedRules).toHaveLength(3);
      expect(result.failedRules).toHaveLength(0);
    });
  });
});
