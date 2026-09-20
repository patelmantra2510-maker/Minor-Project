import { describe, it, expect } from 'vitest';
import type { EligibilityRule, RuleGroup } from '../../types/eligibility';
import type { StudentProfile } from '../../types/studentProfile';
import { evaluateRule, evaluateRuleGroup } from '../ruleEvaluator';

function createMockProfile(fields: Record<string, any> = {}): StudentProfile {
  const profileFields: StudentProfile['fields'] = {};

  for (const [key, val] of Object.entries(fields)) {
    if (typeof val === 'object' && val !== null && 'status' in val) {
      profileFields[key] = val;
    } else {
      profileFields[key] = {
        value: val,
        status: 'known',
        updatedAt: new Date().toISOString(),
        source: 'questionnaire',
      };
    }
  }

  return {
    id: 'test_student_1',
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

describe('Rule Evaluator - Operators', () => {
  it('evaluates equals and not_equals', () => {
    const profile = createMockProfile({
      field_gender: 'female',
    });

    const ruleEquals: EligibilityRule = {
      id: 'r_gender_eq',
      fieldId: 'field_gender',
      operator: 'equals',
      value: 'female',
    };
    expect(evaluateRule(ruleEquals, profile).status).toBe('passed');

    const ruleNotEquals: EligibilityRule = {
      id: 'r_gender_neq',
      fieldId: 'field_gender',
      operator: 'not_equals',
      value: 'male',
    };
    expect(evaluateRule(ruleNotEquals, profile).status).toBe('passed');

    const ruleEqualsFail: EligibilityRule = {
      id: 'r_gender_fail',
      fieldId: 'field_gender',
      operator: 'equals',
      value: 'male',
    };
    expect(evaluateRule(ruleEqualsFail, profile).status).toBe('failed');
  });

  it('evaluates numeric comparisons: greater_than, greater_than_or_equal, less_than, less_than_or_equal', () => {
    const profile = createMockProfile({
      field_latest_score: 80,
      field_family_income: 250000,
    });

    expect(
      evaluateRule(
        { id: 'r1', fieldId: 'field_latest_score', operator: 'greater_than', value: 75 },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r2', fieldId: 'field_latest_score', operator: 'greater_than_or_equal', value: 80 },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r3', fieldId: 'field_family_income', operator: 'less_than', value: 300000 },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r4', fieldId: 'field_family_income', operator: 'less_than_or_equal', value: 250000 },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r5', fieldId: 'field_family_income', operator: 'less_than', value: 200000 },
        profile
      ).status
    ).toBe('failed');
  });

  it('evaluates between operator', () => {
    const profile = createMockProfile({ field_age: 19 });

    expect(
      evaluateRule(
        { id: 'r_between_pass', fieldId: 'field_age', operator: 'between', value: [18, 25] },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_between_fail', fieldId: 'field_age', operator: 'between', value: [20, 30] },
        profile
      ).status
    ).toBe('failed');
  });

  it('evaluates in and not_in operators', () => {
    const profile = createMockProfile({
      field_category: 'sc',
    });

    expect(
      evaluateRule(
        { id: 'r_in_pass', fieldId: 'field_category', operator: 'in', value: ['sc', 'st', 'sebc_obc'] },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_in_fail', fieldId: 'field_category', operator: 'in', value: ['general', 'ews'] },
        profile
      ).status
    ).toBe('failed');

    expect(
      evaluateRule(
        { id: 'r_notin_pass', fieldId: 'field_category', operator: 'not_in', value: ['general'] },
        profile
      ).status
    ).toBe('passed');
  });

  it('evaluates contains, not_contains, and starts_with', () => {
    const profile = createMockProfile({
      field_program: 'Bachelor of Computer Engineering',
    });

    expect(
      evaluateRule(
        { id: 'r_contains', fieldId: 'field_program', operator: 'contains', value: 'computer' },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_not_contains', fieldId: 'field_program', operator: 'not_contains', value: 'medical' },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_starts_with', fieldId: 'field_program', operator: 'starts_with', value: 'Bachelor' },
        profile
      ).status
    ).toBe('passed');
  });

  it('evaluates is_true and is_false', () => {
    const profile = createMockProfile({
      field_has_disability: true,
      field_is_orphan: false,
    });

    expect(
      evaluateRule(
        { id: 'r_pwd', fieldId: 'field_has_disability', operator: 'is_true' },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_orphan', fieldId: 'field_is_orphan', operator: 'is_false' },
        profile
      ).status
    ).toBe('passed');

    expect(
      evaluateRule(
        { id: 'r_pwd_fail', fieldId: 'field_has_disability', operator: 'is_false' },
        profile
      ).status
    ).toBe('failed');
  });
});

describe('Rule Evaluator - Uncertainty & Unknown Semantics', () => {
  it('strictly returns unknown when field is missing or status is unknown/prefer_not_to_say', () => {
    const profile = createMockProfile({
      field_gender: {
        value: null,
        status: 'unknown',
        updatedAt: '2026-09-20',
        source: 'questionnaire',
      },
      field_category: {
        value: null,
        status: 'prefer_not_to_say',
        updatedAt: '2026-09-20',
        source: 'questionnaire',
      },
    });

    // Missing field
    const resMissing = evaluateRule(
      { id: 'r_inc', fieldId: 'field_family_income', operator: 'less_than_or_equal', value: 300000 },
      profile
    );
    expect(resMissing.status).toBe('unknown');
    expect(resMissing.status).not.toBe('passed');

    // Unknown status
    const resUnknown = evaluateRule(
      { id: 'r_gen', fieldId: 'field_gender', operator: 'equals', value: 'female' },
      profile
    );
    expect(resUnknown.status).toBe('unknown');
    expect(resUnknown.status).not.toBe('passed');

    // Prefer not to say
    const resPnts = evaluateRule(
      { id: 'r_cat', fieldId: 'field_category', operator: 'equals', value: 'sc' },
      profile
    );
    expect(resPnts.status).toBe('unknown');
    expect(resPnts.status).not.toBe('passed');
  });
});

describe('Rule Groups & Nested Group Evaluation', () => {
  it('evaluates AND groups correctly', () => {
    const profile = createMockProfile({
      field_education_level: 'undergraduate',
      field_family_income: 200000,
    });

    const andGroup: RuleGroup = {
      operator: 'AND',
      rules: [
        {
          id: 'r_edu',
          fieldId: 'field_education_level',
          operator: 'equals',
          value: 'undergraduate',
        },
        {
          id: 'r_inc',
          fieldId: 'field_family_income',
          operator: 'less_than_or_equal',
          value: 300000,
        },
      ],
    };

    const res = evaluateRuleGroup(andGroup, profile);
    expect(res.status).toBe('passed');
  });

  it('evaluates OR groups correctly', () => {
    const profile = createMockProfile({
      field_category: 'sc',
    });

    const orGroup: RuleGroup = {
      operator: 'OR',
      rules: [
        { id: 'r_sc', fieldId: 'field_category', operator: 'equals', value: 'sc' },
        { id: 'r_st', fieldId: 'field_category', operator: 'equals', value: 'st' },
      ],
    };

    const res = evaluateRuleGroup(orGroup, profile);
    expect(res.status).toBe('passed');
  });

  it('evaluates nested AND / OR groups with uncertainty propagation', () => {
    // Education: undergraduate
    // Income: 200,000 (Passes <= 300,000)
    // Category: unknown
    const profile = createMockProfile({
      field_education_level: 'undergraduate',
      field_family_income: 200000,
      field_category: {
        value: null,
        status: 'unknown',
        updatedAt: '2026-09-20',
        source: 'questionnaire',
      },
    });

    const complexGroup: RuleGroup = {
      operator: 'AND',
      rules: [
        {
          id: 'r_edu',
          fieldId: 'field_education_level',
          operator: 'equals',
          value: 'undergraduate',
        },
        {
          id: 'r_inc',
          fieldId: 'field_family_income',
          operator: 'less_than_or_equal',
          value: 300000,
        },
      ],
      groups: [
        {
          operator: 'OR',
          rules: [
            { id: 'r_sc', fieldId: 'field_category', operator: 'equals', value: 'sc' },
            { id: 'r_st', fieldId: 'field_category', operator: 'equals', value: 'st' },
          ],
        },
      ],
    };

    const res = evaluateRuleGroup(complexGroup, profile);
    // Because category is unknown, the OR branch is unknown, so the top-level AND becomes unknown (not passed!)
    expect(res.status).toBe('unknown');
    expect(res.status).not.toBe('passed');
  });
});
