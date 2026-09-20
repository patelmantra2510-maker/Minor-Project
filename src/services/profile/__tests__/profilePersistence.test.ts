import { describe, it, expect, beforeEach } from 'vitest';
import {
  EDVORA_PROFILE_KEY,
  EDVORA_QUESTIONNAIRE_KEY,
  LocalStorageProfileStorage,
} from '../profileStorage';
import type { StudentProfile } from '../../../types/studentProfile';
import type { QuestionnaireState } from '../../../types/questionnaire';

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

describe('Profile Persistence & Reset Isolation', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      localStorage: new MockLocalStorage(),
    };
  });

  it('profile reset clears ONLY profile and questionnaire state while strictly preserving saved scholarships, comparisons, and preferences', async () => {
    const storage = new LocalStorageProfileStorage();

    // 1. Seed existing user state: Saved, Compare, and preferences
    const mockStorage = (globalThis as any).window.localStorage;
    mockStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat', 'nsp-post-matric']));
    mockStorage.setItem('edvora_recent_ids', JSON.stringify(['tata-trusts-scholarship']));
    mockStorage.setItem('edvora_compare_ids', JSON.stringify(['mysy-gujarat', 'nsp-post-matric']));
    mockStorage.setItem('edvora_language', 'gu');
    mockStorage.setItem('edvora_theme', 'dark');

    // 2. Seed student profile and questionnaire state
    const profile: StudentProfile = {
      id: 'guest_reset_target',
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
      },
      preferences: { language: 'gu', theme: 'dark' },
    };

    const qState: QuestionnaireState = {
      sessionId: 'sess_123',
      profileId: 'guest_reset_target',
      startedAt: '2026-09-20T10:00:00Z',
      askedQuestionIds: ['q_education_level'],
      skippedQuestionIds: [],
      answers: {},
      candidateScholarshipIds: ['mysy-gujarat'],
      missingFieldIds: [],
      status: 'paused',
    };

    await storage.saveProfile(profile);
    await storage.saveQuestionnaireState(qState);

    expect(await storage.hasProfile()).toBe(true);
    expect(await storage.loadQuestionnaireState()).not.toBeNull();

    // 3. Perform Profile Reset
    await storage.clearProfile();

    // 4. Verify Profile & Questionnaire were cleared
    expect(await storage.hasProfile()).toBe(false);
    expect(await storage.getProfile()).toBeNull();
    expect(await storage.loadQuestionnaireState()).toBeNull();
    expect(mockStorage.getItem(EDVORA_PROFILE_KEY)).toBeNull();
    expect(mockStorage.getItem(EDVORA_QUESTIONNAIRE_KEY)).toBeNull();

    // 5. CRITICAL VERIFICATION: Saved items, compare trays, and app preferences MUST BE UNTOUCHED
    expect(JSON.parse(mockStorage.getItem('edvora_saved_ids')!)).toEqual([
      'mysy-gujarat',
      'nsp-post-matric',
    ]);
    expect(JSON.parse(mockStorage.getItem('edvora_recent_ids')!)).toEqual([
      'tata-trusts-scholarship',
    ]);
    expect(JSON.parse(mockStorage.getItem('edvora_compare_ids')!)).toEqual([
      'mysy-gujarat',
      'nsp-post-matric',
    ]);
    expect(mockStorage.getItem('edvora_language')).toBe('gu');
    expect(mockStorage.getItem('edvora_theme')).toBe('dark');
  });

  it('supports pausing questionnaire state and resuming without data loss', async () => {
    const storage = new LocalStorageProfileStorage();

    const qState: QuestionnaireState = {
      sessionId: 'sess_resume_test',
      profileId: 'guest_resume_user',
      startedAt: '2026-09-20T12:00:00Z',
      askedQuestionIds: ['q_edu', 'q_stream', 'q_domicile'],
      skippedQuestionIds: ['q_gender'],
      answers: {
        field_education_level: {
          value: 'postgraduate',
          status: 'known',
          updatedAt: '2026-09-20T12:01:00Z',
          source: 'questionnaire',
        },
      },
      candidateScholarshipIds: ['s1', 's2'],
      missingFieldIds: [],
      status: 'paused',
    };

    await storage.saveQuestionnaireState(qState);

    const loaded = await storage.loadQuestionnaireState();
    expect(loaded).not.toBeNull();
    expect(loaded?.status).toBe('paused');
    expect(loaded?.askedQuestionIds).toHaveLength(3);
    expect(loaded?.skippedQuestionIds).toEqual(['q_gender']);
    expect(loaded?.answers['field_education_level'].value).toBe('postgraduate');

    // Simulate completion clearing questionnaire state
    await storage.clearQuestionnaireState();
    expect(await storage.loadQuestionnaireState()).toBeNull();
  });
});
