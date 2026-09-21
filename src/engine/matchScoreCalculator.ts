import type { ScholarshipEligibilityResult, EligibilityRule } from '../types/eligibility';
import type { Scholarship } from '../types/scholarship';

export interface MatchScoreResult {
  score: number | null;
  evaluatedCount: number;
  passedCount: number;
  failedCount: number;
  unknownCount: number;
  totalRulesCount: number;
  status: 'eligible' | 'possible' | 'not_eligible' | 'unavailable';
  hasHardRequirementFailure: boolean;
  summaryText: string;
  unknownCriteriaMessage?: string;
}

/**
 * Calculates the Edvora Match Score and supporting breakdown strictly
 * from the evaluated ScholarshipEligibilityResult.
 *
 * Formula:
 *   Score = (passedRules / (passedRules + failedRules)) * 100
 * Unknown rules are never counted as passed or evaluated.
 */
export function calculateMatchScore(
  result?: ScholarshipEligibilityResult | null,
  _scholarship?: Scholarship
): MatchScoreResult {
  if (!result) {
    return {
      score: null,
      evaluatedCount: 0,
      passedCount: 0,
      failedCount: 0,
      unknownCount: 0,
      totalRulesCount: 0,
      status: 'unavailable',
      hasHardRequirementFailure: false,
      summaryText: 'Match score unavailable because structured eligibility criteria are not available for this scholarship.',
    };
  }

  const passedRules = result.passedRules || [];
  const failedRules = result.failedRules || [];
  const unknownRules = result.unknownRules || [];

  const passedCount = passedRules.length;
  const failedCount = failedRules.length;
  const unknownCount = unknownRules.length;
  const totalRulesCount = passedCount + failedCount + unknownCount;
  const evaluatedCount = passedCount + failedCount;

  // Check if no rules exist
  if (totalRulesCount === 0) {
    return {
      score: null,
      evaluatedCount: 0,
      passedCount: 0,
      failedCount: 0,
      unknownCount: 0,
      totalRulesCount: 0,
      status: 'unavailable',
      hasHardRequirementFailure: false,
      summaryText: 'Match score unavailable because structured eligibility criteria are not available for this scholarship.',
    };
  }

  // Check for any hard requirement failures
  const hasHardRequirementFailure = failedRules.some(
    (rule: EligibilityRule) => rule.hardRequirement !== false
  );

  // If all rules are unknown, we cannot evaluate a match percentage yet
  if (evaluatedCount === 0 && unknownCount > 0) {
    return {
      score: null,
      evaluatedCount: 0,
      passedCount: 0,
      failedCount: 0,
      unknownCount,
      totalRulesCount,
      status: 'possible',
      hasHardRequirementFailure: false,
      summaryText: 'More information needed to determine your match.',
      unknownCriteriaMessage: `${unknownCount} ${unknownCount === 1 ? 'criterion is' : 'criteria are'} still unknown.`,
    };
  }

  // Calculate percentage based on evaluated rules
  const rawScore = (passedCount / evaluatedCount) * 100;
  const score = Math.round(rawScore);

  // Determine status (authoritative from eligibility result, respecting hard requirements)
  let status: 'eligible' | 'possible' | 'not_eligible' = result.status;
  if (hasHardRequirementFailure) {
    status = 'not_eligible';
  } else if (unknownCount > 0 && failedCount === 0) {
    status = 'possible';
  } else if (failedCount === 0 && unknownCount === 0) {
    status = 'eligible';
  }

  let summaryText = '';
  if (status === 'eligible') {
    summaryText = 'Your current profile satisfies all known eligibility requirements.';
  } else if (status === 'not_eligible') {
    if (result.explanation) {
      summaryText = result.explanation;
    } else {
      summaryText = `${failedCount} required ${failedCount === 1 ? 'criterion is' : 'criteria are'} not satisfied.`;
    }
  } else {
    // Possible
    summaryText = `${passedCount} of ${evaluatedCount} evaluated ${evaluatedCount === 1 ? 'criterion matches' : 'criteria match'}. ${unknownCount} ${unknownCount === 1 ? 'criterion still needs' : 'criteria still need'} information.`;
  }

  let unknownCriteriaMessage: string | undefined;
  if (unknownCount > 0) {
    unknownCriteriaMessage = `${unknownCount} ${unknownCount === 1 ? 'criterion is' : 'criteria are'} still unknown.`;
  }

  return {
    score,
    evaluatedCount,
    passedCount,
    failedCount,
    unknownCount,
    totalRulesCount,
    status,
    hasHardRequirementFailure,
    summaryText,
    unknownCriteriaMessage,
  };
}
