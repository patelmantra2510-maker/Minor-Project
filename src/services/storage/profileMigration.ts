import type { StudentProfile, StudentFieldValue } from '../../types/studentProfile';
import { localProfileStorage } from './localProfileStorage';
import { cloudProfileStorage } from './cloudProfileStorage';

export interface GuestDataSummary {
  hasData: boolean;
  hasProfileFields: boolean;
  fieldCount: number;
  savedCount: number;
  hasSessionAnswers: boolean;
}

export function detectGuestData(userId?: string): GuestDataSummary {
  if (typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') {
    return {
      hasData: false,
      hasProfileFields: false,
      fieldCount: 0,
      savedCount: 0,
      hasSessionAnswers: false,
    };
  }

  if (userId) {
    const alreadyMigrated = localStorage.getItem(`edvora_migrated_${userId}`);
    if (alreadyMigrated === 'true') {
      return {
        hasData: false,
        hasProfileFields: false,
        fieldCount: 0,
        savedCount: 0,
        hasSessionAnswers: false,
      };
    }
  }

  let fieldCount = 0;
  let hasProfileFields = false;

  try {
    const rawProfile =
      localStorage.getItem('edvora_student_profile_v1') ||
      localStorage.getItem('vidyasetu_student_profile_v1');

    if (rawProfile) {
      const parsed = JSON.parse(rawProfile) as StudentProfile;
      if (parsed.fields && typeof parsed.fields === 'object') {
        const keys = Object.keys(parsed.fields);
        fieldCount = keys.length;
        hasProfileFields = fieldCount > 0;
      }
    }
  } catch {
    // ignore parse error
  }

  let hasSessionAnswers = false;
  try {
    const rawAnswers =
      sessionStorage.getItem('edvora_session_answers') ||
      sessionStorage.getItem('vidyasetu_session_answers');

    if (rawAnswers) {
      const answers = JSON.parse(rawAnswers);
      if (answers && Object.keys(answers).length > 0) {
        hasSessionAnswers = true;
      }
    }
  } catch {
    // ignore parse error
  }

  let savedCount = 0;
  try {
    const rawSaved =
      localStorage.getItem('edvora_saved_ids') ||
      localStorage.getItem('vidyasetu_saved_ids');
    if (rawSaved) {
      const saved = JSON.parse(rawSaved) as string[];
      if (Array.isArray(saved)) {
        savedCount = saved.length;
      }
    }
  } catch {
    // ignore parse error
  }

  const hasData = hasProfileFields || hasSessionAnswers || savedCount > 0;

  return {
    hasData,
    hasProfileFields,
    fieldCount,
    savedCount,
    hasSessionAnswers,
  };
}

/**
 * Checks if a StudentFieldValue contains meaningful, non-empty, known data.
 */
export function isMeaningfulFieldValue(field?: StudentFieldValue | null): boolean {
  if (!field) return false;
  if (field.value === null || field.value === undefined || field.value === '') return false;
  if (Array.isArray(field.value) && field.value.length === 0) return false;
  if (field.status === 'unknown') return false;
  return true;
}

/**
 * Deterministic merge function between existing cloud account profile and guest profile.
 * Rules:
 * 1. Account profile valid fields are always preserved (never destroyed).
 * 2. Guest profile fields fill in missing or empty cloud fields.
 * 3. Preferences (language/theme) preserve existing cloud preference, fallback to guest/app settings.
 * 4. Idempotent and pure (does not mutate inputs).
 */
export function mergeProfiles(
  existingCloud: StudentProfile | null,
  guestProfile: StudentProfile | null,
  userId: string,
  preferredPrefs?: { language?: 'en' | 'hi' | 'gu'; theme?: 'light' | 'dark' }
): StudentProfile {
  const now = new Date().toISOString();

  // Case 1: Neither exists
  if (!existingCloud && !guestProfile) {
    return {
      id: userId,
      profileType: 'registered',
      createdAt: now,
      updatedAt: now,
      fields: {},
      preferences: {
        language: preferredPrefs?.language || 'en',
        theme: preferredPrefs?.theme || 'light',
      },
    };
  }

  // Case 2: Only Cloud Profile exists
  if (existingCloud && !guestProfile) {
    return {
      ...existingCloud,
      id: userId,
      profileType: 'registered',
      updatedAt: now,
    };
  }

  // Case 3: Only Guest Profile exists
  if (!existingCloud && guestProfile) {
    return {
      ...guestProfile,
      id: userId,
      profileType: 'registered',
      createdAt: guestProfile.createdAt || now,
      updatedAt: now,
      preferences: {
        language: guestProfile.preferences?.language || preferredPrefs?.language || 'en',
        theme: guestProfile.preferences?.theme || preferredPrefs?.theme || 'light',
        desiredSupportTypes: guestProfile.preferences?.desiredSupportTypes,
      },
    };
  }

  // Case 4: Both Cloud and Guest profiles exist -> Deterministic Merge
  const baseCloud = existingCloud!;
  const baseGuest = guestProfile!;

  const mergedFields: Record<string, StudentFieldValue> = { ...baseCloud.fields };

  // Check all fields from guest
  for (const [key, guestField] of Object.entries(baseGuest.fields || {})) {
    const cloudField = mergedFields[key];
    const cloudHasMeaningful = isMeaningfulFieldValue(cloudField);
    const guestHasMeaningful = isMeaningfulFieldValue(guestField);

    // If cloud does NOT have a meaningful value but guest DOES, populate it
    if (!cloudHasMeaningful && guestHasMeaningful) {
      mergedFields[key] = {
        ...guestField,
        updatedAt: guestField.updatedAt || now,
      };
    }
    // If cloud already has meaningful data, KEEP IT (never destroy existing account data)
  }

  // Merge preferences: prefer existing cloud, fallback to guest, fallback to active app setting
  const mergedLanguage =
    baseCloud.preferences?.language ||
    baseGuest.preferences?.language ||
    preferredPrefs?.language ||
    'en';

  const mergedTheme =
    baseCloud.preferences?.theme ||
    baseGuest.preferences?.theme ||
    preferredPrefs?.theme ||
    'light';

  const mergedSupport =
    baseCloud.preferences?.desiredSupportTypes && baseCloud.preferences.desiredSupportTypes.length > 0
      ? baseCloud.preferences.desiredSupportTypes
      : baseGuest.preferences?.desiredSupportTypes;

  return {
    id: userId,
    profileType: 'registered',
    createdAt: baseCloud.createdAt || baseGuest.createdAt || now,
    updatedAt: now,
    fields: mergedFields,
    preferences: {
      language: mergedLanguage,
      theme: mergedTheme,
      desiredSupportTypes: mergedSupport,
    },
    profileCompletion: baseCloud.profileCompletion || baseGuest.profileCompletion,
  };
}

export async function migrateGuestProfileToAccount(
  userId: string,
  transferProfile: boolean
): Promise<{ success: boolean; migrated: boolean; error?: string }> {
  try {
    if (typeof localStorage === 'undefined') {
      return { success: true, migrated: false };
    }

    // Edge Case 5: Already migrated (idempotent no-op)
    const alreadyMigrated = localStorage.getItem(`edvora_migrated_${userId}`);
    if (alreadyMigrated === 'true') {
      return { success: true, migrated: false };
    }

    if (transferProfile) {
      // 1. Fetch guest profile from localProfileStorage or session answers fallback
      let guestProfile = await localProfileStorage.getProfile();
      if (!guestProfile) {
        const rawAnswers =
          sessionStorage.getItem('edvora_session_answers') ||
          sessionStorage.getItem('vidyasetu_session_answers');
        if (rawAnswers) {
          try {
            const answers = JSON.parse(rawAnswers);
            if (answers && typeof answers === 'object') {
              const now = new Date().toISOString();
              const fields: Record<string, StudentFieldValue> = {};
              for (const [k, v] of Object.entries(answers)) {
                if (v !== undefined && v !== null && v !== '') {
                  fields[k] = {
                    value: v as any,
                    status: 'known',
                    updatedAt: now,
                    source: 'questionnaire',
                  };
                }
              }
              if (Object.keys(fields).length > 0) {
                guestProfile = {
                  id: userId,
                  profileType: 'guest',
                  fields,
                  createdAt: now,
                  updatedAt: now,
                  preferences: {
                    language: (localStorage.getItem('edvora_lang') as any) || 'en',
                    theme: (localStorage.getItem('edvora_theme_mode') as any) || 'light',
                  },
                };
              }
            }
          } catch {
            // ignore parse error
          }
        }
      }

      // 2. Fetch existing cloud profile
      const existingCloud = await cloudProfileStorage.getProfile(userId);

      // 3. Merge deterministically
      const currentLang = (localStorage.getItem('edvora_lang') as any) || 'en';
      const currentTheme = (localStorage.getItem('edvora_theme_mode') as any) || 'light';
      const mergedProfile = mergeProfiles(existingCloud, guestProfile, userId, {
        language: currentLang,
        theme: currentTheme,
      });

      // 4. Save merged profile to cloud
      await cloudProfileStorage.saveProfile(mergedProfile);

      // 5. Update local cache with registered profile
      await localProfileStorage.saveProfile(mergedProfile);
    }

    // Merge saved scholarships with deduplication
    try {
      const localSavedRaw =
        localStorage.getItem('edvora_saved_ids') ||
        localStorage.getItem('vidyasetu_saved_ids');
      const localSaved = localSavedRaw ? (JSON.parse(localSavedRaw) as string[]) : [];
      if (Array.isArray(localSaved) && localSaved.length > 0) {
        const uniqueSaved = Array.from(new Set(localSaved));
        localStorage.setItem('edvora_saved_ids', JSON.stringify(uniqueSaved));
      }
    } catch {
      // ignore
    }

    // Merge compare items with deduplication (capped at max 3)
    try {
      const localCompareRaw =
        localStorage.getItem('edvora_compare_ids') ||
        localStorage.getItem('vidyasetu_compare_ids');
      const localCompare = localCompareRaw ? (JSON.parse(localCompareRaw) as string[]) : [];
      if (Array.isArray(localCompare) && localCompare.length > 0) {
        const uniqueCompare = Array.from(new Set(localCompare)).slice(0, 3);
        localStorage.setItem('edvora_compare_ids', JSON.stringify(uniqueCompare));
      }
    } catch {
      // ignore
    }

    // Mark migration completed for this user
    localStorage.setItem(`edvora_migrated_${userId}`, 'true');

    return { success: true, migrated: true };
  } catch (err: any) {
    console.error('Migration encountered an error safely:', err);
    // Safety guarantee: NEVER delete local guest profile on error
    return { success: false, migrated: false, error: err?.message || 'Migration failed' };
  }
}
