import type { StudentProfile } from '../../types/studentProfile';
import type { ProfileStorage } from './profileStorage';

export interface MigrationOptions {
  retainLocalBackup?: boolean;
  conflictResolution?: 'overwrite' | 'merge_prefer_cloud' | 'merge_prefer_local';
  existingCloudProfile?: StudentProfile;
}

export interface MigrationResult {
  success: boolean;
  profile: StudentProfile;
  backupKey?: string;
  error?: string;
}

export interface ProfileMigrationService {
  migrateGuestToRegistered(
    guestProfile: StudentProfile,
    userId: string,
    options?: MigrationOptions
  ): Promise<MigrationResult>;
}

/**
 * Helper to determine if a field value contains actual meaningful data
 * rather than missing, null, undefined, empty or explicit omission.
 */
export function isFieldMeaningful(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== 'prefer_not_to_say';
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

/**
 * Migrates a raw profile object across schema versions.
 */
export function migrateProfile(data: any, _fromVersion: number, _toVersion: number): StudentProfile {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid profile data for migration');
  }

  const current = { ...data };

  if (!current.id) {
    current.id = 'guest_' + Date.now().toString(36);
  }
  if (!current.profileType) {
    current.profileType = 'guest';
  }
  if (!current.fields || typeof current.fields !== 'object') {
    current.fields = {};
  }
  if (!current.preferences) {
    current.preferences = { language: 'en', theme: 'system' };
  }
  if (!current.createdAt) {
    current.createdAt = new Date().toISOString();
  }
  if (!current.updatedAt) {
    current.updatedAt = new Date().toISOString();
  }

  return current as StudentProfile;
}

/**
 * Merges two StudentProfiles (e.g. local guest profile and existing cloud/account profile).
 * Guarantees: Never overwrites known/meaningful field values with unknown/empty values.
 */
export function mergeProfiles(
  local: StudentProfile,
  cloud: StudentProfile,
  strategy: 'overwrite' | 'merge_prefer_cloud' | 'merge_prefer_local' = 'merge_prefer_local'
): StudentProfile {
  const mergedFields: Record<string, any> = {};
  const allFieldKeys = new Set([
    ...Object.keys(local.fields || {}),
    ...Object.keys(cloud.fields || {}),
  ]);

  for (const key of allFieldKeys) {
    const localF = local.fields?.[key];
    const cloudF = cloud.fields?.[key];

    if (localF && !cloudF) {
      mergedFields[key] = { ...localF };
      continue;
    }
    if (!localF && cloudF) {
      mergedFields[key] = { ...cloudF };
      continue;
    }
    if (!localF && !cloudF) {
      continue;
    }

    const localMeaningful = isFieldMeaningful(localF?.value);
    const cloudMeaningful = isFieldMeaningful(cloudF?.value);

    // If only one is meaningful, always retain the meaningful one regardless of preference
    if (localMeaningful && !cloudMeaningful) {
      mergedFields[key] = { ...localF };
    } else if (!localMeaningful && cloudMeaningful) {
      mergedFields[key] = { ...cloudF };
    } else if (strategy === 'merge_prefer_cloud') {
      mergedFields[key] = { ...cloudF };
    } else if (strategy === 'merge_prefer_local') {
      mergedFields[key] = { ...localF };
    } else {
      // Overwrite: local takes precedence if both are meaningful
      mergedFields[key] = { ...localF };
    }
  }

  const now = new Date().toISOString();
  const createdAt =
    local.createdAt && cloud.createdAt
      ? new Date(local.createdAt) < new Date(cloud.createdAt)
        ? local.createdAt
        : cloud.createdAt
      : local.createdAt || cloud.createdAt || now;

  return {
    id: cloud.id || local.id,
    profileType: 'registered',
    createdAt,
    updatedAt: now,
    lastActiveAt: now,
    fields: mergedFields,
    preferences: {
      ...(cloud.preferences || {}),
      ...(local.preferences || {}),
    },
    profileCompletion: undefined,
  };
}

/**
 * Foundation implementation of ProfileMigrationService.
 * Seamlessly transitions guest profile data into a registered profile structure
 * ready for future cloud sync (Supabase/PostgreSQL) without data loss.
 */
export class DefaultProfileMigrationService implements ProfileMigrationService {
  private storage: ProfileStorage;

  constructor(storage: ProfileStorage) {
    this.storage = storage;
  }

  async migrateGuestToRegistered(
    guestProfile: StudentProfile,
    userId: string,
    options?: MigrationOptions
  ): Promise<MigrationResult> {
    try {
      if (!userId || userId.trim() === '') {
        return {
          success: false,
          profile: guestProfile,
          error: 'User ID is required for registering a profile.',
        };
      }

      let backupKey: string | undefined;
      if (options?.retainLocalBackup && typeof window !== 'undefined' && window.localStorage) {
        backupKey = `edvora_student_profile_backup_${Date.now()}`;
        try {
          window.localStorage.setItem(backupKey, JSON.stringify(guestProfile));
        } catch {
          // Local storage quota or security error; ignore backup failure gracefully
        }
      }

      const now = new Date().toISOString();
      let targetProfile: StudentProfile;

      if (options?.existingCloudProfile) {
        targetProfile = mergeProfiles(
          guestProfile,
          { ...options.existingCloudProfile, id: userId },
          options.conflictResolution || 'merge_prefer_local'
        );
      } else {
        targetProfile = {
          ...guestProfile,
          id: userId,
          profileType: 'registered',
          updatedAt: now,
          lastActiveAt: now,
        };
      }

      // Persist registered profile into storage
      await this.storage.saveProfile(targetProfile);

      return {
        success: true,
        profile: targetProfile,
        backupKey,
      };
    } catch (err) {
      return {
        success: false,
        profile: guestProfile,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
