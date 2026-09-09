import type {
  Scholarship,
  StudentAnswers,
  MatchResult,
  MatchStatus,
  RuleCheck,
} from '../types/scholarship';

export function evaluateScholarship(
  scholarship: Scholarship,
  answers: StudentAnswers
): MatchResult {
  const checks: RuleCheck[] = [];

  // 1. Domicile / Location Check
  if (scholarship.state === 'Gujarat') {
    if (answers.location === 'Gujarat') {
      checks.push({
        ruleId: 'location',
        label: 'Gujarat Domicile / Study',
        status: 'matched',
        detail: 'Studying in or domicile of Gujarat satisfies state requirement.',
      });
    } else {
      checks.push({
        ruleId: 'location',
        label: 'Gujarat Domicile / Study',
        status: 'unmatched',
        detail: 'This scheme is restricted to Gujarat domicile/enrolled students only.',
      });
    }
  } else {
    // All India
    checks.push({
      ruleId: 'location',
      label: 'Location / State Eligibility',
      status: 'matched',
      detail: 'Available to eligible students from all states across India.',
    });
  }

  // 2. Education Level Check
  if (scholarship.educationLevels.includes(answers.educationLevel)) {
    checks.push({
      ruleId: 'educationLevel',
      label: `${answers.educationLevel} Education Level`,
      status: 'matched',
      detail: `Your education level (${answers.educationLevel}) matches this scholarship.`,
    });
  } else {
    checks.push({
      ruleId: 'educationLevel',
      label: 'Education Level',
      status: 'unmatched',
      detail: `Requires ${scholarship.educationLevels.join(' or ')} education (your selected: ${answers.educationLevel}).`,
    });
  }

  // 3. Course / Stream Check
  if (scholarship.courses.includes('All')) {
    checks.push({
      ruleId: 'course',
      label: 'Course / Stream',
      status: 'matched',
      detail: 'Open to all course streams within eligible education levels.',
    });
  } else if (scholarship.courses.includes(answers.stream)) {
    checks.push({
      ruleId: 'course',
      label: 'Course / Stream',
      status: 'matched',
      detail: `Your stream (${answers.stream}) is directly covered.`,
    });
  } else if (answers.stream.toLowerCase().includes('other')) {
    checks.push({
      ruleId: 'course',
      label: 'Course / Stream',
      status: 'warning',
      detail: `Selected course stream requires verification against approved institution programs.`,
    });
  } else {
    checks.push({
      ruleId: 'course',
      label: 'Course / Stream',
      status: 'unmatched',
      detail: `Restricted to specified courses (e.g. ${scholarship.courses.slice(0, 2).join(', ')}). Your stream: ${answers.stream}.`,
    });
  }

  // 4. Year of Study Check
  if (scholarship.yearEligibility.includes('All')) {
    checks.push({
      ruleId: 'year',
      label: 'Academic Year',
      status: 'matched',
      detail: 'Eligible across all academic years.',
    });
  } else if (scholarship.yearEligibility.includes(answers.currentYear)) {
    checks.push({
      ruleId: 'year',
      label: 'Academic Year',
      status: 'matched',
      detail: `Your current year (${answers.currentYear}) matches the admission criteria.`,
    });
  } else if (answers.currentYear === 'Other') {
    checks.push({
      ruleId: 'year',
      label: 'Academic Year',
      status: 'warning',
      detail: `Non-standard study year requires institutional verification.`,
    });
  } else {
    checks.push({
      ruleId: 'year',
      label: 'Academic Year',
      status: 'unmatched',
      detail: `Only open for ${scholarship.yearEligibility.join(' / ')} students (your selected: ${answers.currentYear}).`,
    });
  }

  // 5. Social Category Check
  const categoriesList = scholarship.categories as string[];
  if (categoriesList.includes('All')) {
    checks.push({
      ruleId: 'category',
      label: 'Social Category',
      status: 'matched',
      detail: 'Open to all categories (General, SC, ST, SEBC/OBC, EWS).',
    });
  } else if (categoriesList.includes(answers.category)) {
    checks.push({
      ruleId: 'category',
      label: `${answers.category} Category`,
      status: 'matched',
      detail: `Category requirement met for ${answers.category}.`,
    });
  } else if (answers.category === 'Prefer not to say') {
    checks.push({
      ruleId: 'category',
      label: 'Social Category',
      status: 'warning',
      detail: `Category-specific scheme: certificate verification is required.`,
    });
  } else {
    checks.push({
      ruleId: 'category',
      label: 'Social Category',
      status: 'unmatched',
      detail: `Reserved for ${scholarship.categories.join(' / ')} students (your selected: ${answers.category}).`,
    });
  }

  // 6. Gender Check
  if (scholarship.genderEligibility === 'All') {
    checks.push({
      ruleId: 'gender',
      label: 'Gender Eligibility',
      status: 'matched',
      detail: 'Open to all genders.',
    });
  } else if (scholarship.genderEligibility === answers.gender) {
    checks.push({
      ruleId: 'gender',
      label: 'Gender Eligibility',
      status: 'matched',
      detail: `Gender criterion met (${answers.gender}).`,
    });
  } else if (answers.gender === 'Prefer not to say') {
    checks.push({
      ruleId: 'gender',
      label: 'Gender Eligibility',
      status: 'warning',
      detail: `Gender-specific scheme: eligibility depends on ${scholarship.genderEligibility} gender verification.`,
    });
  } else {
    checks.push({
      ruleId: 'gender',
      label: 'Gender Eligibility',
      status: 'unmatched',
      detail: `Scholarship is available only to ${scholarship.genderEligibility} students.`,
    });
  }

  // 7. Annual Family Income Check
  if (scholarship.incomeLimit === null) {
    checks.push({
      ruleId: 'income',
      label: 'Annual Family Income',
      status: 'matched',
      detail: 'No family income limit specified for this scheme.',
    });
  } else if (answers.annualIncome <= scholarship.incomeLimit) {
    checks.push({
      ruleId: 'income',
      label: 'Annual Family Income Limit',
      status: 'matched',
      detail: `Income satisfies requirement: ₹${answers.annualIncome.toLocaleString('en-IN')} is within ₹${scholarship.incomeLimit.toLocaleString('en-IN')}.`,
    });
  } else {
    checks.push({
      ruleId: 'income',
      label: 'Annual Family Income Limit',
      status: 'unmatched',
      detail: `Income of ₹${answers.annualIncome.toLocaleString('en-IN')} exceeds maximum limit of ₹${scholarship.incomeLimit.toLocaleString('en-IN')}.`,
    });
  }

  // 8. Academic Percentage Check
  if (scholarship.minimumPercentage === null) {
    checks.push({
      ruleId: 'percentage',
      label: 'Academic Percentage',
      status: 'matched',
      detail: 'General passing marks required; no strict percentage cutoff specified.',
    });
  } else if (answers.academicPercentage >= scholarship.minimumPercentage) {
    checks.push({
      ruleId: 'percentage',
      label: 'Academic Percentage',
      status: 'matched',
      detail: `Academic score satisfied: ${answers.academicPercentage}% is above required minimum ${scholarship.minimumPercentage}%.`,
    });
  } else {
    checks.push({
      ruleId: 'percentage',
      label: 'Academic Percentage',
      status: 'unmatched',
      detail: `Score of ${answers.academicPercentage}% is below minimum required ${scholarship.minimumPercentage}%.`,
    });
  }

  // 9. Special Eligibility Conditions
  if (scholarship.specialConditions?.disabilityRequired) {
    if (answers.isDisability) {
      const minPercent = scholarship.specialConditions.minDisabilityPercentage || 40;
      const studentPercent = answers.disabilityPercentage ?? 40;
      if (studentPercent >= minPercent) {
        checks.push({
          ruleId: 'disability',
          label: 'Disability Criterion (Divyangjan)',
          status: 'matched',
          detail: `UDID / Disability certificate requirement met (${studentPercent}% >= ${minPercent}%).`,
        });
      } else {
        checks.push({
          ruleId: 'disability',
          label: 'Disability Criterion',
          status: 'unmatched',
          detail: `Disability percentage (${studentPercent}%) is below required ${minPercent}%.`,
        });
      }
    } else {
      checks.push({
        ruleId: 'disability',
        label: 'Disability Criterion',
        status: 'unmatched',
        detail: 'Dedicated scheme for differently-abled students with valid disability certificate.',
      });
    }
  }

  if (scholarship.specialConditions?.orphanRequired || scholarship.specialConditions?.defenceWardRequired) {
    if (answers.isOrphan || answers.isDefenceWard) {
      checks.push({
        ruleId: 'specialCircumstance',
        label: 'Special Category Criterion',
        status: 'matched',
        detail: answers.isOrphan
          ? 'Orphan status verified as an eligible candidate.'
          : 'Ward of Armed Forces/CAPF personnel verified as eligible.',
      });
    } else {
      checks.push({
        ruleId: 'specialCircumstance',
        label: 'Special Category Criterion',
        status: 'unmatched',
        detail: 'Restricted to orphan students or wards of Armed Forces / CAPF personnel.',
      });
    }
  }

  if (scholarship.specialConditions?.minorityRequired) {
    if (answers.isMinority) {
      checks.push({
        ruleId: 'minority',
        label: 'Minority Community',
        status: 'matched',
        detail: 'Belongs to recognized minority community.',
      });
    } else {
      checks.push({
        ruleId: 'minority',
        label: 'Minority Community',
        status: 'unmatched',
        detail: 'Restricted to students belonging to recognized minority communities.',
      });
    }
  }

  if (scholarship.specialConditions?.requiresVerification) {
    checks.push({
      ruleId: 'verification',
      label: 'Special Condition Verification',
      status: 'warning',
      detail:
        scholarship.specialConditions.verificationNote ||
        'Additional institutional or board-ranking condition requires verification.',
    });
  }

  // Determine overall status
  const hasUnmatched = checks.some((c) => c.status === 'unmatched');
  const hasWarning = checks.some((c) => c.status === 'warning');

  let status: MatchStatus;
  let summaryMessage: string;

  if (hasUnmatched) {
    status = 'not_eligible';
    const firstUnmatched = checks.find((c) => c.status === 'unmatched');
    summaryMessage = firstUnmatched ? firstUnmatched.detail : 'One or more known eligibility criteria are not satisfied.';
  } else if (hasWarning) {
    status = 'possible_match';
    summaryMessage = 'You appear to meet major criteria, but one or more conditions require institutional or documentary verification.';
  } else {
    status = 'strong_match';
    summaryMessage = 'All known hard requirements are satisfied based on the information provided.';
  }

  return {
    scholarshipId: scholarship.id,
    scholarship,
    status,
    checks,
    summaryMessage,
  };
}

export function evaluateAllScholarships(
  scholarships: Scholarship[],
  answers: StudentAnswers
): MatchResult[] {
  return scholarships.map((s) => evaluateScholarship(s, answers));
}
