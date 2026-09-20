import type { FieldOption } from './eligibility';
import type { StudentFieldValue } from './studentProfile';

export type QuestionInputType =
  | 'radio'
  | 'select'
  | 'multi_select'
  | 'number'
  | 'currency'
  | 'text'
  | 'date'
  | 'boolean'
  | 'range';

export interface QuestionVisibilityRule {
  field: string;

  operator:
    | 'equals'
    | 'not_equals'
    | 'in'
    | 'not_in'
    | 'is_true'
    | 'is_false';

  value?: unknown;
}

export interface QuestionDefinition {
  id: string;

  /**
   * Field this question collects.
   */
  fieldId: string;

  question: string;

  description?: string;

  inputType: QuestionInputType;

  options?: FieldOption[];

  placeholder?: string;

  showWhen?: QuestionVisibilityRule[];

  allowOther?: boolean;

  allowUnknown?: boolean;

  allowPreferNotToSay?: boolean;

  priority?: number;

  informationValue?: number;

  translationKey?: string;
}

export interface QuestionnaireState {
  sessionId: string;

  profileId: string;

  startedAt: string;

  completedAt?: string;

  currentQuestionId?: string;

  askedQuestionIds: string[];

  skippedQuestionIds: string[];

  answers: Record<string, StudentFieldValue>;

  candidateScholarshipIds: string[];

  missingFieldIds: string[];

  status:
    | 'not_started'
    | 'in_progress'
    | 'completed'
    | 'paused';
}
