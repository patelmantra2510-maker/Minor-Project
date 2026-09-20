import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultProfileMigrationService } from '../profileMigration';
import { LocalStorageProfileStorage } from '../profileStorage';
import type { StudentProfile } from '../../../types/studentProfile';

// Mock localStorage
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null { return this.store[key] || null; }
  setItem(key: string, value: string): void { this.store[key] = String(value); }
  removeItem(key: string): void { delete this.store[key]; }
  clear(): void { this.store = {}; }
}

describe('Profile Migration Service', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: new MockLocalStorage(),
    };
  });

  it('successfully migrates guest profile to registered profile preserving all field data', async () => {
    const storage = new LocalStorageProfileStorage();
    const migrationService = new DefaultProfileMigrationService(storage);

    const guestProfile: StudentProfile = {
      id: 'guest_abc',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      fields: {
        field_education_level: {
          value: 'undergraduate',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
        field_family_income: {
          value: 200000,
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    const result = await migrationService.migrateGuestToRegistered(guestProfile, 'user_account_999');

    expect(result.success).toBe(true);
    expect(result.profile.id).toBe('user_account_999');
    expect(result.profile.profileType).toBe('registered');
    expect(result.profile.fields['field_education_level'].value).toBe('undergraduate');
    expect(result.profile.fields['field_family_income'].value).toBe(200000);

    // Verify stored profile is also updated
    const stored = await storage.getProfile();
    expect(stored?.id).toBe('user_account_999');
    expect(stored?.profileType).toBe('registered');
  });

  it('fails gracefully when user ID is empty', async () => {
    const storage = new LocalStorageProfileStorage();
    const migrationService = new DefaultProfileMigrationService(storage);

    const guestProfile: StudentProfile = {
      id: 'guest_test',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      fields: {},
      preferences: { language: 'en', theme: 'light' },
    };

    const result = await migrationService.migrateGuestToRegistered(guestProfile, '');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('retains a local backup when retainLocalBackup option is true', async () => {
    const storage = new LocalStorageProfileStorage();
    const migrationService = new DefaultProfileMigrationService(storage);

    const guestProfile: StudentProfile = {
      id: 'guest_backup_check',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      fields: {
        field_category: {
          value: 'General',
          status: 'known',
          updatedAt: '2026-09-20T10:00:00Z',
          source: 'profile',
        },
      },
      preferences: { language: 'en', theme: 'light' },
    };

    const result = await migrationService.migrateGuestToRegistered(guestProfile, 'user_with_backup', {
      retainLocalBackup: true,
    });

    expect(result.success).toBe(true);
    expect(result.backupKey).toBeDefined();
    const storedBackup = (globalThis as any).window.localStorage.getItem(result.backupKey!);
    expect(storedBackup).not.toBeNull();
    const parsed = JSON.parse(storedBackup!);
    expect(parsed.id).toBe('guest_backup_check');
  });

  describe('mergeProfiles conflict-resolution', () => {
    it('never overwrites a known value with an unknown or empty value', async () => {
      const { mergeProfiles } = await import('../profileMigration');

      const localProfile: StudentProfile = {
        id: 'guest_local',
        profileType: 'guest',
        createdAt: '2026-09-20T10:00:00Z',
        updatedAt: '2026-09-20T10:00:00Z',
        fields: {
          field_education_level: {
            value: 'undergraduate',
            status: 'known',
            updatedAt: '2026-09-20T10:00:00Z',
            source: 'questionnaire',
          },
          field_gender: {
            value: null,
            status: 'unknown',
            updatedAt: '2026-09-20T10:00:00Z',
            source: 'profile',
          },
        },
        preferences: { language: 'en', theme: 'light' },
      };

      const cloudProfile: StudentProfile = {
        id: 'user_cloud',
        profileType: 'registered',
        createdAt: '2026-09-18T10:00:00Z',
        updatedAt: '2026-09-18T10:00:00Z',
        fields: {
          field_education_level: {
            value: null,
            status: 'unknown',
            updatedAt: '2026-09-18T10:00:00Z',
            source: 'profile',
          },
          field_gender: {
            value: 'female',
            status: 'known',
            updatedAt: '2026-09-18T10:00:00Z',
            source: 'profile',
          },
        },
        preferences: { language: 'hi', theme: 'dark' },
      };

      const merged = mergeProfiles(localProfile, cloudProfile, 'merge_prefer_cloud');

      // Even with merge_prefer_cloud, undergraduate from local is preserved because cloud had null
      expect(merged.fields['field_education_level'].value).toBe('undergraduate');
      // And female from cloud is preserved because local had null
      expect(merged.fields['field_gender'].value).toBe('female');
      expect(merged.profileType).toBe('registered');
      expect(merged.id).toBe('user_cloud');
    });

    it('respects strategy when both profiles have meaningful values', async () => {
      const { mergeProfiles } = await import('../profileMigration');

      const localProfile: StudentProfile = {
        id: 'guest_local',
        profileType: 'guest',
        createdAt: '2026-09-20T10:00:00Z',
        updatedAt: '2026-09-20T10:00:00Z',
        fields: {
          field_domicile_state: {
            value: 'Gujarat',
            status: 'known',
            updatedAt: '2026-09-20T10:00:00Z',
            source: 'profile',
          },
        },
        preferences: { language: 'gu', theme: 'system' },
      };

      const cloudProfile: StudentProfile = {
        id: 'user_cloud',
        profileType: 'registered',
        createdAt: '2026-09-19T10:00:00Z',
        updatedAt: '2026-09-19T10:00:00Z',
        fields: {
          field_domicile_state: {
            value: 'Maharashtra',
            status: 'known',
            updatedAt: '2026-09-19T10:00:00Z',
            source: 'profile',
          },
        },
        preferences: { language: 'en', theme: 'light' },
      };

      const preferCloud = mergeProfiles(localProfile, cloudProfile, 'merge_prefer_cloud');
      expect(preferCloud.fields['field_domicile_state'].value).toBe('Maharashtra');

      const preferLocal = mergeProfiles(localProfile, cloudProfile, 'merge_prefer_local');
      expect(preferLocal.fields['field_domicile_state'].value).toBe('Gujarat');
    });
  });

  describe('migrateProfile across versions', () => {
    it('normalizes raw legacy profile object to valid StudentProfile', async () => {
      const { migrateProfile } = await import('../profileMigration');

      const raw = {
        fields: {
          field_education_level: {
            value: '12th',
            status: 'known',
            updatedAt: '2026-09-20T10:00:00Z',
            source: 'profile',
          },
        },
      };

      const migrated = migrateProfile(raw, 0, 1);
      expect(migrated.id).toBeDefined();
      expect(migrated.profileType).toBe('guest');
      expect(migrated.preferences).toBeDefined();
      expect(migrated.fields['field_education_level'].value).toBe('12th');
    });
  });
});
