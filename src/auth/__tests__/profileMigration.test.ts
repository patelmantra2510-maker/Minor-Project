import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import {
  detectGuestData,
  migrateGuestProfileToAccount,
  mergeProfiles,
  isMeaningfulFieldValue,
} from '../../services/storage/profileMigration';
import type { StudentProfile } from '../../types/studentProfile';

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('Profile Migration & Guest Detection', () => {
  beforeAll(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      (globalThis as any).localStorage = new MemoryStorage();
    }
    if (typeof globalThis.sessionStorage === 'undefined') {
      (globalThis as any).sessionStorage = new MemoryStorage();
    }
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Guest Data Detection', () => {
    it('reports hasData: false when no guest data exists', () => {
      const summary = detectGuestData('user-123');
      expect(summary.hasData).toBe(false);
      expect(summary.fieldCount).toBe(0);
      expect(summary.savedCount).toBe(0);
      expect(summary.hasSessionAnswers).toBe(false);
    });

    it('detects saved scholarships in localStorage', () => {
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat', 'cmss-gujarat']));

      const summary = detectGuestData('user-123');
      expect(summary.hasData).toBe(true);
      expect(summary.savedCount).toBe(2);
    });

    it('detects guest session answers in sessionStorage', () => {
      sessionStorage.setItem('edvora_session_answers', JSON.stringify({ state: 'Gujarat', marks: '85' }));

      const summary = detectGuestData('user-123');
      expect(summary.hasData).toBe(true);
      expect(summary.hasSessionAnswers).toBe(true);
    });

    it('detects student profile fields in localStorage', () => {
      const mockProfile = {
        id: 'guest_1',
        profileType: 'guest',
        fields: {
          'education.level': { value: 'undergraduate', status: 'known', updatedAt: '2026-09-20', source: 'questionnaire' },
        },
      };
      localStorage.setItem('edvora_student_profile_v1', JSON.stringify(mockProfile));

      const summary = detectGuestData('user-123');
      expect(summary.hasData).toBe(true);
      expect(summary.hasProfileFields).toBe(true);
      expect(summary.fieldCount).toBe(1);
    });

    it('bypasses detection if user has already completed migration', () => {
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat']));
      localStorage.setItem('edvora_migrated_user-123', 'true');

      const summary = detectGuestData('user-123');
      expect(summary.hasData).toBe(false);
    });
  });

  describe('Deterministic Profile Merge (mergeProfiles)', () => {
    it('Edge Case 1: Both cloud and guest null -> returns clean empty registered profile', () => {
      const merged = mergeProfiles(null, null, 'user-empty', { language: 'hi', theme: 'dark' });
      expect(merged.id).toBe('user-empty');
      expect(merged.profileType).toBe('registered');
      expect(merged.fields).toEqual({});
      expect(merged.preferences.language).toBe('hi');
      expect(merged.preferences.theme).toBe('dark');
    });

    it('Edge Case 2: Only Cloud Profile exists -> retains cloud profile with updated userId and registered type', () => {
      const cloudProfile: StudentProfile = {
        id: 'user-cloud',
        profileType: 'registered',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        fields: {
          'academic.percentage': { value: 85, status: 'known', updatedAt: '2026-01-01', source: 'profile' },
        },
        preferences: { language: 'en', theme: 'light' },
      };

      const merged = mergeProfiles(cloudProfile, null, 'user-cloud');
      expect(merged.id).toBe('user-cloud');
      expect(merged.profileType).toBe('registered');
      expect(merged.fields['academic.percentage']?.value).toBe(85);
    });

    it('Edge Case 3: Only Guest Profile exists -> converts guest profile to registered profile', () => {
      const guestProfile: StudentProfile = {
        id: 'guest_abc',
        profileType: 'guest',
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
        fields: {
          'location.state': { value: 'Gujarat', status: 'known', updatedAt: '2026-09-01', source: 'questionnaire' },
        },
        preferences: { language: 'gu', theme: 'dark' },
      };

      const merged = mergeProfiles(null, guestProfile, 'user-registered');
      expect(merged.id).toBe('user-registered');
      expect(merged.profileType).toBe('registered');
      expect(merged.fields['location.state']?.value).toBe('Gujarat');
      expect(merged.preferences.language).toBe('gu');
      expect(merged.preferences.theme).toBe('dark');
    });

    it('Edge Case 4: Both exist -> retains existing cloud fields and adopts missing guest fields', () => {
      const cloudProfile: StudentProfile = {
        id: 'user-both',
        profileType: 'registered',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        fields: {
          'academic.percentage': { value: 92, status: 'known', updatedAt: '2026-01-01', source: 'profile' },
          'family.income': { value: null, status: 'unknown', updatedAt: '2026-01-01', source: 'profile' }, // empty/unknown
        },
        preferences: { language: 'hi', theme: 'dark' },
      };

      const guestProfile: StudentProfile = {
        id: 'guest_xyz',
        profileType: 'guest',
        createdAt: '2026-09-10T00:00:00.000Z',
        updatedAt: '2026-09-10T00:00:00.000Z',
        fields: {
          // Attempting to overwrite existing cloud academic.percentage with 70
          'academic.percentage': { value: 70, status: 'known', updatedAt: '2026-09-10', source: 'questionnaire' },
          // Guest supplies family.income which was unknown in cloud
          'family.income': { value: 250000, status: 'known', updatedAt: '2026-09-10', source: 'questionnaire' },
          // Guest introduces a brand new field
          'social.category': { value: 'OBC', status: 'known', updatedAt: '2026-09-10', source: 'questionnaire' },
        },
        preferences: { language: 'en', theme: 'light' },
      };

      const merged = mergeProfiles(cloudProfile, guestProfile, 'user-both');

      // 1. Cloud value is strictly preserved, never overwritten
      expect(merged.fields['academic.percentage']?.value).toBe(92);

      // 2. Previously unknown/empty cloud field is enriched by guest
      expect(merged.fields['family.income']?.value).toBe(250000);

      // 3. New guest field is incorporated
      expect(merged.fields['social.category']?.value).toBe('OBC');

      // 4. Cloud preferences take precedence
      expect(merged.preferences.language).toBe('hi');
      expect(merged.preferences.theme).toBe('dark');
    });

    it('Helper isMeaningfulFieldValue accurately determines validity', () => {
      expect(isMeaningfulFieldValue(null)).toBe(false);
      expect(isMeaningfulFieldValue(undefined)).toBe(false);
      expect(isMeaningfulFieldValue({ value: null, status: 'known', updatedAt: '', source: 'profile' })).toBe(false);
      expect(isMeaningfulFieldValue({ value: '', status: 'known', updatedAt: '', source: 'profile' })).toBe(false);
      expect(isMeaningfulFieldValue({ value: [], status: 'known', updatedAt: '', source: 'profile' })).toBe(false);
      expect(isMeaningfulFieldValue({ value: 'Gujarat', status: 'unknown', updatedAt: '', source: 'profile' })).toBe(false);
      expect(isMeaningfulFieldValue({ value: 'Gujarat', status: 'known', updatedAt: '', source: 'profile' })).toBe(true);
      expect(isMeaningfulFieldValue({ value: 0, status: 'known', updatedAt: '', source: 'profile' })).toBe(true);
      expect(isMeaningfulFieldValue({ value: false, status: 'known', updatedAt: '', source: 'profile' })).toBe(true);
    });
  });

  describe('Migration Execution (migrateGuestProfileToAccount)', () => {
    it('deduplicates saved scholarships and sets migration flag', async () => {
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat', 'mysy-gujarat', 'cmss-gujarat']));

      const result = await migrateGuestProfileToAccount('user-456', false);
      expect(result.success).toBe(true);
      expect(result.migrated).toBe(true);

      // Verify deduplicated saved items
      const saved = JSON.parse(localStorage.getItem('edvora_saved_ids') || '[]');
      expect(saved).toEqual(['mysy-gujarat', 'cmss-gujarat']);

      // Verify migration flag set
      expect(localStorage.getItem('edvora_migrated_user-456')).toBe('true');
    });

    it('deduplicates compare IDs and caps at maximum of 3', async () => {
      localStorage.setItem(
        'edvora_compare_ids',
        JSON.stringify(['scholarship-1', 'scholarship-2', 'scholarship-1', 'scholarship-3', 'scholarship-4'])
      );

      const result = await migrateGuestProfileToAccount('user-789', false);
      expect(result.success).toBe(true);

      const compare = JSON.parse(localStorage.getItem('edvora_compare_ids') || '[]');
      expect(compare.length).toBe(3);
      expect(compare).toEqual(['scholarship-1', 'scholarship-2', 'scholarship-3']);
    });

    it('Edge Case 5: is idempotent and skips if already migrated', async () => {
      localStorage.setItem('edvora_migrated_user-repeat', 'true');
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat']));

      const result = await migrateGuestProfileToAccount('user-repeat', true);
      expect(result.success).toBe(true);
      expect(result.migrated).toBe(false); // skipped without re-running
    });
  });
});
