import { describe, it, expect } from 'vitest';
import { eligibilityFields, fieldById } from '../../data/eligibility/fields';
import {
  getField,
  getAllEligibilityFields,
  isOperatorCompatibleWithField,
  validateFieldValue,
} from '../fieldRegistry';

describe('Field Registry', () => {
  it('should ensure every field has a unique ID', () => {
    const idSet = new Set<string>();
    for (const field of eligibilityFields) {
      expect(idSet.has(field.id)).toBe(false);
      idSet.add(field.id);
    }
  });

  it('should ensure every field has a unique key', () => {
    const keySet = new Set<string>();
    for (const field of eligibilityFields) {
      expect(keySet.has(field.key)).toBe(false);
      keySet.add(field.key);
    }
  });

  it('should ensure field IDs start with field_ prefix', () => {
    for (const field of eligibilityFields) {
      expect(field.id.startsWith('field_')).toBe(true);
    }
  });

  it('should ensure every field has a valid data type and category', () => {
    const validDataTypes = [
      'text',
      'number',
      'boolean',
      'single_select',
      'multi_select',
      'date',
      'currency',
      'range',
    ];
    const validCategories = [
      'demographic',
      'location',
      'education',
      'academic',
      'social',
      'financial',
      'residence',
      'special',
      'achievement',
      'document',
      'other',
    ];

    for (const field of eligibilityFields) {
      expect(validDataTypes).toContain(field.dataType);
      expect(validCategories).toContain(field.category);
    }
  });

  it('should allow fast lookup via getField, getAllEligibilityFields, and fieldById', () => {
    expect(getAllEligibilityFields().length).toBe(eligibilityFields.length);
    const eduField = getField('field_education_level');
    expect(eduField).toBeDefined();
    expect(eduField?.key).toBe('educationLevel');
    expect(fieldById['field_education_level']).toBe(eduField);
  });

  it('should accurately test operator compatibility with field data types', () => {
    expect(isOperatorCompatibleWithField('equals', 'single_select')).toBe(true);
    expect(isOperatorCompatibleWithField('greater_than', 'number')).toBe(true);
    expect(isOperatorCompatibleWithField('greater_than', 'currency')).toBe(true);
    expect(isOperatorCompatibleWithField('greater_than', 'single_select')).toBe(false);
    expect(isOperatorCompatibleWithField('in', 'single_select')).toBe(true);
    expect(isOperatorCompatibleWithField('is_true', 'boolean')).toBe(true);
    expect(isOperatorCompatibleWithField('is_true', 'number')).toBe(false);
  });

  it('should validate values against field definitions', () => {
    const ageField = getField('field_age')!;
    expect(validateFieldValue(ageField, 20).valid).toBe(true);
    expect(validateFieldValue(ageField, 150).valid).toBe(false);
    expect(validateFieldValue(ageField, 'abc').valid).toBe(false);

    const genderField = getField('field_gender')!;
    expect(validateFieldValue(genderField, 'female').valid).toBe(true);
    expect(validateFieldValue(genderField, 'invalid_gender').valid).toBe(false);
  });
});
