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

  // Standard core fields for initial general discovery
  const CORE_DISCOVERY_FIELDS = [
    'field_education_level',
    'field_stream',
    'field_branch',
    'field_academic_year',
    'field_latest_score',
    'field_domicile_state',
    'field_category',
    'field_family_income',
    'field_gender',
  ];

  if (candidateScholarships.length === 0) {
    // If no candidate scholarships (e.g. empty scholarship list passed),
    // activate core discovery fields so initial discovery questions can proceed
    CORE_DISCOVERY_FIELDS.forEach((fid) => {
      relevantFieldCountMap[fid] = 1;
    });
  } else {
    for (const scholarship of candidateScholarships) {
      if (scholarship.eligibility) {
        scholarship.eligibility.requiredFields.forEach((fid) => {
          relevantFieldCountMap[fid] = (relevantFieldCountMap[fid] || 0) + 3; // Extra weight for required
        });
        scholarship.eligibility.optionalFields?.forEach((fid) => {
          relevantFieldCountMap[fid] = (relevantFieldCountMap[fid] || 0) + 1;
        });
      } else {
        // Standard legacy scholarship criteria
        relevantFieldCountMap['field_education_level'] = (relevantFieldCountMap['field_education_level'] || 0) + 1;
        relevantFieldCountMap['field_stream'] = (relevantFieldCountMap['field_stream'] || 0) + 1;
        relevantFieldCountMap['field_branch'] = (relevantFieldCountMap['field_branch'] || 0) + 1;
        relevantFieldCountMap['field_academic_year'] = (relevantFieldCountMap['field_academic_year'] || 0) + 1;
        relevantFieldCountMap['field_domicile_state'] = (relevantFieldCountMap['field_domicile_state'] || 0) + 1;
        relevantFieldCountMap['field_category'] = (relevantFieldCountMap['field_category'] || 0) + 1;
        relevantFieldCountMap['field_gender'] = (relevantFieldCountMap['field_gender'] || 0) + 1;

        if (scholarship.incomeLimit !== null) {
          relevantFieldCountMap['field_family_income'] = (relevantFieldCountMap['field_family_income'] || 0) + 1;
        }
        if (scholarship.minimumPercentage !== null) {
          relevantFieldCountMap['field_latest_score'] = (relevantFieldCountMap['field_latest_score'] || 0) + 1;
        }

        // Special conditions in scholarship
        if (scholarship.specialConditions?.disabilityRequired) {
          relevantFieldCountMap['field_has_disability'] = (relevantFieldCountMap['field_has_disability'] || 0) + 2;
        }
        if (scholarship.specialConditions?.minorityRequired) {
          relevantFieldCountMap['field_minority_status'] = (relevantFieldCountMap['field_minority_status'] || 0) + 2;
        }
        if (scholarship.specialConditions?.orphanRequired) {
          relevantFieldCountMap['field_is_orphan'] = (relevantFieldCountMap['field_is_orphan'] || 0) + 2;
        }
        if (scholarship.specialConditions?.defenceWardRequired) {
          relevantFieldCountMap['field_is_defence_dependent'] = (relevantFieldCountMap['field_is_defence_dependent'] || 0) + 2;
        }
        if (
          scholarship.benefits?.hostelAllowance ||
          scholarship.tags?.some((t) => t.toLowerCase().includes('hostel'))
        ) {
          relevantFieldCountMap['field_is_hosteller'] = (relevantFieldCountMap['field_is_hosteller'] || 0) + 2;
        }
      }
    }
  }

  // Progressive disclosure: if parent condition is met, activate child fields
  const fields = profile.fields;
  if (fields['field_has_disability']?.value === true && fields['field_has_disability']?.status === 'known') {
    relevantFieldCountMap['field_disability_percentage'] = 100;
    relevantFieldCountMap['field_disability_type'] = 90;
  }
  if (fields['field_minority_status']?.value === true && fields['field_minority_status']?.status === 'known') {
    relevantFieldCountMap['field_minority_community'] = 100;
  }
  if (fields['field_is_hosteller']?.value === true && fields['field_is_hosteller']?.status === 'known') {
    relevantFieldCountMap['field_hostel_type'] = 100;
  }

  // School path activation
  if (fields['field_education_level']?.value === 'school' && fields['field_education_level']?.status === 'known') {
    relevantFieldCountMap['field_class_12_percentage'] = (relevantFieldCountMap['field_class_12_percentage'] || 0) + 2;
    relevantFieldCountMap['field_board'] = (relevantFieldCountMap['field_board'] || 0) + 1;
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

      // MINIMUM-DATA PRINCIPLE:
      // Only ask questions that are relevant to candidate scholarships
      const candidateRelevance = relevantFieldCountMap[fieldId] || 0;
      if (candidateRelevance <= 0) {
        continue;
      }

      const fieldDef = getField(fieldId);
      const fieldWeight = fieldDef?.informationValueWeight || 5;
      const questionWeight = question.informationValue || 5;
      const priority = question.priority || 50;

      // Combined ranking score: candidate relevance > priority > information gain
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
