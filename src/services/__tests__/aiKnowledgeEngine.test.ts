import { describe, it, expect } from 'vitest';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import {
  buildScholarshipAIContext,
  generateScholarshipGuide,
  processScholarshipQuickQuestion,
  processGlobalQuery,
} from '../aiKnowledgeEngine';
import type { StudentAnswers, MatchResult } from '../../types/scholarship';

describe('AI Knowledge Engine', () => {
  const dummyAnswers: StudentAnswers = {
    location: 'Gujarat',
    educationLevel: 'Undergraduate',
    stream: 'Engineering',
    currentYear: '1st Year',
    category: 'General',
    gender: 'Male',
    annualIncome: 350000,
    academicPercentage: 88,
    isDisability: false,
    isOrphan: false,
    isDefenceWard: false,
    isMinority: false,
  };

  it('buildScholarshipAIContext works dynamically for EVERY scholarship in the dataset', () => {
    expect(SCHOLARSHIPS_DATA.length).toBeGreaterThanOrEqual(9);

    for (const scholarship of SCHOLARSHIPS_DATA) {
      const ctx = buildScholarshipAIContext(scholarship, dummyAnswers);
      expect(ctx.id).toBe(scholarship.id);
      expect(ctx.name).toBe(scholarship.name);
      expect(ctx.provider).toBe(scholarship.provider);
      expect(ctx.officialUrl).toBeTruthy();
      expect(ctx.deadline).toBeTruthy();
      expect(ctx.benefits).toBeTruthy();
      expect(ctx.documents.length).toBeGreaterThan(0);
      expect(ctx.studentContext).toContain('Gujarat');
      expect(ctx.studentContext).toContain('88%');
    }
  });

  it('generateScholarshipGuide generates all 10 required sections without percentage hallucinations', () => {
    const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;
    const dummyMatch: MatchResult = {
      scholarshipId: mysy.id,
      scholarship: mysy,
      status: 'strong_match',
      summaryMessage: 'You meet all criteria.',
      checks: [
        { ruleId: 'domicile', label: 'Domicile Requirement', status: 'matched', detail: 'Gujarat domicile matched.' },
      ],
    };

    const guide = generateScholarshipGuide(mysy, dummyAnswers, dummyMatch, 'en');
    const msg = guide.message;

    // Verify all 10 numbered sections exist
    expect(msg).toContain('# ' + mysy.name);
    expect(msg).toContain('## 1. What is this scholarship?');
    expect(msg).toContain('## 2. Who can apply?');
    expect(msg).toContain('## 3. Eligibility requirements');
    expect(msg).toContain('## 4. What benefits are provided?');
    expect(msg).toContain('## 5. Required documents');
    expect(msg).toContain('## 6. How to apply — Step by Step');
    expect(msg).toContain('## 7. Important dates');
    expect(msg).toContain('## 8. Does it match you?');
    expect(msg).toContain('## 9. Important things to verify');
    expect(msg).toContain('## 10. Official source');
    expect(msg).toContain('## 11. Final reminder');

    // Verify eligibility explanation
    expect(msg).toContain('Strong Match');
    // Ensure no hallucinated percentage eligibility (like 87% or 92% match)
    expect(msg).not.toMatch(/\b\d{2}% eligible\b/i);
    expect(msg).not.toMatch(/\b\d{2}% match\b/i);

    // Verify official link is attached
    expect(guide.sourceLinks?.[0]?.url).toBe(mysy.applicationWebsite);
    expect(guide.scholarshipIds).toContain('mysy-gujarat');
  });

  it('generates guide in Hindi and Gujarati with localized section titles', () => {
    const mysy = SCHOLARSHIPS_DATA[0];

    const hiGuide = generateScholarshipGuide(mysy, null, null, 'hi');
    expect(hiGuide.message).toContain('## 1. यह छात्रवृत्ति क्या है?');
    expect(hiGuide.message).toContain('## 5. आवश्यक दस्तावेज');
    expect(hiGuide.message).toContain('## 10. आधिकारिक स्रोत');

    const guGuide = generateScholarshipGuide(mysy, null, null, 'gu');
    expect(guGuide.message).toContain('## 1. આ શિષ્યવૃત્તિ શું છે?');
    expect(guGuide.message).toContain('## 5. જરૂરી દસ્તાવેજો');
    expect(guGuide.message).toContain('## 10. સત્તાવાર સ્ત્રોત');
  });

  it('processScholarshipQuickQuestion provides targeted answers without mixing context', () => {
    const aicte = SCHOLARSHIPS_DATA.find((s) => s.id === 'aicte-pragati-scholarship')!;
    const resDoc = processScholarshipQuickQuestion('documents', aicte, null, null, 'en');
    expect(resDoc.message).toContain('Required Documents for ' + aicte.name);
    expect(resDoc.scholarshipIds).toContain(aicte.id);

    const resBen = processScholarshipQuickQuestion('benefits', aicte, null, null, 'en');
    expect(resBen.message).toContain('Financial Assistance & Benefits');
    expect(resBen.message).toContain(aicte.benefits.amountDescription);
  });

  it('processGlobalQuery answers diploma, gujarat, and compare queries with real dataset items', () => {
    // Diploma query
    const diplomaRes = processGlobalQuery('Which scholarships are available for diploma students?');
    expect(diplomaRes.scholarshipIds?.length).toBeGreaterThan(0);
    expect(diplomaRes.message).toContain('Polytechnic and Diploma');

    // Gujarat query
    const gujRes = processGlobalQuery('What scholarships can I apply for in Gujarat?');
    expect(gujRes.scholarshipIds?.length).toBeGreaterThan(0);
    expect(gujRes.message).toContain('Gujarat');

    // Compare query
    const compRes = processGlobalQuery('Compare MYSY and CSSS');
    expect(compRes.message).toContain('Comparison:');
    expect(compRes.message).toContain('MYSY');
    expect(compRes.message).toContain('CSSS');
  });
});
