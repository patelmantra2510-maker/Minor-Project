import { describe, it, expect } from 'vitest';
import { calculateProfileCompletion } from '../../engine/structuredEligibilityEvaluator';
import type { StudentAnswers } from '../../types/scholarship';
import type { StudentProfile } from '../../types/studentProfile';

describe('Account & Profile Completion Flow', () => {
  it('returns 0% and isReady: false for null or undefined profile/answers', () => {
    const resNull = calculateProfileCompletion(null);
    expect(resNull.percentage).toBe(0);
    expect(resNull.knownFields).toBe(0);
    expect(resNull.isReady).toBe(false);

    const resUndefined = calculateProfileCompletion(undefined);
    expect(resUndefined.percentage).toBe(0);
    expect(resUndefined.isReady).toBe(false);
  });

  it('calculates completion correctly from StudentAnswers', () => {
    // Only location and category provided (2 out of 8 core fields = 25%)
    const partialAnswers: Partial<StudentAnswers> = {
      location: 'Gujarat',
      category: 'General',
    };

    const partialRes = calculateProfileCompletion(partialAnswers as StudentAnswers);
    expect(partialRes.percentage).toBe(25);
    expect(partialRes.knownFields).toBe(2);
    expect(partialRes.isReady).toBe(false);

    // 6 out of 8 core fields = 75% -> isReady: true
    const readyAnswers: Partial<StudentAnswers> = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
    };

    const readyRes = calculateProfileCompletion(readyAnswers as StudentAnswers);
    expect(readyRes.percentage).toBe(75);
    expect(readyRes.knownFields).toBe(6);
    expect(readyRes.isReady).toBe(true);

    // All 8 core fields provided = 100%
    const fullAnswers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering',
      currentYear: '2nd Year',
      category: 'SEBC/OBC',
      gender: 'Female',
      annualIncome: 350000,
      academicPercentage: 88,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const fullRes = calculateProfileCompletion(fullAnswers);
    expect(fullRes.percentage).toBe(100);
    expect(fullRes.knownFields).toBe(8);
    expect(fullRes.isReady).toBe(true);
  });

  it('calculates completion correctly from StudentProfile with fields record', () => {
    const profile: StudentProfile = {
      id: 'student-999',
      profileType: 'registered',
      createdAt: '2026-09-20T00:00:00.000Z',
      updatedAt: '2026-09-20T00:00:00.000Z',
      fields: {
        field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_education_level: { value: 'Undergraduate', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_course_stream: { value: 'Technology', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_current_year: { value: '1st Year', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_social_category: { value: 'SC', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_gender: { value: 'Male', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_annual_income: { value: 180000, status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        field_academic_percentage: { value: 92, status: 'known', updatedAt: '2026-09-20', source: 'profile' },
      },
      preferences: { language: 'en', theme: 'light' },
    };

    const res = calculateProfileCompletion(profile);
    expect(res.percentage).toBe(100);
    expect(res.knownFields).toBe(8);
    expect(res.isReady).toBe(true);
  });

  it('ignores unknown or zero values in completion calculation', () => {
    const profileWithUnknown: StudentProfile = {
      id: 'student-unknown',
      profileType: 'guest',
      createdAt: '2026-09-20T00:00:00.000Z',
      updatedAt: '2026-09-20T00:00:00.000Z',
      fields: {
        field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '2026-09-20', source: 'profile' },
        // Unknown status should not count
        field_education_level: { value: 'Undergraduate', status: 'unknown', updatedAt: '2026-09-20', source: 'profile' },
        // Zero income or academic percentage does not count
        field_annual_income: { value: 0, status: 'known', updatedAt: '2026-09-20', source: 'profile' },
      },
      preferences: { language: 'en', theme: 'light' },
    };

    const res = calculateProfileCompletion(profileWithUnknown);
    expect(res.knownFields).toBe(1); // only domicile_state
    expect(res.percentage).toBe(13); // 1 / 8 = 12.5% rounded to 13%
    expect(res.isReady).toBe(false);
  });
});
