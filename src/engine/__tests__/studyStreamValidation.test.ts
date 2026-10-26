import { describe, it, expect } from 'vitest';
import { getField, validateFieldValue } from '../fieldRegistry';
import {
  STREAMS_BY_EDUCATION,
  ALL_CANONICAL_STREAMS,
  LEGACY_STREAM_OPTIONS,
  isKnownStudyStream,
  normalizeStudyStream,
  isStreamEligibleForScholarship,
} from '../../data/streams';
import { evaluateScholarship } from '../eligibilityEngine';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import type { StudentAnswers } from '../../types/scholarship';

describe('Study Stream Validation & Normalization Architecture', () => {
  const streamField = getField('field_stream')!;

  it('field_stream definition exists with label "Study Stream" and data type "single_select"', () => {
    expect(streamField).toBeDefined();
    expect(streamField.label).toBe('Study Stream');
    expect(streamField.dataType).toBe('single_select');
    expect(streamField.options).toBeDefined();
    expect(streamField.options!.length).toBeGreaterThan(30);
    expect(ALL_CANONICAL_STREAMS.length).toBeGreaterThan(30);
    expect(isKnownStudyStream('Computer Engineering / IT')).toBe(true);
    expect(isKnownStudyStream('engineering_technology')).toBe(true);
    expect(isKnownStudyStream('invalid_stream')).toBe(false);
  });

  describe('Validation of All Supported Education-Level Streams', () => {
    it('accepts all Diploma streams without error (including Computer Engineering / IT)', () => {
      const diplomaStreams = STREAMS_BY_EDUCATION['Diploma'];
      expect(diplomaStreams).toContain('Computer Engineering / IT');
      expect(diplomaStreams).toContain('Mechanical Engineering');
      expect(diplomaStreams).toContain('Civil Engineering');
      expect(diplomaStreams).toContain('Electrical Engineering');

      for (const stream of diplomaStreams) {
        const res = validateFieldValue(streamField, stream);
        expect(res.valid).toBe(true);
        expect(res.error).toBeUndefined();
      }
    });

    it('accepts all Undergraduate streams without error', () => {
      const ugStreams = STREAMS_BY_EDUCATION['Undergraduate'];
      expect(ugStreams).toContain('Engineering & Technology (B.E. / B.Tech)');
      expect(ugStreams).toContain('Medical & Dental (MBBS / BDS / BAMS / BHMS)');
      expect(ugStreams).toContain('Commerce & Management (B.Com / BBA)');
      expect(ugStreams).toContain('Arts & Humanities (B.A.)');

      for (const stream of ugStreams) {
        const res = validateFieldValue(streamField, stream);
        expect(res.valid).toBe(true);
        expect(res.error).toBeUndefined();
      }
    });

    it('accepts all School, ITI, Postgraduate, and PhD streams without error', () => {
      const otherLevels = ['School', 'ITI', 'Postgraduate', 'PhD', 'Other'] as const;
      for (const level of otherLevels) {
        for (const stream of STREAMS_BY_EDUCATION[level]) {
          const res = validateFieldValue(streamField, stream);
          expect(res.valid).toBe(true);
          expect(res.error).toBeUndefined();
        }
      }
    });

    it('accepts legacy snake_case IDs and category-level options safely', () => {
      for (const legacy of LEGACY_STREAM_OPTIONS) {
        const res = validateFieldValue(streamField, legacy.value);
        expect(res.valid).toBe(true);
        expect(res.error).toBeUndefined();
      }
    });

    it('accepts case-insensitive variations and aliases', () => {
      expect(validateFieldValue(streamField, 'computer engineering / it').valid).toBe(true);
      expect(validateFieldValue(streamField, 'MECHANICAL ENGINEERING').valid).toBe(true);
      expect(validateFieldValue(streamField, 'engineering').valid).toBe(true);
      expect(validateFieldValue(streamField, 'commerce').valid).toBe(true);
    });

    it('strictly rejects invalid or fabricated options with proper error message', () => {
      const invalidRes = validateFieldValue(streamField, 'Invalid Random Stream 123');
      expect(invalidRes.valid).toBe(false);
      expect(invalidRes.error).toBe("Invalid option 'Invalid Random Stream 123' for Study Stream.");

      const bogusRes = validateFieldValue(streamField, 'Quantum Astrology');
      expect(bogusRes.valid).toBe(false);
      expect(bogusRes.error).toBe("Invalid option 'Quantum Astrology' for Study Stream.");
    });
  });

  describe('Dynamic Options Validation (AdaptiveQuestionnaire Integration)', () => {
    it('validates against dynamic options provided by questionnaire when stream is diploma', () => {
      const dynamicOptions = STREAMS_BY_EDUCATION['Diploma'].map((st) => ({
        value: st,
        label: st,
      }));

      // Directly selected Diploma option
      const res = validateFieldValue(streamField, 'Computer Engineering / IT', dynamicOptions);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();

      // Another Diploma option
      const resCivil = validateFieldValue(streamField, 'Civil Engineering', dynamicOptions);
      expect(resCivil.valid).toBe(true);
      expect(resCivil.error).toBeUndefined();

      // Completely invalid stream
      const resBad = validateFieldValue(streamField, 'Random Nonexistent Stream', dynamicOptions);
      expect(resBad.valid).toBe(false);
      expect(resBad.error).toBe("Invalid option 'Random Nonexistent Stream' for Study Stream.");
    });
  });

  describe('Legacy and Canonical Normalization', () => {
    it('normalizes legacy IDs to human-readable canonical labels', () => {
      expect(normalizeStudyStream('engineering_technology')).toBe('Engineering & Technology');
      expect(normalizeStudyStream('engineering')).toBe('Engineering & Technology');
      expect(normalizeStudyStream('medical')).toBe('Medical & Dental (MBBS / BDS / BAMS / BHMS)');
      expect(normalizeStudyStream('computer engineering')).toBe('Computer Engineering / IT');
    });

    it('preserves exact canonical streams with proper casing', () => {
      expect(normalizeStudyStream('computer engineering / it')).toBe('Computer Engineering / IT');
      expect(normalizeStudyStream('Computer Engineering / IT')).toBe('Computer Engineering / IT');
      expect(normalizeStudyStream('Mechanical Engineering')).toBe('Mechanical Engineering');
      expect(normalizeStudyStream('Commerce')).toBe('Commerce');
    });
  });

  describe('Scholarship Eligibility Engine Stream Matching', () => {
    const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat')!;
    const inspire = SCHOLARSHIPS_DATA.find((s) => s.id === 'inspire-she-dst')!;
    const allCoursesScholarship = SCHOLARSHIPS_DATA.find((s) => s.id === 'digital-gujarat-sc-postmatric')!;

    it('matches Computer Engineering / IT directly for MYSY', () => {
      const evalMatch = isStreamEligibleForScholarship(mysy.courses, 'Computer Engineering / IT');
      expect(evalMatch.status).toBe('matched');
      expect(evalMatch.detail).toContain('Computer Engineering / IT');
    });

    it('matches Mechanical Engineering directly for MYSY', () => {
      const evalMatch = isStreamEligibleForScholarship(mysy.courses, 'Mechanical Engineering');
      expect(evalMatch.status).toBe('matched');
    });

    it('matches legacy "engineering_technology" for MYSY via category alignment', () => {
      const evalMatch = isStreamEligibleForScholarship(mysy.courses, 'engineering_technology');
      expect(evalMatch.status).toBe('matched');
    });

    it('matches any stream for scholarships open to All courses', () => {
      expect(isStreamEligibleForScholarship(allCoursesScholarship.courses, 'Computer Engineering / IT').status).toBe('matched');
      expect(isStreamEligibleForScholarship(allCoursesScholarship.courses, 'Commerce').status).toBe('matched');
      expect(isStreamEligibleForScholarship(allCoursesScholarship.courses, 'Electrician').status).toBe('matched');
    });

    it('flags Other stream with a warning requiring institutional verification', () => {
      const evalOther = isStreamEligibleForScholarship(mysy.courses, 'Other Diploma Stream');
      // Contains 'Other'
      expect(evalOther.status).toBe('matched'); // Since 'Other Diploma Stream' is in mysy.courses explicitly

      const evalGenericOther = isStreamEligibleForScholarship(inspire.courses, 'Other');
      expect(evalGenericOther.status).toBe('warning');
    });

    it('rejects incompatible streams for specialized scholarships (e.g. Commerce for DST INSPIRE Sciences)', () => {
      const evalIncompatible = isStreamEligibleForScholarship(inspire.courses, 'Commerce');
      expect(evalIncompatible.status).toBe('unmatched');
      expect(evalIncompatible.detail).toContain('Restricted to specified courses');
    });

    it('completes end-to-end evaluateScholarship successfully with Computer Engineering / IT', () => {
      const answers: StudentAnswers = {
        location: 'Gujarat',
        educationLevel: 'Diploma',
        stream: 'Computer Engineering / IT',
        currentYear: '1st Year',
        category: 'General',
        gender: 'Male',
        annualIncome: 200000,
        academicPercentage: 85,
        isDisability: false,
        isOrphan: false,
        isDefenceWard: false,
        isMinority: false,
      };

      const result = evaluateScholarship(mysy, answers);
      const courseCheck = result.checks.find((c) => c.ruleId === 'course');
      expect(courseCheck).toBeDefined();
      expect(courseCheck?.status).toBe('matched');
      expect(result.status).toBe('strong_match');
    });
  });
});
