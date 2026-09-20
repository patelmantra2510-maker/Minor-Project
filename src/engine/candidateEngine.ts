import type { Scholarship } from '../types/scholarship';
import type { StudentProfile } from '../types/studentProfile';
import { evaluateRule, evaluateRuleGroup } from './ruleEvaluator';

/**
 * Determines whether a scholarship is still a candidate for the student.
 * Key Principle: Missing or unknown information does NOT eliminate a scholarship.
 * Only definite failures on hard requirements disqualify the candidate.
 */
export function isScholarshipCandidate(
  scholarship: Scholarship,
  profile: StudentProfile
): boolean {
  // If the scholarship defines modern structured eligibility
  if (scholarship.eligibility) {
    // 1. Direct hard requirement rule checks
    const checkHardFailures = (rules: typeof scholarship.eligibility.rules): boolean => {
      if (rules.rules) {
        for (const rule of rules.rules) {
          if (rule.hardRequirement) {
            const result = evaluateRule(rule, profile);
            if (result.status === 'failed') {
              return true; // Disqualified
            }
          }
        }
      }
      if (rules.groups) {
        for (const subGroup of rules.groups) {
          if (checkHardFailures(subGroup)) {
            return true;
          }
        }
      }
      return false;
    };

    if (checkHardFailures(scholarship.eligibility.rules)) {
      return false;
    }

    // 2. Evaluate rule group structure
    const groupEval = evaluateRuleGroup(scholarship.eligibility.rules, profile);
    // If the entire group evaluates to failed (meaning all OR branches failed or an AND failed),
    // it is disqualified. If it is 'passed' or 'unknown', it remains a candidate.
    if (groupEval.status === 'failed') {
      return false;
    }

    return true;
  }

  // Fallback / legacy criteria check with soft unknown semantics:
  // Only disqualify if a KNOWN profile field strictly contradicts scholarship criteria.
  const fields = profile.fields;

  // Education Level Check
  const eduField = fields['field_education_level'];
  if (eduField && eduField.status === 'known' && eduField.value) {
    const studentEdu = String(eduField.value).toLowerCase();
    const matchesEdu = scholarship.educationLevels.some(
      (lvl) => lvl.toLowerCase() === studentEdu || studentEdu.includes(lvl.toLowerCase())
    );
    if (!matchesEdu) return false;
  }

  // Gender Check
  const genderField = fields['field_gender'];
  if (genderField && genderField.status === 'known' && genderField.value) {
    const studentGender = String(genderField.value).toLowerCase();
    if (scholarship.genderEligibility !== 'All') {
      if (scholarship.genderEligibility.toLowerCase() !== studentGender) {
        return false;
      }
    }
  }

  // State / Domicile Check
  const stateField = fields['field_domicile_state'] || fields['field_current_state'];
  if (stateField && stateField.status === 'known' && stateField.value) {
    const studentState = String(stateField.value).toLowerCase();
    if (scholarship.state === 'Gujarat' && studentState !== 'gujarat') {
      return false;
    }
  }

  // Family Income Check
  const incomeField = fields['field_family_income'];
  if (incomeField && incomeField.status === 'known' && incomeField.value !== null) {
    const studentIncome = Number(incomeField.value);
    if (!isNaN(studentIncome) && scholarship.incomeLimit !== null) {
      if (studentIncome > scholarship.incomeLimit) {
        return false;
      }
    }
  }

  // Minimum Academic Percentage Check
  const scoreField = fields['field_latest_score'] || fields['field_class_12_percentage'];
  if (scoreField && scoreField.status === 'known' && scoreField.value !== null) {
    const studentScore = Number(scoreField.value);
    if (!isNaN(studentScore) && scholarship.minimumPercentage !== null) {
      if (studentScore < scholarship.minimumPercentage) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Filter a list of scholarships down to those that are still viable candidates.
 */
export function getCandidateScholarships(
  scholarships: Scholarship[],
  profile: StudentProfile
): Scholarship[] {
  return scholarships.filter((scholarship) => isScholarshipCandidate(scholarship, profile));
}
