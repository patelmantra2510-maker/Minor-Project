import { describe, it, expect } from 'vitest';
import { evaluateScholarship } from '../eligibilityEngine';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import type { StudentAnswers } from '../../types/scholarship';

describe('Eligibility Engine Specification Tests', () => {
  const mysyScholarship = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;
  const pragatiScholarship = SCHOLARSHIPS_DATA.find((s) => s.id === 'aicte-pragati-scholarship')!;
  const csssScholarship = SCHOLARSHIPS_DATA.find((s) => s.id === 'pm-usp-csss-national')!;
  const scScholarship = SCHOLARSHIPS_DATA.find((s) => s.id === 'digital-gujarat-sc-postmatric')!;

  // 1. Gujarat Diploma student who satisfies known requirements -> Strong Match
  it('Test 1: Gujarat Diploma student meeting MYSY requirements evaluates to strong_match', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 250000, // within 6 LPA
      academicPercentage: 85, // >= 80%
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    expect(result.status).toBe('strong_match');
    expect(result.checks.every((c) => c.status === 'matched')).toBe(true);
  });

  // 2. Student who clearly fails a hard requirement -> Not Eligible
  it('Test 2: Student outside Gujarat applying for Gujarat-only scheme evaluates to not_eligible', () => {
    const answers: StudentAnswers = {
      location: 'Other Indian State',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 200000,
      academicPercentage: 85,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    expect(result.status).toBe('not_eligible');
    const locationCheck = result.checks.find((c) => c.ruleId === 'location');
    expect(locationCheck?.status).toBe('unmatched');
  });

  // 3. Student where a condition requires verification -> Possible Match
  it('Test 3: Student meeting core criteria on scheme with institutional verification evaluates to possible_match', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 300000, // within 4.5 LPA
      academicPercentage: 88, // >= 80%
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(csssScholarship, answers);
    // PM-USP CSSS has specialConditions.requiresVerification = true (80th percentile verification)
    expect(result.status).toBe('possible_match');
    const verificationCheck = result.checks.find((c) => c.ruleId === 'verification');
    expect(verificationCheck?.status).toBe('warning');
  });

  // 4. Female-only scholarship + male student -> Not Eligible
  it('Test 4: Female-only scholarship (AICTE Pragati) evaluated for male student returns not_eligible', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male', // Pragati is Female only
      annualIncome: 300000,
      academicPercentage: 75,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(pragatiScholarship, answers);
    expect(result.status).toBe('not_eligible');
    const genderCheck = result.checks.find((c) => c.ruleId === 'gender');
    expect(genderCheck?.status).toBe('unmatched');
  });

  // 5. Income above scholarship income limit -> Not Eligible
  it('Test 5: Family income exceeding ceiling returns not_eligible', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 750000, // Exceeds MYSY 6 LPA limit
      academicPercentage: 85,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    expect(result.status).toBe('not_eligible');
    const incomeCheck = result.checks.find((c) => c.ruleId === 'income');
    expect(incomeCheck?.status).toBe('unmatched');
  });

  // 6. Income below scholarship income limit -> Pass income rule
  it('Test 6: Family income below limit passes income check', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 400000, // Within 6 LPA
      academicPercentage: 85,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    const incomeCheck = result.checks.find((c) => c.ruleId === 'income');
    expect(incomeCheck?.status).toBe('matched');
  });

  // 7. Percentage below minimum requirement -> Not Eligible
  it('Test 7: Percentage below minimum threshold returns not_eligible', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 200000,
      academicPercentage: 74, // Below MYSY minimum 80%
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    expect(result.status).toBe('not_eligible');
    const percentageCheck = result.checks.find((c) => c.ruleId === 'percentage');
    expect(percentageCheck?.status).toBe('unmatched');
  });

  // 8. Percentage meeting requirement -> Pass academic check
  it('Test 8: Percentage meeting requirement passes academic check', () => {
    const answers: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Diploma',
      stream: 'Computer Engineering / IT',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 200000,
      academicPercentage: 82, // Meets MYSY 80% requirement
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const result = evaluateScholarship(mysyScholarship, answers);
    const percentageCheck = result.checks.find((c) => c.ruleId === 'percentage');
    expect(percentageCheck?.status).toBe('matched');
  });

  // Additional check: Category verification
  it('Test Category match for SC scheme', () => {
    const answersGeneral: StudentAnswers = {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 180000,
      academicPercentage: 75,
      isDisability: false,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };

    const resultGen = evaluateScholarship(scScholarship, answersGeneral);
    expect(resultGen.status).toBe('not_eligible');

    const answersSC: StudentAnswers = {
      ...answersGeneral,
      category: 'SC',
    };
    const resultSC = evaluateScholarship(scScholarship, answersSC);
    expect(resultSC.status).toBe('strong_match');
  });
});
