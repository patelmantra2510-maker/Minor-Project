import { eligibilityFields, fieldById } from '../data/eligibility/fields';
import type {
  EligibilityFieldDefinition,
  FieldDataType,
  RuleOperator,
} from '../types/eligibility';

/**
 * Retrieve field definition by its stable ID (e.g. 'field_education_level').
 */
export function getField(fieldId: string): EligibilityFieldDefinition | undefined {
  return fieldById[fieldId];
}

/**
 * Retrieve all registered fields.
 */
export function getAllEligibilityFields(): EligibilityFieldDefinition[] {
  return eligibilityFields;
}

/**
 * Check if a rule operator is logically compatible with a field's data type.
 */
export function isOperatorCompatibleWithField(
  operator: RuleOperator,
  dataType: FieldDataType
): boolean {
  switch (operator) {
    case 'equals':
    case 'not_equals':
      return true;

    case 'greater_than':
    case 'greater_than_or_equal':
    case 'less_than':
    case 'less_than_or_equal':
    case 'between':
      return dataType === 'number' || dataType === 'currency' || dataType === 'date';

    case 'in':
    case 'not_in':
      return (
        dataType === 'single_select' ||
        dataType === 'multi_select' ||
        dataType === 'text' ||
        dataType === 'number'
      );

    case 'contains':
    case 'not_contains':
      return (
        dataType === 'text' ||
        dataType === 'multi_select' ||
        dataType === 'single_select'
      );

    case 'starts_with':
      return dataType === 'text';

    case 'is_true':
    case 'is_false':
      return dataType === 'boolean';

    default:
      return false;
  }
}

/**
 * Validates a value against an EligibilityFieldDefinition.
 */
export function validateFieldValue(
  field: EligibilityFieldDefinition,
  value: unknown
): { valid: boolean; error?: string } {
  if (value === null || value === undefined) {
    if (field.validation?.required) {
      return { valid: false, error: `${field.label} is required.` };
    }
    return { valid: true };
  }

  switch (field.dataType) {
    case 'number':
    case 'currency': {
      const num = typeof value === 'number' ? value : Number(value);
      if (isNaN(num)) {
        return { valid: false, error: `${field.label} must be a valid number.` };
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return {
          valid: false,
          error: `${field.label} must be at least ${field.validation.min}.`,
        };
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return {
          valid: false,
          error: `${field.label} must be at most ${field.validation.max}.`,
        };
      }
      return { valid: true };
    }

    case 'boolean': {
      if (typeof value !== 'boolean') {
        return { valid: false, error: `${field.label} must be true or false.` };
      }
      return { valid: true };
    }

    case 'single_select': {
      if (typeof value !== 'string') {
        return { valid: false, error: `${field.label} must be a string.` };
      }
      if (field.options && field.options.length > 0) {
        const optionExists = field.options.some((opt) => opt.value === value);
        if (!optionExists) {
          return {
            valid: false,
            error: `Invalid option '${value}' for ${field.label}.`,
          };
        }
      }
      return { valid: true };
    }

    case 'multi_select': {
      if (!Array.isArray(value)) {
        return { valid: false, error: `${field.label} must be an array of values.` };
      }
      if (field.options && field.options.length > 0) {
        const validValues = new Set(field.options.map((opt) => opt.value));
        for (const item of value) {
          if (!validValues.has(item)) {
            return {
              valid: false,
              error: `Invalid option '${item}' in ${field.label}.`,
            };
          }
        }
      }
      return { valid: true };
    }

    case 'text': {
      if (typeof value !== 'string') {
        return { valid: false, error: `${field.label} must be text.` };
      }
      if (
        field.validation?.minLength !== undefined &&
        value.length < field.validation.minLength
      ) {
        return {
          valid: false,
          error: `${field.label} must be at least ${field.validation.minLength} characters.`,
        };
      }
      if (
        field.validation?.maxLength !== undefined &&
        value.length > field.validation.maxLength
      ) {
        return {
          valid: false,
          error: `${field.label} cannot exceed ${field.validation.maxLength} characters.`,
        };
      }
      return { valid: true };
    }

    case 'date': {
      if (typeof value !== 'string' && !(value instanceof Date)) {
        return { valid: false, error: `${field.label} must be a valid date.` };
      }
      const date = new Date(value as string | Date);
      if (isNaN(date.getTime())) {
        return { valid: false, error: `${field.label} must be a valid date.` };
      }
      return { valid: true };
    }

    default:
      return { valid: true };
  }
}
