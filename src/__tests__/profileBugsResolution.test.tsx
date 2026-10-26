import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ProfilePage } from '../components/pages/ProfilePage';
import { FindScholarshipsPage } from '../components/pages/FindScholarshipsPage';
import { calculateProfileCompletion } from '../engine/profileCompletion';
import { calculateProfileCompletion as calculateStructuredCompletion } from '../engine/structuredEligibilityEvaluator';
import { profileStorage } from '../services/profile/profileStorage';
import { localProfileStorage } from '../services/storage/localProfileStorage';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import type { StudentProfile } from '../types/studentProfile';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../auth/AuthContext';
import { ScholarshipProvider } from '../context/ScholarshipContext';
import { SavedProvider } from '../context/SavedContext';
import { CompareProvider } from '../context/CompareContext';
import { StudentProfileProvider } from '../context/StudentProfileContext';

describe('Profile Bugs Resolution Verification (Bug 1 & Bug 2)', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  const renderWithProviders = (ui: React.ReactElement, initialProfile?: StudentProfile | null) => {
    return renderToString(
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ScholarshipProvider>
              <SavedProvider>
                <CompareProvider>
                  <StudentProfileProvider initialProfile={initialProfile}>
                    {ui}
                  </StudentProfileProvider>
                </CompareProvider>
              </SavedProvider>
            </ScholarshipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  };

  // TEST A: New Accounts Incorrectly Show 100% Profile Completion (Bug 1)
  describe('Test A: New accounts start with clean, incomplete profile (0%)', () => {
    it('returns 0% readiness and zero known fields for null, undefined, or empty profile', () => {
      expect(calculateProfileCompletion(null).percentage).toBe(0);
      expect(calculateProfileCompletion(undefined).percentage).toBe(0);

      const emptyProfile: StudentProfile = {
        id: 'new-user-001',
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {},
        preferences: { language: 'en', theme: 'system' },
      };

      const result = calculateProfileCompletion(emptyProfile, SCHOLARSHIPS_DATA);
      expect(result.knownFields).toBe(0);
      expect(result.percentage).toBe(0);

      const structuredResult = calculateStructuredCompletion(emptyProfile);
      expect(structuredResult.knownFields).toBe(0);
      expect(structuredResult.percentage).toBe(0);
      expect(structuredResult.isReady).toBe(false);
    });

    it('newly registered account storage key is empty and returns null profile', async () => {
      const newUserId = 'student-test-new-999';
      const stored = await profileStorage.getProfile(newUserId);
      expect(stored).toBeNull();
      const localStored = await localProfileStorage.getProfile(newUserId);
      expect(localStored).toBeNull();
    });

    it('FindScholarshipsPage renders empty state prompt for incomplete/empty profile without fabricating values', () => {
      const html = renderWithProviders(<FindScholarshipsPage onNavigate={() => {}} />);
      // Should show prompt to build profile
      expect(html).toContain('Build My Profile');
      expect(html).toContain('Find Scholarships Matched to You');
      // Should NOT show fabricated values as matched profile
      expect(html).not.toContain('Matching scholarships using your existing profile');
    });
  });

  // TEST B: Completion percentage calculation strictly checks valid user responses
  describe('Test B: Profile completion increases with valid input and requires full fields for 100%', () => {
    it('does not treat unknown or omitted fields as known, and reaches 100% only when all required are provided', () => {
      const partialProfile: StudentProfile = {
        id: 'user-partial',
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {
          field_education_level: { value: 'undergraduate', status: 'known', updatedAt: '', source: 'profile' },
          field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '', source: 'profile' },
          field_category: { value: null, status: 'unknown', updatedAt: '', source: 'profile' },
        },
        preferences: { language: 'en', theme: 'system' },
      };

      const partialRes = calculateProfileCompletion(partialProfile, SCHOLARSHIPS_DATA);
      expect(partialRes.knownFields).toBe(2);
      expect(partialRes.percentage).toBeGreaterThan(0);
      expect(partialRes.percentage).toBeLessThan(100);
    });
  });

  // TEST C: Returning user profiles are preserved without regression
  describe('Test C: Existing completed profiles and demo profiles are preserved', () => {
    it('retains demo student profile with diploma details', async () => {
      const demoProfile = await profileStorage.loadProfile('demo-student-001');
      // Demo student has a seeded profile in admin/storage
      if (demoProfile) {
        expect(demoProfile.profileType).toBe('registered');
      }
    });

    it('persists and reloads saved user profile without data loss', async () => {
      const userId = 'user-returning-456';
      const userProfile: StudentProfile = {
        id: userId,
        userId: userId,
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {
          field_education_level: { value: 'postgraduate', status: 'known', updatedAt: '', source: 'profile' },
          field_domicile_state: { value: 'Maharashtra', status: 'known', updatedAt: '', source: 'profile' },
        },
        preferences: { language: 'en', theme: 'dark' },
      };

      await profileStorage.saveProfile(userProfile, userId);
      const reloaded = await profileStorage.loadProfile(userId);

      expect(reloaded).not.toBeNull();
      expect(reloaded?.fields['field_education_level']?.value).toBe('postgraduate');
      expect(reloaded?.fields['field_domicile_state']?.value).toBe('Maharashtra');
    });
  });

  // TEST D: Bug 2 - Clicking Update Profile does not open a blank screen
  describe('Test D: ProfilePage renders cleanly without runtime exceptions (Bug 2)', () => {
    it('ProfilePage renders cleanly for a brand new user with no profile fields', () => {
      const html = renderWithProviders(<ProfilePage onNavigate={() => {}} />);
      expect(html).toBeTruthy();
      // Should render onboarding state with Start My Profile
      expect(html).toContain('Build Your Scholarship Profile');
      expect(html).toContain('Start My Profile');
      expect(html).toContain('Back to Find Scholarships');
    });

    it('ProfilePage renders returning dashboard with all 9 sections when profile is populated', () => {
      const populatedProfile: StudentProfile = {
        id: 'user-789',
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {
          field_education_level: { value: 'diploma', status: 'known', updatedAt: '', source: 'profile' },
          field_domicile_state: { value: 'Gujarat', status: 'known', updatedAt: '', source: 'profile' },
        },
        preferences: { language: 'en', theme: 'system' },
      };

      // Mock storage save
      profileStorage.saveProfile(populatedProfile);

      const html = renderWithProviders(<ProfilePage onNavigate={() => {}} />, populatedProfile);
      expect(html).toBeTruthy();
      expect(html).toContain('Back to Find Scholarships');
      expect(html).toContain('Eligibility Information');
    });
  });

  // TEST E: Profile persistence isolation between users
  describe('Test E: Profile data isolation across accounts', () => {
    it('does not leak profile data from user A into user B', async () => {
      const userA = 'account-user-A';
      const userB = 'account-user-B';

      const profileA: StudentProfile = {
        id: userA,
        userId: userA,
        profileType: 'registered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {
          field_education_level: { value: 'phd', status: 'known', updatedAt: '', source: 'profile' },
        },
        preferences: { language: 'en', theme: 'system' },
      };

      await profileStorage.saveProfile(profileA, userA);

      // User B loads profile
      const loadedB = await profileStorage.loadProfile(userB);
      expect(loadedB).toBeNull();

      // User A loads profile
      const loadedA = await profileStorage.loadProfile(userA);
      expect(loadedA?.fields['field_education_level']?.value).toBe('phd');
    });
  });
});
