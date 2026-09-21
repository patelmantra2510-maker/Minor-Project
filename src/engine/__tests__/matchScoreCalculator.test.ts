import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '../matchScoreCalculator';
import type { ScholarshipEligibilityResult, EligibilityRule } from '../../types/eligibility';
import { evaluateScholarshipDetails } from '../structuredEligibilityEvaluator';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import type { StudentAnswers } from '../../types/scholarship';

function makeMockRule(id: string, hardRequirement = true): EligibilityRule {
  return {
    id,
    fieldId: `field_${id}`,
    operator: 'equals',
    hardRequirement,
  };
}

describe('Edvora Match Score Calculator', () => {
  // Test 1: 5 passed, 0 failed, 0 unknown -> 100%, eligible
  it('Test 1: 5 passed, 0 failed, 0 unknown calculates 100% and eligible', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'test-scholarship',
      status: 'eligible',
      passedRules: [
        makeMockRule('state'),
        makeMockRule('education'),
        makeMockRule('income'),
        makeMockRule('academic'),
        makeMockRule('category'),
      ],
      failedRules: [],
      unknownRules: [],
      missingFields: [],
      explanation: 'All criteria met.',
    };

    const scoreResult = calculateMatchScore(mockResult);

    expect(scoreResult.score).toBe(100);
    expect(scoreResult.evaluatedCount).toBe(5);
    expect(scoreResult.passedCount).toBe(5);
    expect(scoreResult.failedCount).toBe(0);
    expect(scoreResult.unknownCount).toBe(0);
    expect(scoreResult.status).toBe('eligible');
    expect(scoreResult.hasHardRequirementFailure).toBe(false);
  });

  // Test 2: 4 passed, 0 failed, 1 unknown -> 100% evaluated match, possible, 1 unknown
  it('Test 2: 4 passed, 0 failed, 1 unknown calculates 100% evaluated match with status possible', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'test-scholarship',
      status: 'possible',
      passedRules: [
        makeMockRule('state'),
        makeMockRule('education'),
        makeMockRule('academic'),
        makeMockRule('category'),
      ],
      failedRules: [],
      unknownRules: [makeMockRule('income')],
      missingFields: ['field_income'],
      explanation: 'Income is unknown.',
    };

    const scoreResult = calculateMatchScore(mockResult);

    // 4 passed out of 4 evaluated = 100% evaluated match
    expect(scoreResult.score).toBe(100);
    expect(scoreResult.evaluatedCount).toBe(4);
    expect(scoreResult.passedCount).toBe(4);
    expect(scoreResult.failedCount).toBe(0);
    expect(scoreResult.unknownCount).toBe(1);
    expect(scoreResult.status).toBe('possible');
    expect(scoreResult.unknownCriteriaMessage).toBe('1 criterion is still unknown.');
  });

  // Test 3: 4 passed, 1 failed, 0 unknown -> 80%, not_eligible
  it('Test 3: 4 passed, 1 failed, 0 unknown calculates 80% and not_eligible', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'test-scholarship',
      status: 'not_eligible',
      passedRules: [
        makeMockRule('state'),
        makeMockRule('education'),
        makeMockRule('academic'),
        makeMockRule('category'),
      ],
      failedRules: [makeMockRule('income', true)],
      unknownRules: [],
      missingFields: [],
      explanation: 'Family income exceeds limit.',
    };

    const scoreResult = calculateMatchScore(mockResult);

    expect(scoreResult.score).toBe(80);
    expect(scoreResult.evaluatedCount).toBe(5);
    expect(scoreResult.passedCount).toBe(4);
    expect(scoreResult.failedCount).toBe(1);
    expect(scoreResult.unknownCount).toBe(0);
    expect(scoreResult.status).toBe('not_eligible');
    expect(scoreResult.hasHardRequirementFailure).toBe(true);
  });

  // Test 4: 3 passed, 1 failed, 1 unknown -> 75% evaluated match, not_eligible
  it('Test 4: 3 passed, 1 failed, 1 unknown calculates 75% evaluated match and not_eligible', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'test-scholarship',
      status: 'not_eligible',
      passedRules: [
        makeMockRule('state'),
        makeMockRule('education'),
        makeMockRule('academic'),
      ],
      failedRules: [makeMockRule('income', true)],
      unknownRules: [makeMockRule('category')],
      missingFields: ['field_category'],
      explanation: 'Income exceeds limit.',
    };

    const scoreResult = calculateMatchScore(mockResult);

    // 3 passed out of 4 evaluated = 75%
    expect(scoreResult.score).toBe(75);
    expect(scoreResult.evaluatedCount).toBe(4);
    expect(scoreResult.passedCount).toBe(3);
    expect(scoreResult.failedCount).toBe(1);
    expect(scoreResult.unknownCount).toBe(1);
    expect(scoreResult.status).toBe('not_eligible');
    expect(scoreResult.hasHardRequirementFailure).toBe(true);
  });

  // Test 5: No rules -> unavailable
  it('Test 5: No rules produces unavailable status and null score', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'empty-scholarship',
      status: 'eligible',
      passedRules: [],
      failedRules: [],
      unknownRules: [],
      missingFields: [],
      explanation: '',
    };

    const scoreResult = calculateMatchScore(mockResult);

    expect(scoreResult.score).toBeNull();
    expect(scoreResult.status).toBe('unavailable');
    expect(scoreResult.summaryText).toContain('Match score unavailable');
  });

  it('handles null result safely', () => {
    const scoreResult = calculateMatchScore(null);
    expect(scoreResult.score).toBeNull();
    expect(scoreResult.status).toBe('unavailable');
  });

  it('handles all unknown rules with 0 evaluated rules', () => {
    const mockResult: ScholarshipEligibilityResult = {
      scholarshipId: 'all-unknown',
      status: 'possible',
      passedRules: [],
      failedRules: [],
      unknownRules: [makeMockRule('income'), makeMockRule('marks')],
      missingFields: ['field_income', 'field_marks'],
      explanation: 'Information needed.',
    };

    const scoreResult = calculateMatchScore(mockResult);
    expect(scoreResult.score).toBeNull();
    expect(scoreResult.status).toBe('possible');
    expect(scoreResult.summaryText).toContain('More information needed');
  });

  // End-to-end integration test with evaluateScholarshipDetails
  it('integrates accurately with MYSY scholarship evaluation', () => {
    const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;
    expect(mysy).toBeDefined();

    const eligibleAnswers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 300000, // < 6,00,000
      academicPercentage: 85, // >= 80%
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const { result, criteria } = evaluateScholarshipDetails(mysy, eligibleAnswers);
    expect(result.status).toBe('eligible');
    expect(criteria.length).toBeGreaterThanOrEqual(5);

    const matchScore = calculateMatchScore(result, mysy);
    expect(matchScore.score).toBe(100);
    expect(matchScore.status).toBe('eligible');
  });

  it('marks MYSY as not_eligible when academic percentage is below cutoff', () => {
    const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;

    const ineligibleAnswers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 300000,
      academicPercentage: 72, // Below 80%
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const { result } = evaluateScholarshipDetails(mysy, ineligibleAnswers);
    expect(result.status).toBe('not_eligible');

    const matchScore = calculateMatchScore(result, mysy);
    expect(matchScore.status).toBe('not_eligible');
    expect(matchScore.hasHardRequirementFailure).toBe(true);
    expect(matchScore.score).toBeLessThan(100);
  });
});
