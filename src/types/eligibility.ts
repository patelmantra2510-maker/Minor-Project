export type FieldDataType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'single_select'
  | 'multi_select'
  | 'date'
  | 'currency'
  | 'range';

export type FieldCategory =
  | 'demographic'
  | 'location'
  | 'education'
  | 'academic'
  | 'social'
  | 'financial'
  | 'residence'
  | 'special'
  | 'achievement'
  | 'document'
  | 'other';

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface EligibilityFieldDefinition {
  id: string;

  /**
   * Stable machine-readable identifier.
   */
  key: string;

  label: string;

  description?: string;

  dataType: FieldDataType;

  category: FieldCategory;

  options?: FieldOption[];

  validation?: ValidationRules;

  /**
   * Whether this field can affect scholarship eligibility.
   */
  eligibilityRelevant: boolean;

  /**
   * Indicates information requiring additional privacy handling.
   */
  sensitive?: boolean;

  /**
   * Whether this field can normally be collected
   * during scholarship discovery/profile building.
   */
  discoverable?: boolean;

  /**
   * Application-only fields must NOT be requested
   * during ordinary scholarship discovery.
   */
  applicationOnly?: boolean;

  /**
   * Used by the adaptive question engine to prioritize high-yield questions.
   */
  informationValueWeight?: number;

  translationKey?: string;
}

export type ProfileValueStatus =
  | 'known'
  | 'unknown'
  | 'not_applicable'
  | 'prefer_not_to_say'
  | 'custom';

export type RuleOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'is_true'
  | 'is_false';

export interface EligibilityRule {
  id: string;

  fieldId: string;

  operator: RuleOperator;

  value?: unknown;

  description?: string;

  /**
   * If true, failure means the student definitely
   * does not satisfy this requirement.
   */
  hardRequirement?: boolean;

  source?: {
    title: string;
    url: string;
    verifiedAt: string;
  };
}

export interface RuleGroup {
  operator: 'AND' | 'OR';

  rules?: EligibilityRule[];

  groups?: RuleGroup[];
}

export interface ScholarshipEligibility {
  requiredFields: string[];

  rules: RuleGroup;

  optionalFields?: string[];
}

export interface RuleEvaluationResult {
  ruleId: string;

  status: 'passed' | 'failed' | 'unknown';

  reason?: string;
}

export interface ScholarshipEligibilityResult {
  scholarshipId: string;

  status: 'eligible' | 'possible' | 'not_eligible';

  passedRules: EligibilityRule[];

  failedRules: EligibilityRule[];

  unknownRules: EligibilityRule[];

  missingFields: string[];

  explanation: string;
}
