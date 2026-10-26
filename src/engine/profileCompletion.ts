import type { Scholarship } from '../types/scholarship';
import type { StudentProfile } from '../types/studentProfile';
import { isScholarshipCandidate } from './candidateEngine';

/**
 * Standard baseline fields considered globally relevant for general scholarship matching.
 */
const BASELINE_DISCOVERY_FIELDS = [
  'field_education_level',
  'field_stream',
  'field_academic_year',
  'field_domicile_state',
  'field_gender',
  'field_category',
  'field_family_income',
  'field_latest_score',
  'field_institution_state',
  'field_institution_type',
];

export interface ProfileCompletionResult {
  percentage: number;
  knownFields: number;
  relevantFields: number;
}

/**
 * Calculates profile completion percentage against relevant fields.
 * CRITICAL RULE: Completion is calculated relative to relevant candidate scholarship
 * fields, NOT against the entire 65+ universal field registry.
 */
export function calculateProfileCompletion(
  profile: StudentProfile | null | undefined,
  relevantScholarships?: Scholarship[]
): ProfileCompletionResult {
  if (!profile || !profile.fields) {
    return {
      percentage: 0,
      knownFields: 0,
      relevantFields: BASELINE_DISCOVERY_FIELDS.length,
    };
  }

  const relevantFieldIds = new Set<string>();

  if (relevantScholarships && relevantScholarships.length > 0) {
    // Only inspect scholarships that are valid candidates for this student profile
    const candidateScholarships = relevantScholarships.filter((s) => isScholarshipCandidate(s, profile));
    const targetScholarships = candidateScholarships.length > 0 ? candidateScholarships : relevantScholarships;

    for (const scholarship of targetScholarships) {
      if (scholarship.eligibility) {
        scholarship.eligibility.requiredFields.forEach((fid) => relevantFieldIds.add(fid));
        if (scholarship.eligibility.optionalFields) {
          scholarship.eligibility.optionalFields.forEach((fid) => relevantFieldIds.add(fid));
        }
      } else {
        // Fallback for legacy scholarships without explicit rule groups
        relevantFieldIds.add('field_education_level');
        relevantFieldIds.add('field_stream');
        relevantFieldIds.add('field_academic_year');
        relevantFieldIds.add('field_domicile_state');
        relevantFieldIds.add('field_gender');
        relevantFieldIds.add('field_category');
        if (scholarship.incomeLimit !== null) relevantFieldIds.add('field_family_income');
        if (scholarship.minimumPercentage !== null) relevantFieldIds.add('field_latest_score');
        if (scholarship.specialConditions?.disabilityRequired) relevantFieldIds.add('field_has_disability');
        if (scholarship.specialConditions?.minorityRequired) relevantFieldIds.add('field_minority_status');
        if (scholarship.specialConditions?.orphanRequired) relevantFieldIds.add('field_is_orphan');
        if (scholarship.specialConditions?.defenceWardRequired) relevantFieldIds.add('field_is_defence_dependent');
        if (scholarship.benefits?.hostelAllowance) relevantFieldIds.add('field_is_hosteller');
      }
    }
  }

  // If no scholarships provided or no specific rules found, use baseline discovery fields
  if (relevantFieldIds.size === 0) {
    BASELINE_DISCOVERY_FIELDS.forEach((fid) => relevantFieldIds.add(fid));
  }

  const totalRelevant = relevantFieldIds.size;
  let knownCount = 0;

  for (const fieldId of relevantFieldIds) {
    const fieldRecord = profile.fields[fieldId];
    if (
      fieldRecord &&
      fieldRecord.status === 'known' &&
      fieldRecord.value !== null &&
      fieldRecord.value !== undefined &&
      fieldRecord.value !== ''
    ) {
      knownCount++;
    }
  }

  let percentage = 0;
  if (totalRelevant > 0 && knownCount > 0) {
    if (knownCount >= totalRelevant) {
      percentage = 100;
    } else {
      percentage = Math.min(99, Math.round((knownCount / totalRelevant) * 100));
    }
  }

  return {
    percentage,
    knownFields: knownCount,
    relevantFields: totalRelevant,
  };
}
