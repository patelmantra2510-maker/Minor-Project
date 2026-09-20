import type {
  EligibilityRule,
  RuleEvaluationResult,
  RuleGroup,
} from '../types/eligibility';
import type { StudentProfile } from '../types/studentProfile';

/**
 * Normalizes values for comparison (handles strings, numbers, booleans).
 */
function normalizeValue(val: unknown): unknown {
  if (typeof val === 'string') {
    return val.trim().toLowerCase();
  }
  return val;
}

/**
 * Evaluates an individual eligibility rule against a student profile.
 */
export function evaluateRule(
  rule: EligibilityRule,
  profile: StudentProfile
): RuleEvaluationResult {
  const studentField = profile.fields[rule.fieldId];

  // If field is missing or status indicates unsupplied information
  if (
    !studentField ||
    studentField.value === null ||
    studentField.value === undefined ||
    studentField.status === 'unknown' ||
    studentField.status === 'prefer_not_to_say' ||
    studentField.status === 'not_applicable'
  ) {
    return {
      ruleId: rule.id,
      status: 'unknown',
      reason: `Field '${rule.fieldId}' is unknown or not provided.`,
    };
  }

  const rawActual = studentField.value;
  const rawTarget = rule.value;
  const operator = rule.operator;

  try {
    switch (operator) {
      case 'equals': {
        const actual = normalizeValue(rawActual);
        const target = normalizeValue(rawTarget);
        const matches = actual === target;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value matches required '${String(rawTarget)}'.`
            : `Expected '${String(rawTarget)}', but found '${String(rawActual)}'.`,
        };
      }

      case 'not_equals': {
        const actual = normalizeValue(rawActual);
        const target = normalizeValue(rawTarget);
        const matches = actual !== target;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value is not equal to '${String(rawTarget)}'.`
            : `Value unexpectedly matches '${String(rawTarget)}'.`,
        };
      }

      case 'greater_than': {
        const numActual = Number(rawActual);
        const numTarget = Number(rawTarget);
        if (isNaN(numActual) || isNaN(numTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: `Non-numeric comparison between '${String(rawActual)}' and '${String(rawTarget)}'.`,
          };
        }
        const matches = numActual > numTarget;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value ${numActual} is greater than ${numTarget}.`
            : `Value ${numActual} is not greater than ${numTarget}.`,
        };
      }

      case 'greater_than_or_equal': {
        const numActual = Number(rawActual);
        const numTarget = Number(rawTarget);
        if (isNaN(numActual) || isNaN(numTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: `Non-numeric comparison between '${String(rawActual)}' and '${String(rawTarget)}'.`,
          };
        }
        const matches = numActual >= numTarget;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value ${numActual} meets minimum requirement of ${numTarget}.`
            : `Value ${numActual} is below minimum requirement of ${numTarget}.`,
        };
      }

      case 'less_than': {
        const numActual = Number(rawActual);
        const numTarget = Number(rawTarget);
        if (isNaN(numActual) || isNaN(numTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: `Non-numeric comparison between '${String(rawActual)}' and '${String(rawTarget)}'.`,
          };
        }
        const matches = numActual < numTarget;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value ${numActual} is strictly below limit of ${numTarget}.`
            : `Value ${numActual} is not strictly below limit of ${numTarget}.`,
        };
      }

      case 'less_than_or_equal': {
        const numActual = Number(rawActual);
        const numTarget = Number(rawTarget);
        if (isNaN(numActual) || isNaN(numTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: `Non-numeric comparison between '${String(rawActual)}' and '${String(rawTarget)}'.`,
          };
        }
        const matches = numActual <= numTarget;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value ${numActual} is within maximum ceiling of ${numTarget}.`
            : `Value ${numActual} exceeds maximum ceiling of ${numTarget}.`,
        };
      }

      case 'between': {
        if (!Array.isArray(rawTarget) || rawTarget.length < 2) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: 'Rule target for between must be a [min, max] array.',
          };
        }
        const numActual = Number(rawActual);
        const [min, max] = rawTarget.map(Number);
        if (isNaN(numActual) || isNaN(min) || isNaN(max)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: 'Non-numeric values in between operator evaluation.',
          };
        }
        const matches = numActual >= min && numActual <= max;
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value ${numActual} is within [${min}, ${max}].`
            : `Value ${numActual} is outside [${min}, ${max}].`,
        };
      }

      case 'in': {
        if (!Array.isArray(rawTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: 'Target value for in operator must be an array.',
          };
        }
        const targetList = rawTarget.map(normalizeValue);
        if (Array.isArray(rawActual)) {
          const actualList = rawActual.map(normalizeValue);
          const hasAny = actualList.some((item) => targetList.includes(item));
          return {
            ruleId: rule.id,
            status: hasAny ? 'passed' : 'failed',
            reason: hasAny
              ? `Matches allowed options.`
              : `None of [${rawActual.join(', ')}] are in allowed list.`,
          };
        }
        const actual = normalizeValue(rawActual);
        const matches = targetList.includes(actual);
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value matches allowed options.`
            : `Value '${String(rawActual)}' is not in allowed list.`,
        };
      }

      case 'not_in': {
        if (!Array.isArray(rawTarget)) {
          return {
            ruleId: rule.id,
            status: 'unknown',
            reason: 'Target value for not_in operator must be an array.',
          };
        }
        const targetList = rawTarget.map(normalizeValue);
        if (Array.isArray(rawActual)) {
          const actualList = rawActual.map(normalizeValue);
          const hasAny = actualList.some((item) => targetList.includes(item));
          return {
            ruleId: rule.id,
            status: !hasAny ? 'passed' : 'failed',
            reason: !hasAny
              ? `Value is not in excluded options.`
              : `Value overlaps with excluded options.`,
          };
        }
        const actual = normalizeValue(rawActual);
        const matches = !targetList.includes(actual);
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `Value is not in excluded list.`
            : `Value '${String(rawActual)}' is in excluded list.`,
        };
      }

      case 'contains': {
        if (Array.isArray(rawActual)) {
          const target = normalizeValue(rawTarget);
          const matches = rawActual.map(normalizeValue).includes(target);
          return {
            ruleId: rule.id,
            status: matches ? 'passed' : 'failed',
            reason: matches
              ? `List contains '${String(rawTarget)}'.`
              : `List does not contain '${String(rawTarget)}'.`,
          };
        }
        const strActual = String(rawActual).toLowerCase();
        const strTarget = String(rawTarget).toLowerCase();
        const matches = strActual.includes(strTarget);
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `'${String(rawActual)}' contains '${String(rawTarget)}'.`
            : `'${String(rawActual)}' does not contain '${String(rawTarget)}'.`,
        };
      }

      case 'not_contains': {
        if (Array.isArray(rawActual)) {
          const target = normalizeValue(rawTarget);
          const matches = !rawActual.map(normalizeValue).includes(target);
          return {
            ruleId: rule.id,
            status: matches ? 'passed' : 'failed',
            reason: matches
              ? `List does not contain '${String(rawTarget)}'.`
              : `List unexpectedly contains '${String(rawTarget)}'.`,
          };
        }
        const strActual = String(rawActual).toLowerCase();
        const strTarget = String(rawTarget).toLowerCase();
        const matches = !strActual.includes(strTarget);
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `'${String(rawActual)}' does not contain '${String(rawTarget)}'.`
            : `'${String(rawActual)}' unexpectedly contains '${String(rawTarget)}'.`,
        };
      }

      case 'starts_with': {
        const strActual = String(rawActual).toLowerCase();
        const strTarget = String(rawTarget).toLowerCase();
        const matches = strActual.startsWith(strTarget);
        return {
          ruleId: rule.id,
          status: matches ? 'passed' : 'failed',
          reason: matches
            ? `'${String(rawActual)}' starts with '${String(rawTarget)}'.`
            : `'${String(rawActual)}' does not start with '${String(rawTarget)}'.`,
        };
      }

      case 'is_true': {
        const boolVal = rawActual === true || rawActual === 'true' || rawActual === 1;
        return {
          ruleId: rule.id,
          status: boolVal ? 'passed' : 'failed',
          reason: boolVal ? 'Requirement verified.' : 'Requirement not satisfied (expected true).',
        };
      }

      case 'is_false': {
        const boolVal = rawActual === false || rawActual === 'false' || rawActual === 0;
        return {
          ruleId: rule.id,
          status: boolVal ? 'passed' : 'failed',
          reason: boolVal ? 'Requirement verified.' : 'Requirement not satisfied (expected false).',
        };
      }

      default:
        return {
          ruleId: rule.id,
          status: 'unknown',
          reason: `Unsupported rule operator '${operator}'.`,
        };
    }
  } catch (err) {
    return {
      ruleId: rule.id,
      status: 'unknown',
      reason: `Error during rule evaluation: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export interface RuleGroupEvaluationResult {
  status: 'passed' | 'failed' | 'unknown';
  ruleResults: RuleEvaluationResult[];
}

/**
 * Recursively evaluates a RuleGroup (AND / OR) with nested groups support
 * while maintaining strict uncertainty semantics:
 * - AND:
 *   - Any 'failed' => 'failed'
 *   - Otherwise any 'unknown' => 'unknown'
 *   - All 'passed' => 'passed'
 * - OR:
 *   - Any 'passed' => 'passed'
 *   - Otherwise any 'unknown' => 'unknown'
 *   - All 'failed' => 'failed'
 */
export function evaluateRuleGroup(
  group: RuleGroup,
  profile: StudentProfile
): RuleGroupEvaluationResult {
  const allResults: RuleEvaluationResult[] = [];
  const childStatuses: ('passed' | 'failed' | 'unknown')[] = [];

  // Evaluate direct rules
  if (group.rules && group.rules.length > 0) {
    for (const rule of group.rules) {
      const res = evaluateRule(rule, profile);
      allResults.push(res);
      childStatuses.push(res.status);
    }
  }

  // Evaluate nested child groups
  if (group.groups && group.groups.length > 0) {
    for (const nestedGroup of group.groups) {
      const nestedResult = evaluateRuleGroup(nestedGroup, profile);
      allResults.push(...nestedResult.ruleResults);
      childStatuses.push(nestedResult.status);
    }
  }

  // If group is empty, default to passed
  if (childStatuses.length === 0) {
    return {
      status: 'passed',
      ruleResults: allResults,
    };
  }

  if (group.operator === 'AND') {
    if (childStatuses.includes('failed')) {
      return { status: 'failed', ruleResults: allResults };
    }
    if (childStatuses.includes('unknown')) {
      return { status: 'unknown', ruleResults: allResults };
    }
    return { status: 'passed', ruleResults: allResults };
  } else {
    // group.operator === 'OR'
    if (childStatuses.includes('passed')) {
      return { status: 'passed', ruleResults: allResults };
    }
    if (childStatuses.includes('unknown')) {
      return { status: 'unknown', ruleResults: allResults };
    }
    return { status: 'failed', ruleResults: allResults };
  }
}
