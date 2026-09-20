import { describe, it, expect } from 'vitest';
import type { Scholarship } from '../../types/scholarship';
import type { StudentProfile } from '../../types/studentProfile';
import { calculateProfileCompletion } from '../profileCompletion';

describe('Profile Completion Calculation', () => {
  it('calculates completion ONLY against relevant candidate fields rather than all universal fields', () => {
    // Mock scholarship with 4 required fields
    const mockScholarship: Scholarship = {
      id: 'sch_1',
      slug: 'sch-1',
      name: 'Scholarship 1',
      shortName: 'S1',
      provider: 'Provider',
      state: 'All India',
      type: 'Merit',
      educationLevels: ['Undergraduate'],
      courses: ['All'],
      categories: ['All'],
      genderEligibility: 'All',
      incomeLimit: 300000,
      minimumPercentage: 60,
      yearEligibility: ['All'],
      benefits: { amountDescription: 'Amount' },
      applicationStart: '2026-01-01',
      applicationDeadline: '2026-12-31',
      status: 'Open',
      documents: [],
      description: 'Desc',
      whoCanApply: [],
      howToApplySteps: [],
      officialWebsite: 'https://example.com',
      applicationWebsite: 'https://example.com',
      lastUpdated: '2026-01-01',
      tags: [],
      eligibility: {
        requiredFields: [
          'field_education_level',
          'field_stream',
          'field_gender',
          'field_family_income',
        ],
        rules: { operator: 'AND', rules: [] },
      },
    };

    // Student has filled 2 out of 4 relevant fields
    const profile: StudentProfile = {
      id: 'stud_1',
      profileType: 'guest',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: '2026-01-01',
          source: 'questionnaire',
        },
        field_gender: {
          value: 'female',
          status: 'known',
          updatedAt: '2026-01-01',
          source: 'questionnaire',
        },
        // Unknown field should not count
        field_family_income: {
          value: null,
          status: 'unknown',
          updatedAt: '2026-01-01',
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const completion = calculateProfileCompletion(profile, [mockScholarship]);

    expect(completion.relevantFields).toBe(4);
    expect(completion.knownFields).toBe(2);
    // 2 / 4 = 50%, NOT 2 / 65 (~3%)!
    expect(completion.percentage).toBe(50);
  });

  it('does not count unknown or prefer_not_to_say as known fields', () => {
    const profile: StudentProfile = {
      id: 'stud_2',
      profileType: 'guest',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      fields: {
        field_education_level: {
          value: null,
          status: 'prefer_not_to_say',
          updatedAt: '2026-01-01',
          source: 'questionnaire',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const completion = calculateProfileCompletion(profile);
    expect(completion.knownFields).toBe(0);
    expect(completion.percentage).toBe(0);
  });
});
