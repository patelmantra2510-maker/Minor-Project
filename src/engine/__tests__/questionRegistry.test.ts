import { describe, it, expect } from 'vitest';
import { fieldById } from '../../data/eligibility/fields';
import {
  eligibilityQuestions,
  questionById,
  questionByFieldId,
} from '../../data/eligibility/questions';

describe('Question Registry', () => {
  it('should ensure all question IDs are unique', () => {
    const idSet = new Set<string>();
    for (const q of eligibilityQuestions) {
      expect(idSet.has(q.id)).toBe(false);
      idSet.add(q.id);
    }
  });

  it('should ensure every question references a valid registered field ID', () => {
    for (const q of eligibilityQuestions) {
      expect(fieldById[q.fieldId]).toBeDefined();
    }
  });

  it('should support efficient lookup via questionById and questionByFieldId', () => {
    const qEdu = questionByFieldId['field_education_level'];
    expect(qEdu).toBeDefined();
    expect(qEdu.fieldId).toBe('field_education_level');
    expect(questionById[qEdu.id]).toBe(qEdu);
  });

  it('should ensure all questions have defined input types', () => {
    const validTypes = [
      'radio',
      'select',
      'multi_select',
      'number',
      'currency',
      'text',
      'date',
      'boolean',
      'range',
    ];
    for (const q of eligibilityQuestions) {
      expect(validTypes).toContain(q.inputType);
    }
  });
});
