import { describe, it, expect } from 'vitest';
import { en } from '../../../data/translations/en';
import { hi } from '../../../data/translations/hi';
import { gu } from '../../../data/translations/gu';
import { fieldById } from '../../../data/eligibility/fields';
import { calculateProfileCompletion } from '../../../engine/profileCompletion';
import type { StudentProfile } from '../../../types/studentProfile';

describe('Profile System Integrity & Translations Parity', () => {
  it('ensures en, hi, and gu all have the profile dictionary and nav keys', () => {
    expect(en.nav.myProfile).toBe('My Profile');
    expect(hi.nav.myProfile).toBe('मेरी प्रोफ़ाइल');
    expect(gu.nav.myProfile).toBe('મારી પ્રોફાઇલ');

    expect(en.profile).toBeDefined();
    expect(hi.profile).toBeDefined();
    expect(gu.profile).toBeDefined();

    expect(en.profile.buildProfileTitle).toBeDefined();
    expect(hi.profile.buildProfileTitle).toBeDefined();
    expect(gu.profile.buildProfileTitle).toBeDefined();

    expect(en.profile.welcomeBack).toBeDefined();
    expect(hi.profile.welcomeBack).toBeDefined();
    expect(gu.profile.welcomeBack).toBeDefined();
  });

  it('ensures all 9 universal sections are translated across all 3 languages', () => {
    const requiredSections = [
      'aboutYou',
      'location',
      'education',
      'academic',
      'categoryFinancial',
      'residence',
      'specialCircumstances',
      'achievements',
      'documents',
    ];

    for (const sec of requiredSections) {
      expect((en.profile.sections as any)[sec]).toBeDefined();
      expect((hi.profile.sections as any)[sec]).toBeDefined();
      expect((gu.profile.sections as any)[sec]).toBeDefined();
    }
  });

  it('verifies that universal field IDs used in profile sections exist in fieldById', () => {
    const sectionFieldIds = [
      // About
      'field_age',
      'field_gender',
      'field_nationality',
      // Location
      'field_domicile_state',
      'field_current_state',
      'field_rural_urban',
      // Education
      'field_education_level',
      'field_stream',
      'field_program',
      'field_academic_year',
      'field_institution_type',
      // Academic
      'field_latest_score',
      'field_class_12_percentage',
      'field_previous_qualification',
      'field_board',
      'field_percentile',
      // Financial
      'field_category',
      'field_family_income',
      'field_minority_status',
      'field_income_range',
      'field_income_certificate_status',
      // Residence
      'field_accommodation_type',
      'field_is_hosteller',
      'field_hostel_type',
      // Special
      'field_has_disability',
      'field_disability_percentage',
      'field_is_orphan',
      'field_is_defence_dependent',
      'field_is_farmer_family',
      'field_is_first_generation_student',
      // Achievements
      'field_has_academic_achievement',
      'field_sports_achievement',
      'field_research_experience',
      // Documents
      'field_has_income_certificate',
      'field_has_caste_certificate',
      'field_has_domicile_certificate',
      'field_has_institution_certificate',
    ];

    for (const fid of sectionFieldIds) {
      expect(fieldById[fid]).toBeDefined();
      expect(fieldById[fid].id).toBe(fid);
    }
  });

  it('verifies profile readiness calculation accurately updates when sections are populated', () => {
    const emptyProfile: StudentProfile = {
      id: 'test_empty',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      fields: {},
      preferences: { language: 'en', theme: 'light' },
    };

    const emptyCompletion = calculateProfileCompletion(emptyProfile);
    expect(emptyCompletion.percentage).toBe(0);
    expect(emptyCompletion.knownFields).toBe(0);

    const partialProfile: StudentProfile = {
      ...emptyProfile,
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
        field_stream: {
          value: 'engineering_technology',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
        field_domicile_state: {
          value: 'gujarat',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
        field_gender: {
          value: 'female',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
        field_family_income: {
          value: 250000,
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
      },
    };

    const partialCompletion = calculateProfileCompletion(partialProfile);
    expect(partialCompletion.percentage).toBeGreaterThanOrEqual(50);
    expect(partialCompletion.knownFields).toBe(5);
  });
});
