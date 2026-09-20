import { eligibilityQuestions, questionByFieldId } from '../data/eligibility/questions';
import type { QuestionDefinition, QuestionnaireState } from '../types/questionnaire';
import type { Scholarship } from '../types/scholarship';
import type { StudentProfile } from '../types/studentProfile';
import { getCandidateScholarships } from './candidateEngine';
import { getField } from './fieldRegistry';
import { calculateProfileCompletion } from './profileCompletion';

export interface NextQuestionResult {
  question: QuestionDefinition | null;

  reason?: string;

  candidateScholarshipIds: string[];

  missingFieldIds: string[];

  progress: {
    knownFields: number;
    relevantFields: number;
    percentage: number;
  };
}

/**
 * Checks whether a question's showWhen visibility conditions are satisfied by current profile.
 */
export function isQuestionVisible(
  question: QuestionDefinition,
  profile: StudentProfile
): boolean {
  if (!question.showWhen || question.showWhen.length === 0) {
    return true;
  }

  return question.showWhen.every((rule) => {
    const studentField = profile.fields[rule.field];
    if (
      !studentField ||
      studentField.value === null ||
      studentField.value === undefined ||
      studentField.status !== 'known'
    ) {
      return false;
    }

    const actualVal = studentField.value;
    switch (rule.operator) {
      case 'equals':
        return String(actualVal).toLowerCase() === String(rule.value).toLowerCase();

      case 'not_equals':
        return String(actualVal).toLowerCase() !== String(rule.value).toLowerCase();

      case 'in':
        if (Array.isArray(rule.value)) {
          return rule.value.map(String).includes(String(actualVal));
        }
        return false;

      case 'not_in':
        if (Array.isArray(rule.value)) {
          return !rule.value.map(String).includes(String(actualVal));
        }
        return true;

      case 'is_true':
        return actualVal === true || actualVal === 'true' || actualVal === 1;

      case 'is_false':
        return actualVal === false || actualVal === 'false' || actualVal === 0;

      default:
        return true;
    }
  });
}

/**
 * Prunes and invalidates dependent fields when a parent answer changes.
 * E.g., if isHosteller changes to false, any hostelType value is removed.
 * E.g., if hasDisability changes to false, disabilityPercentage and disabilityType are removed.
 */
export function invalidateDependentFields(profile: StudentProfile): StudentProfile {
  let hasChanges = false;
  const newFields = { ...profile.fields };

  let changedInPass = true;
  while (changedInPass) {
    changedInPass = false;
    for (const [fieldId, fieldValue] of Object.entries(newFields)) {
      if (fieldValue.status === 'not_applicable') continue;

      const question = questionByFieldId[fieldId];
      if (question && question.showWhen && question.showWhen.length > 0) {
        const tempProfile: StudentProfile = { ...profile, fields: newFields };
        const visible = isQuestionVisible(question, tempProfile);
        if (!visible) {
          delete newFields[fieldId];
          hasChanges = true;
          changedInPass = true;
        }
      }
    }
  }

  if (!hasChanges) {
    return profile;
  }

  return {
    ...profile,
    updatedAt: new Date().toISOString(),
    fields: newFields,
  };
}

/**
 * Dynamically selects the next highest-yield question based on candidate scholarship relevance,
 * information gain, dependency satisfaction, and user progress.
 */
export function getNextQuestion(
  profile: StudentProfile,
  scholarships: Scholarship[],
  questionnaireState: QuestionnaireState,
  preferredFieldId?: string
): NextQuestionResult {
  // 1. Identify active candidate scholarships
  const candidateScholarships = getCandidateScholarships(scholarships, profile);
  const candidateScholarshipIds = candidateScholarships.map((s) => s.id);

  // 2. Identify relevant fields for active candidate scholarships
  const relevantFieldCountMap: Record<string, number> = {};

  for (const scholarship of candidateScholarships) {
    if (scholarship.eligibility) {
      scholarship.eligibility.requiredFields.forEach((fid) => {
        relevantFieldCountMap[fid] = (relevantFieldCountMap[fid] || 0) + 2; // Extra weight for required
      });
      scholarship.eligibility.optionalFields?.forEach((fid) => {
        relevantFieldCountMap[fid] = (relevantFieldCountMap[fid] || 0) + 1;
      });
    } else {
      ['field_education_level', 'field_stream', 'field_domicile_state', 'field_family_income'].forEach(
        (fid) => {
          relevantFieldCountMap[fid] = (relevantFieldCountMap[fid] || 0) + 1;
        }
      );
    }
  }

  // 3. Find missing fields (not yet answered or unknown in profile)
  const askedSet = new Set(questionnaireState.askedQuestionIds);
  const skippedSet = new Set(questionnaireState.skippedQuestionIds);

  const missingFieldIds: string[] = [];

  // Consider all questions in registry that map to discoverable fields
  for (const question of eligibilityQuestions) {
    const fieldDef = getField(question.fieldId);
    if (!fieldDef || fieldDef.applicationOnly) continue;

    const studentField = profile.fields[question.fieldId];
    const isAnswered =
      studentField &&
      ((studentField.status === 'known' &&
        studentField.value !== null &&
        studentField.value !== undefined &&
        studentField.value !== '') ||
        (studentField.status === 'custom' && !!studentField.customText) ||
        studentField.status === 'prefer_not_to_say');

    if (!isAnswered && !askedSet.has(question.id) && !skippedSet.has(question.id)) {
      missingFieldIds.push(question.fieldId);
    }
  }

  // 4. Score and rank potential next questions
  let bestQuestion: QuestionDefinition | null = null;
  let bestScore = -1;

  // Check if preferredFieldId is valid and visible (prioritize targeted question)
  if (preferredFieldId) {
    const prefQuestion = questionByFieldId[preferredFieldId];
    if (prefQuestion && isQuestionVisible(prefQuestion, profile)) {
      bestQuestion = prefQuestion;
      bestScore = 9999;
    }
  }

  if (!bestQuestion) {
    for (const fieldId of missingFieldIds) {
      const question = questionByFieldId[fieldId];
      if (!question) continue;

      // Check visibility conditions (dependency tree)
      if (!isQuestionVisible(question, profile)) {
        continue;
      }

      const fieldDef = getField(fieldId);
      const fieldWeight = fieldDef?.informationValueWeight || 5;
      const questionWeight = question.informationValue || 5;
      const candidateRelevance = relevantFieldCountMap[fieldId] || 0;
      const priority = question.priority || 50;

      // Combined ranking score: candidate relevance > information gain > base priority
      const score = candidateRelevance * 60 + fieldWeight * 5 + questionWeight * 3 + priority;

      if (score > bestScore) {
        bestScore = score;
        bestQuestion = question;
      }
    }
  }

  // 5. Calculate progress
  const progress = calculateProfileCompletion(profile, candidateScholarships);

  return {
    question: bestQuestion,
    reason: bestQuestion
      ? `Highest information value for narrowing down ${candidateScholarships.length} candidate scholarships.`
      : 'All relevant questions answered or no further questions available.',
    candidateScholarshipIds,
    missingFieldIds,
    progress,
  };
}
