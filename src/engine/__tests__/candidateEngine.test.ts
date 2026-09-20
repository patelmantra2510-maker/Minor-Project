import { describe, it, expect } from 'vitest';
import type { Scholarship } from '../../types/scholarship';
import type { StudentProfile } from '../../types/studentProfile';
import {
  isScholarshipCandidate,
  getCandidateScholarships,
} from '../candidateEngine';
import { evaluateScholarshipEligibility } from '../eligibilityEngine';

function createMockScholarship(overrides: Partial<Scholarship> = {}): Scholarship {
  return {
    id: 'test_scholarship',
    slug: 'test-scholarship',
    name: 'Test Engineering Scholarship',
    shortName: 'TES',
    provider: 'Test Foundation',
    state: 'All India',
    type: 'Merit',
    educationLevels: ['Undergraduate'],
    courses: ['All'],
    categories: ['All'],
    genderEligibility: 'Female',
    incomeLimit: 450000,
    minimumPercentage: 60,
    yearEligibility: ['All'],
    benefits: {
      amountDescription: '₹50,000 per year',
    },
    applicationStart: '2026-08-01',
    applicationDeadline: '2026-11-30',
    status: 'Open',
    documents: ['Mark sheet', 'Income certificate'],
    description: 'Scholarship description',
    whoCanApply: ['Female undergraduate students'],
    howToApplySteps: ['Apply online'],
    officialWebsite: 'https://example.com',
    applicationWebsite: 'https://example.com/apply',
    lastUpdated: '2026-08-01',
    tags: ['Merit', 'Women'],
    eligibility: {
      requiredFields: ['field_gender', 'field_family_income'],
      rules: {
        operator: 'AND',
        rules: [
          {
            id: 'r_gender',
            fieldId: 'field_gender',
            operator: 'equals',
            value: 'female',
            hardRequirement: true,
          },
          {
            id: 'r_income',
            fieldId: 'field_family_income',
            operator: 'less_than_or_equal',
            value: 450000,
            hardRequirement: true,
          },
        ],
      },
    },
    ...overrides,
  };
}

function createStudent(fields: Record<string, any>): StudentProfile {
  const profileFields: StudentProfile['fields'] = {};
  for (const [key, val] of Object.entries(fields)) {
    profileFields[key] = {
      value: val,
      status: val === null ? 'unknown' : 'known',
      updatedAt: new Date().toISOString(),
      source: 'questionnaire',
    };
  }

  return {
    id: 'stud_1',
    profileType: 'guest',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: profileFields,
    preferences: {
      language: 'en',
      theme: 'light',
    },
  };
}

describe('Candidate Engine & Soft Uncertainty Semantics', () => {
  it('disqualifies candidate when hardRequirement fails definitely', () => {
    const scholarship = createMockScholarship();
    // Male student applying for female-only scholarship
    const student = createStudent({
      field_gender: 'male',
      field_family_income: 200000,
    });

    const isCandidate = isScholarshipCandidate(scholarship, student);
    expect(isCandidate).toBe(false);

    const evalResult = evaluateScholarshipEligibility(scholarship, student);
    expect(evalResult.status).toBe('not_eligible');
  });

  it('keeps candidate when required fields are missing / unknown (soft missing rule)', () => {
    const scholarship = createMockScholarship();
    // Student provided gender = female, but has NOT yet answered income
    const student = createStudent({
      field_gender: 'female',
      field_family_income: null, // Unknown
    });

    const isCandidate = isScholarshipCandidate(scholarship, student);
    expect(isCandidate).toBe(true);

    const candidates = getCandidateScholarships([scholarship], student);
    expect(candidates).toHaveLength(1);

    const evalResult = evaluateScholarshipEligibility(scholarship, student);
    expect(evalResult.status).toBe('possible');
    expect(evalResult.missingFields).toContain('field_family_income');
  });

  it('evaluates status as eligible when all requirements are known and satisfied', () => {
    const scholarship = createMockScholarship();
    const student = createStudent({
      field_gender: 'female',
      field_family_income: 300000,
    });

    const isCandidate = isScholarshipCandidate(scholarship, student);
    expect(isCandidate).toBe(true);

    const evalResult = evaluateScholarshipEligibility(scholarship, student);
    expect(evalResult.status).toBe('eligible');
    expect(evalResult.missingFields).toHaveLength(0);
  });
});
