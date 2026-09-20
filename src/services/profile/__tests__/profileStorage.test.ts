import { describe, it, expect, beforeEach } from 'vitest';
import {
  LocalStorageProfileStorage,
  PROFILE_STORAGE_KEY_V1,
} from '../profileStorage';
import type { StudentProfile } from '../../../types/studentProfile';

// Mock localStorage for test environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('Profile Storage Service', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: new MockLocalStorage(),
    };
  });

  it('returns null when no profile exists in storage', async () => {
    const storage = new LocalStorageProfileStorage();
    const profile = await storage.getProfile();
    expect(profile).toBeNull();
  });

  it('saves, retrieves, and updates student profile', async () => {
    const storage = new LocalStorageProfileStorage();
    const mockProfile: StudentProfile = {
      id: 'guest_123',
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
      },
      preferences: {
        language: 'en',
        theme: 'light',
      },
    };

    await storage.saveProfile(mockProfile);
    const retrieved = await storage.getProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe('guest_123');
    expect(retrieved?.fields['field_education_level'].value).toBe('undergraduate');

    // Update profile
    const updated: StudentProfile = {
      ...retrieved!,
      fields: {
        ...retrieved!.fields,
        field_gender: {
          value: 'female',
          status: 'known',
          updatedAt: '2026-09-20T11:00:00Z',
          source: 'profile',
        },
      },
    };

    await storage.updateProfile(updated);
    const reloaded = await storage.getProfile();
    expect(reloaded?.fields['field_gender'].value).toBe('female');
  });

  it('gracefully handles corrupted JSON in localStorage without crashing', async () => {
    const storage = new LocalStorageProfileStorage();
    (globalThis as any).window.localStorage.setItem(PROFILE_STORAGE_KEY_V1, '{{corrupted json}}');

    const result = await storage.getProfile();
    expect(result).toBeNull();
  });

  it('clears profile from storage', async () => {
    const storage = new LocalStorageProfileStorage();
    const mockProfile: StudentProfile = {
      id: 'guest_clear_test',
      profileType: 'guest',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      fields: {},
      preferences: { language: 'en', theme: 'system' },
    };

    await storage.saveProfile(mockProfile);
    expect(await storage.getProfile()).not.toBeNull();
    expect(await storage.hasProfile()).toBe(true);

    await storage.clearProfile();
    expect(await storage.getProfile()).toBeNull();
    expect(await storage.hasProfile()).toBe(false);
  });

  it('persists profile inside a versioned envelope and unwraps it correctly', async () => {
    const storage = new LocalStorageProfileStorage();
    const mockProfile: StudentProfile = {
      id: 'guest_env_test',
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
      preferences: { language: 'gu', theme: 'dark' },
    };

    await storage.saveProfile(mockProfile);

    // Verify raw storage item is envelope
    const raw = (globalThis as any).window.localStorage.getItem(PROFILE_STORAGE_KEY_V1);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(1);
    expect(parsed.profile.id).toBe('guest_env_test');
    expect(parsed.storedAt).toBeDefined();

    // Verify loading unwraps the envelope seamlessly
    const loaded = await storage.getProfile();
    expect(loaded?.id).toBe('guest_env_test');
    expect(loaded?.fields['field_domicile_state'].value).toBe('Gujarat');
  });

  it('loads legacy unversioned profiles without envelope for backward compatibility', async () => {
    const storage = new LocalStorageProfileStorage();
    const legacyRaw = {
      id: 'legacy_guest_456',
      profileType: 'guest',
      createdAt: '2026-09-19T10:00:00Z',
      updatedAt: '2026-09-19T10:00:00Z',
      fields: {
        field_category: {
          value: 'OBC',
          status: 'known',
          updatedAt: '2026-09-19T10:00:00Z',
          source: 'profile',
        },
      },
      preferences: { language: 'en', theme: 'system' },
    };

    (globalThis as any).window.localStorage.setItem(PROFILE_STORAGE_KEY_V1, JSON.stringify(legacyRaw));

    const loaded = await storage.getProfile();
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe('legacy_guest_456');
    expect(loaded?.fields['field_category'].value).toBe('OBC');
  });

  it('recovers partially corrupted profiles with valid fields intact', async () => {
    const storage = new LocalStorageProfileStorage();
    // Partially damaged object structure (missing metadata, malformed fields)
    const malformed = {
      id: 'guest_salvage',
      fields: {
        field_education_level: {
          value: 'postgraduate',
          status: 'known',
        },
        field_invalid: 'not_an_object',
      },
    };

    (globalThis as any).window.localStorage.setItem(PROFILE_STORAGE_KEY_V1, JSON.stringify(malformed));

    const recovered = await storage.getProfile();
    expect(recovered).not.toBeNull();
    expect(recovered?.id).toBe('guest_salvage');
    expect(recovered?.fields['field_education_level'].value).toBe('postgraduate');
    expect(recovered?.fields['field_invalid']).toBeUndefined();
  });

  it('saves, loads, and clears questionnaire state', async () => {
    const storage = new LocalStorageProfileStorage();

    expect(await storage.loadQuestionnaireState()).toBeNull();

    const qState = {
      sessionId: 'sess_1',
      profileId: 'guest_1',
      startedAt: '2026-09-20T10:00:00Z',
      askedQuestionIds: ['q_edu', 'q_stream'],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: ['s1'],
      missingFieldIds: [],
      status: 'paused' as const,
    };

    await storage.saveQuestionnaireState(qState);

    const loaded = await storage.loadQuestionnaireState();
    expect(loaded).not.toBeNull();
    expect(loaded?.sessionId).toBe('sess_1');
    expect(loaded?.askedQuestionIds).toEqual(['q_edu', 'q_stream']);
    expect(loaded?.status).toBe('paused');

    await storage.clearQuestionnaireState();
    expect(await storage.loadQuestionnaireState()).toBeNull();
  });
});
