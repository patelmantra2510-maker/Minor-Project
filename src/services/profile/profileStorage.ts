import type { StudentProfile, StudentFieldValue, ProfileValue } from '../../types/studentProfile';
import type { QuestionnaireState } from '../../types/questionnaire';
import type { ProfileValueStatus } from '../../types/eligibility';

export const EDVORA_PROFILE_KEY = 'edvora_student_profile_v1';
export const EDVORA_QUESTIONNAIRE_KEY = 'edvora_questionnaire_state_v1';
export const PROFILE_STORAGE_KEY_V1 = EDVORA_PROFILE_KEY;

export const CURRENT_PROFILE_STORAGE_VERSION = 1;
export const CURRENT_QUESTIONNAIRE_STORAGE_VERSION = 1;

export interface StoredProfileEnvelope {
  version: number;
  profile: StudentProfile;
  storedAt: string;
}

export interface StoredQuestionnaireEnvelope {
  version: number;
  state: QuestionnaireState;
  storedAt: string;
}

export interface ProfileStorageProvider {
  loadProfile(): Promise<StudentProfile | null>;
  saveProfile(profile: StudentProfile): Promise<void>;
  clearProfile(): Promise<void>;
  hasProfile(): Promise<boolean>;
}

export interface ProfileStorage extends ProfileStorageProvider {
  getProfile(): Promise<StudentProfile | null>;
  loadProfile(): Promise<StudentProfile | null>;
  saveProfile(profile: StudentProfile): Promise<void>;
  updateProfile(profile: StudentProfile): Promise<void>;
  clearProfile(): Promise<void>;
  hasProfile(): Promise<boolean>;

  loadQuestionnaireState(): Promise<QuestionnaireState | null>;
  saveQuestionnaireState(state: QuestionnaireState): Promise<void>;
  clearQuestionnaireState(): Promise<void>;
}

/**
 * Validates basic structure of parsed student profile.
 */
export function isValidProfileStructure(obj: unknown): obj is StudentProfile {
  if (!obj || typeof obj !== 'object') return false;
  const p = obj as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    (p.profileType === 'guest' || p.profileType === 'registered') &&
    typeof p.createdAt === 'string' &&
    typeof p.fields === 'object' &&
    p.fields !== null
  );
}

/**
 * Robust corruption recovery parser.
 * Recovers valid fields from corrupted or partial storage shapes rather than discarding everything.
 */
export function recoverCorruptedProfile(parsed: unknown): StudentProfile | null {
  if (!parsed || typeof parsed !== 'object') return null;

  const rawObj = parsed as Record<string, unknown>;
  // Check if wrapped in envelope
  const target = (rawObj.profile && typeof rawObj.profile === 'object'
    ? rawObj.profile
    : rawObj) as Record<string, unknown>;

  const fields: Record<string, StudentFieldValue> = {};
  if (target.fields && typeof target.fields === 'object' && target.fields !== null) {
    const rawFields = target.fields as Record<string, unknown>;
    for (const [key, val] of Object.entries(rawFields)) {
      if (val && typeof val === 'object') {
        const v = val as Record<string, unknown>;
        const validStatuses: ProfileValueStatus[] = [
          'known',
          'unknown',
          'not_applicable',
          'prefer_not_to_say',
          'custom',
        ];
        const status = validStatuses.includes(v.status as ProfileValueStatus)
          ? (v.status as ProfileValueStatus)
          : 'unknown';

        let valVal: ProfileValue = null;
        if (typeof v.value === 'string' || typeof v.value === 'number' || typeof v.value === 'boolean') {
          valVal = v.value;
        } else if (Array.isArray(v.value)) {
          valVal = v.value.filter((item): item is string => typeof item === 'string');
        }

        const validSources = ['questionnaire', 'profile', 'import', 'admin', 'system'] as const;
        const source = validSources.includes(v.source as any) ? (v.source as any) : 'profile';

        fields[key] = {
          value: valVal,
          status,
          customText: typeof v.customText === 'string' ? v.customText : undefined,
          updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString(),
          source,
        };
      }
    }
  }

  const now = new Date().toISOString();
  const profileId =
    typeof target.id === 'string' && target.id.trim() ? target.id : `guest_${Date.now()}`;
  const profileType = target.profileType === 'registered' ? 'registered' : 'guest';

  return {
    id: profileId,
    profileType,
    createdAt: typeof target.createdAt === 'string' ? target.createdAt : now,
    updatedAt: now,
    lastActiveAt: now,
    fields,
    preferences: (target.preferences as StudentProfile['preferences']) || {
      language: 'en',
      theme: 'system',
    },
  };
}

/**
 * LocalStorage implementation of ProfileStorage with envelope versioning,
 * multi-tier corruption recovery, and questionnaire state persistence.
 */
export class LocalStorageProfileStorage implements ProfileStorage {
  private profileStorageKey: string;
  private questionnaireStorageKey: string;
  private memoryFallbackProfile: StudentProfile | null = null;
  private memoryFallbackQuestionnaire: QuestionnaireState | null = null;

  constructor(
    profileKey: string = EDVORA_PROFILE_KEY,
    questionnaireKey: string = EDVORA_QUESTIONNAIRE_KEY
  ) {
    this.profileStorageKey = profileKey;
    this.questionnaireStorageKey = questionnaireKey;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__edvora_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Profile methods
  async loadProfile(): Promise<StudentProfile | null> {
    if (!this.isLocalStorageAvailable()) {
      return this.memoryFallbackProfile;
    }

    try {
      const raw = window.localStorage.getItem(this.profileStorageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      // 1. If wrapped in versioned envelope
      if (parsed && typeof parsed === 'object' && 'version' in parsed && 'profile' in parsed) {
        const envelope = parsed as StoredProfileEnvelope;
        if (isValidProfileStructure(envelope.profile)) {
          return envelope.profile;
        }
      }

      // 2. Direct profile structure check (backward compatibility)
      if (isValidProfileStructure(parsed)) {
        return parsed;
      }

      // 3. Corruption recovery tier
      const recovered = recoverCorruptedProfile(parsed);
      if (recovered && Object.keys(recovered.fields).length > 0) {
        // Resave clean recovered profile
        await this.saveProfile(recovered);
        return recovered;
      }

      // Completely unrecoverable data
      await this.clearProfile();
      return null;
    } catch {
      // Safe fallback on JSON parse failure
      return null;
    }
  }

  async getProfile(): Promise<StudentProfile | null> {
    return this.loadProfile();
  }

  async hasProfile(): Promise<boolean> {
    const p = await this.loadProfile();
    return p !== null;
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    if (!isValidProfileStructure(profile)) {
      throw new Error('[Edvora ProfileStorage] Attempted to save invalid profile structure.');
    }

    const now = new Date().toISOString();
    const updatedProfile: StudentProfile = {
      ...profile,
      updatedAt: now,
      lastActiveAt: now,
    };

    if (!this.isLocalStorageAvailable()) {
      this.memoryFallbackProfile = updatedProfile;
      return;
    }

    try {
      const envelope: StoredProfileEnvelope = {
        version: CURRENT_PROFILE_STORAGE_VERSION,
        profile: updatedProfile,
        storedAt: now,
      };
      window.localStorage.setItem(this.profileStorageKey, JSON.stringify(envelope));
    } catch {
      this.memoryFallbackProfile = updatedProfile;
    }
  }

  async updateProfile(profile: StudentProfile): Promise<void> {
    return this.saveProfile(profile);
  }

  async clearProfile(): Promise<void> {
    this.memoryFallbackProfile = null;
    this.memoryFallbackQuestionnaire = null;
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(this.profileStorageKey);
        window.localStorage.removeItem(this.questionnaireStorageKey);
      } catch {
        // Ignore removal error
      }
    }
  }

  // Questionnaire state persistence methods
  async loadQuestionnaireState(): Promise<QuestionnaireState | null> {
    if (!this.isLocalStorageAvailable()) {
      return this.memoryFallbackQuestionnaire;
    }

    try {
      const raw = window.localStorage.getItem(this.questionnaireStorageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        return (parsed as StoredQuestionnaireEnvelope).state;
      }
      if (parsed && typeof parsed === 'object' && 'sessionId' in parsed) {
        return parsed as QuestionnaireState;
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveQuestionnaireState(state: QuestionnaireState): Promise<void> {
    if (!state || typeof state !== 'object') return;

    if (!this.isLocalStorageAvailable()) {
      this.memoryFallbackQuestionnaire = state;
      return;
    }

    try {
      const envelope: StoredQuestionnaireEnvelope = {
        version: CURRENT_QUESTIONNAIRE_STORAGE_VERSION,
        state,
        storedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(this.questionnaireStorageKey, JSON.stringify(envelope));
    } catch {
      this.memoryFallbackQuestionnaire = state;
    }
  }

  async clearQuestionnaireState(): Promise<void> {
    this.memoryFallbackQuestionnaire = null;
    if (this.isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(this.questionnaireStorageKey);
      } catch {
        // Ignore removal error
      }
    }
  }
}

/**
 * RemoteProfileStorageProvider: Clean interface stub prepared for future cloud synchronization.
 * Does not implement fake authentication or fake endpoints today.
 */
export class RemoteProfileStorageProvider implements ProfileStorageProvider {
  async loadProfile(): Promise<StudentProfile | null> {
    throw new Error('RemoteProfileStorageProvider requires cloud authentication service.');
  }

  async saveProfile(_profile: StudentProfile): Promise<void> {
    throw new Error('RemoteProfileStorageProvider requires cloud authentication service.');
  }

  async clearProfile(): Promise<void> {
    throw new Error('RemoteProfileStorageProvider requires cloud authentication service.');
  }

  async hasProfile(): Promise<boolean> {
    return false;
  }
}

export const profileStorage: ProfileStorage = new LocalStorageProfileStorage();
