import type {
  ScholarshipEligibilityResult,
  EligibilityRule,
} from '../types/eligibility';
import type { Scholarship, StudentAnswers } from '../types/scholarship';
import type { StudentProfile } from '../types/studentProfile';

export interface EvaluatedCriterion {
  id: string;
  fieldId: string;
  name: string;
  yourValueText: string;
  requiredConditionText: string;
  status: 'passed' | 'failed' | 'unknown';
  isHardRequirement: boolean;
  explanation?: string;
}

export interface DetailedEligibilityEvaluation {
  result: ScholarshipEligibilityResult;
  criteria: EvaluatedCriterion[];
}

/**
 * Normalizes StudentAnswers or StudentProfile into a consistent lookup structure.
 */
interface NormalizedStudentInfo {
  location?: string;
  educationLevel?: string;
  stream?: string;
  currentYear?: string;
  category?: string;
  gender?: string;
  annualIncome?: number;
  academicPercentage?: number;
  isDisability?: boolean;
  disabilityPercentage?: number;
  isOrphan?: boolean;
  isDefenceWard?: boolean;
  isMinority?: boolean;
}

function extractStudentInfo(
  profileOrAnswers?: StudentProfile | StudentAnswers | null
): NormalizedStudentInfo {
  if (!profileOrAnswers) return {};

  // If it's StudentProfile with fields: Record<string, StudentFieldValue>
  if ('fields' in profileOrAnswers && typeof (profileOrAnswers as any).fields === 'object') {
    const f = (profileOrAnswers as StudentProfile).fields;
    const getFieldVal = (id: string) => {
      const field = f[id];
      if (!field || field.status === 'unknown') return undefined;
      return field.value;
    };

    return {
      location: (getFieldVal('field_domicile_state') || getFieldVal('field_current_state')) as string | undefined,
      educationLevel: getFieldVal('field_education_level') as string | undefined,
      stream: getFieldVal('field_course_stream') as string | undefined,
      currentYear: getFieldVal('field_current_year') as string | undefined,
      category: getFieldVal('field_social_category') as string | undefined,
      gender: getFieldVal('field_gender') as string | undefined,
      annualIncome: typeof getFieldVal('field_annual_income') === 'number' ? (getFieldVal('field_annual_income') as number) : undefined,
      academicPercentage: typeof getFieldVal('field_academic_percentage') === 'number' ? (getFieldVal('field_academic_percentage') as number) : undefined,
      isDisability: getFieldVal('field_disability_status') as boolean | undefined,
      isOrphan: getFieldVal('field_orphan_status') as boolean | undefined,
      isDefenceWard: getFieldVal('field_defence_ward_status') as boolean | undefined,
      isMinority: getFieldVal('field_minority_status') as boolean | undefined,
    };
  }

  // Otherwise, treat as StudentAnswers / Partial<StudentAnswers>
  const a = profileOrAnswers as Partial<StudentAnswers>;
  return {
    location: a.location,
    educationLevel: a.educationLevel,
    stream: a.stream,
    currentYear: a.currentYear,
    category: a.category,
    gender: a.gender,
    annualIncome: typeof a.annualIncome === 'number' ? a.annualIncome : undefined,
    academicPercentage: typeof a.academicPercentage === 'number' ? a.academicPercentage : undefined,
    isDisability: a.isDisability,
    disabilityPercentage: a.disabilityPercentage,
    isOrphan: a.isOrphan,
    isDefenceWard: a.isDefenceWard,
    isMinority: a.isMinority,
  };
}

export interface ProfileCompletionStatus {
  percentage: number;
  knownFields: number;
  totalFields: number;
  isReady: boolean;
}

/**
 * Deterministically calculates Student Profile completion percentage based on core eligibility criteria.
 */
export function calculateProfileCompletion(
  profileOrAnswers?: StudentProfile | StudentAnswers | null
): ProfileCompletionStatus {
  const student = extractStudentInfo(profileOrAnswers);

  const coreChecks = [
    Boolean(student.location),
    Boolean(student.educationLevel),
    Boolean(student.stream),
    Boolean(student.currentYear),
    Boolean(student.category),
    Boolean(student.gender),
    typeof student.annualIncome === 'number' && student.annualIncome > 0,
    typeof student.academicPercentage === 'number' && student.academicPercentage > 0,
  ];

  const knownFields = coreChecks.filter(Boolean).length;
  const totalFields = coreChecks.length;
  const percentage = Math.round((knownFields / totalFields) * 100);

  return {
    percentage,
    knownFields,
    totalFields,
    isReady: percentage >= 75,
  };
}

/**
 * Evaluates a Scholarship against the student's profile or answers into
 * the standard ScholarshipEligibilityResult and human-readable criteria breakdown.
 */
export function evaluateScholarshipDetails(
  scholarship: Scholarship,
  profileOrAnswers?: StudentProfile | StudentAnswers | null
): DetailedEligibilityEvaluation {
  const student = extractStudentInfo(profileOrAnswers);
  const criteria: EvaluatedCriterion[] = [];
  const passedRules: EligibilityRule[] = [];
  const failedRules: EligibilityRule[] = [];
  const unknownRules: EligibilityRule[] = [];
  const missingFields: string[] = [];

  // 1. Domicile / Location
  {
    const ruleId = `${scholarship.id}_location`;
    const isHard = true;
    const isStateOnly = scholarship.state === 'Gujarat';
    const reqText = isStateOnly
      ? 'Gujarat Domicile / Enrolled in Gujarat institution'
      : 'Open to students from all Indian states';

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (student.location) {
      yourText = student.location;
      if (!isStateOnly || student.location === 'Gujarat') {
        status = 'passed';
      } else {
        status = 'failed';
      }
    } else if (!isStateOnly) {
      status = 'passed';
      yourText = 'All-India eligible';
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_domicile_state',
      operator: 'equals',
      value: scholarship.state,
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_domicile_state');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_domicile_state',
      name: 'State Domicile / Location',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? 'This scheme is strictly restricted to students residing or studying in Gujarat.'
          : undefined,
    });
  }

  // 2. Education Level
  {
    const ruleId = `${scholarship.id}_education`;
    const isHard = true;
    const reqText = scholarship.educationLevels.join(' or ');

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (student.educationLevel) {
      yourText = student.educationLevel;
      if (scholarship.educationLevels.includes(student.educationLevel as any)) {
        status = 'passed';
      } else {
        status = 'failed';
      }
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_education_level',
      operator: 'in',
      value: scholarship.educationLevels,
      description: `Requires ${reqText}`,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_education_level');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_education_level',
      name: 'Education Level',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? `Requires ${reqText} education (your level: ${yourText}).`
          : undefined,
    });
  }

  // 3. Academic Score / Percentage
  {
    const ruleId = `${scholarship.id}_academic`;
    const isHard = true;
    const minPercent = scholarship.minimumPercentage;
    const reqText = minPercent !== null ? `≥ ${minPercent}% in qualifying exam` : 'Passing marks required';

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (minPercent === null) {
      status = 'passed';
      yourText = student.academicPercentage !== undefined ? `${student.academicPercentage}%` : 'Passing marks';
    } else if (student.academicPercentage !== undefined) {
      yourText = `${student.academicPercentage}%`;
      if (student.academicPercentage >= minPercent) {
        status = 'passed';
      } else {
        status = 'failed';
      }
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_academic_percentage',
      operator: 'greater_than_or_equal',
      value: minPercent,
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_academic_percentage');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_academic_percentage',
      name: 'Academic Score',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? `Your score (${yourText}) is below the required minimum of ${minPercent}%.`
          : undefined,
    });
  }

  // 4. Annual Family Income
  {
    const ruleId = `${scholarship.id}_income`;
    const isHard = true;
    const limit = scholarship.incomeLimit;
    const reqText = limit !== null ? `≤ ₹${limit.toLocaleString('en-IN')}/year` : 'No income ceiling';

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (limit === null) {
      status = 'passed';
      yourText = student.annualIncome !== undefined ? `₹${student.annualIncome.toLocaleString('en-IN')}` : 'No limit';
    } else if (student.annualIncome !== undefined) {
      yourText = `₹${student.annualIncome.toLocaleString('en-IN')}`;
      if (student.annualIncome <= limit) {
        status = 'passed';
      } else {
        status = 'failed';
      }
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_annual_income',
      operator: 'less_than_or_equal',
      value: limit,
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_annual_income');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_annual_income',
      name: 'Family Income',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? `Family income (${yourText}) exceeds the maximum stated ceiling of ₹${limit?.toLocaleString('en-IN')}.`
          : undefined,
    });
  }

  // 5. Social Category
  {
    const ruleId = `${scholarship.id}_category`;
    const isHard = true;
    const categoriesList = scholarship.categories as string[];
    const isAll = categoriesList.includes('All');
    const reqText = isAll ? 'Open to all categories (General, SC, ST, SEBC/OBC, EWS)' : categoriesList.join(' / ');

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (isAll) {
      status = 'passed';
      yourText = student.category || 'All categories eligible';
    } else if (student.category && student.category !== 'Prefer not to say') {
      yourText = student.category;
      if (categoriesList.includes(student.category)) {
        status = 'passed';
      } else {
        status = 'failed';
      }
    } else if (student.category === 'Prefer not to say') {
      yourText = 'Prefer not to say';
      status = 'unknown';
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_social_category',
      operator: 'in',
      value: scholarship.categories,
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_social_category');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_social_category',
      name: 'Social Category',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? `Restricted to ${reqText} candidates (your selected category: ${yourText}).`
          : undefined,
    });
  }

  // 6. Gender Eligibility
  if (scholarship.genderEligibility !== 'All') {
    const ruleId = `${scholarship.id}_gender`;
    const isHard = true;
    const reqText = `${scholarship.genderEligibility} students only`;

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (student.gender && student.gender !== 'Prefer not to say') {
      yourText = student.gender;
      if (scholarship.genderEligibility === student.gender) {
        status = 'passed';
      } else {
        status = 'failed';
      }
    } else if (student.gender === 'Prefer not to say') {
      yourText = 'Prefer not to say';
      status = 'unknown';
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_gender',
      operator: 'equals',
      value: scholarship.genderEligibility,
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_gender');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_gender',
      name: 'Gender Requirement',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? `Scholarship is reserved for ${scholarship.genderEligibility} applicants.`
          : undefined,
    });
  }

  // 7. Special Conditions (if required by scheme)
  if (scholarship.specialConditions?.disabilityRequired) {
    const ruleId = `${scholarship.id}_disability`;
    const isHard = true;
    const minDisability = scholarship.specialConditions.minDisabilityPercentage || 40;
    const reqText = `Valid UDID / Disability certificate (≥ ${minDisability}%)`;

    let status: 'passed' | 'failed' | 'unknown' = 'unknown';
    let yourText = 'Not provided';

    if (student.isDisability !== undefined) {
      if (student.isDisability) {
        const percent = student.disabilityPercentage ?? 40;
        yourText = `Yes (${percent}%)`;
        if (percent >= minDisability) {
          status = 'passed';
        } else {
          status = 'failed';
        }
      } else {
        yourText = 'No';
        status = 'failed';
      }
    }

    const rule: EligibilityRule = {
      id: ruleId,
      fieldId: 'field_disability_status',
      operator: 'is_true',
      description: reqText,
      hardRequirement: isHard,
    };

    if (status === 'passed') passedRules.push(rule);
    else if (status === 'failed') failedRules.push(rule);
    else {
      unknownRules.push(rule);
      missingFields.push('field_disability_status');
    }

    criteria.push({
      id: ruleId,
      fieldId: 'field_disability_status',
      name: 'Disability Criterion',
      yourValueText: yourText,
      requiredConditionText: reqText,
      status,
      isHardRequirement: isHard,
      explanation:
        status === 'failed'
          ? 'Dedicated exclusively for students with benchmark disability.'
          : undefined,
    });
  }

  // Overall status determination
  const hasHardFailed = failedRules.some((r) => r.hardRequirement !== false);
  let overallStatus: 'eligible' | 'possible' | 'not_eligible';
  let explanation = '';

  if (hasHardFailed) {
    overallStatus = 'not_eligible';
    const firstFail = criteria.find((c) => c.status === 'failed');
    explanation = firstFail?.explanation || 'One or more required conditions are not satisfied.';
  } else if (unknownRules.length > 0) {
    overallStatus = 'possible';
    explanation = 'Some information is still needed to confirm full eligibility.';
  } else {
    overallStatus = 'eligible';
    explanation = 'Your current profile satisfies all known eligibility requirements.';
  }

  const result: ScholarshipEligibilityResult = {
    scholarshipId: scholarship.id,
    status: overallStatus,
    passedRules,
    failedRules,
    unknownRules,
    missingFields,
    explanation,
  };

  return {
    result,
    criteria,
  };
}
