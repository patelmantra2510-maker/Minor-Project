import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { validateEmail, validatePassword, sanitizeAuthError } from '../authValidation';
import { detectGuestData, migrateGuestProfileToAccount } from '../../services/storage/profileMigration';

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
    this.store[key] = value;
  }
}

describe('Sign In & Authentication Part 2 Integration', () => {
  beforeAll(() => {
    (globalThis as any).localStorage = new MemoryStorage();
    (globalThis as any).sessionStorage = new MemoryStorage();
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Login Form Validation & Error Handling', () => {
    it('validates required email and proper format', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('').error).toContain('required');

      expect(validateEmail('invalid-format').isValid).toBe(false);
      expect(validateEmail('invalid-format').error).toContain('valid email');

      expect(validateEmail('student@example.com').isValid).toBe(true);
    });

    it('validates password requirement and length', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('').error).toContain('required');

      expect(validatePassword('123').isValid).toBe(false);
      expect(validatePassword('123').error).toContain('6 characters');

      expect(validatePassword('secure123').isValid).toBe(true);
    });

    it('sanitizes Supabase credentials error to friendly message without exposing internals', () => {
      const supabaseErr = { message: 'Invalid login credentials' };
      const sanitized = sanitizeAuthError(supabaseErr);
      expect(sanitized).toBe('Email or password is incorrect. Please check your details and try again.');
    });

    it('sanitizes network failure error to friendly user message', () => {
      const networkErr = new Error('Failed to fetch');
      const sanitized = sanitizeAuthError(networkErr);
      expect(sanitized).toBe("We couldn't sign you in right now. Please try again.");
    });
  });

  describe('Guest Continuity & Safe Session Handling', () => {
    it('preserves guest profile when guest data exists', () => {
      const mockProfile = {
        id: 'guest-1',
        profileType: 'guest' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: {
          annual_income: {
            value: 250000,
            status: 'known' as const,
            updatedAt: new Date().toISOString(),
            source: 'questionnaire' as const,
          },
        },
        preferences: {
          language: 'en' as const,
          theme: 'light' as const,
        },
      };

      localStorage.setItem('edvora_student_profile_v1', JSON.stringify(mockProfile));
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat', 'digital-gujarat']));

      const guestSummary = detectGuestData('new-user-123');
      expect(guestSummary.hasData).toBe(true);
      expect(guestSummary.fieldCount).toBe(1);
      expect(guestSummary.savedCount).toBe(2);

      // Verify guest data is NOT deleted simply by checking guest state
      expect(localStorage.getItem('edvora_saved_ids')).toBeTruthy();
      expect(localStorage.getItem('edvora_student_profile_v1')).toBeTruthy();
    });

    it('synthesizes profile from session answers during migration if no permanent profile exists', async () => {
      const sessionAnswers = {
        location: 'Gujarat',
        educationLevel: 'Undergraduate',
        annualIncome: 300000,
        academicPercentage: 82,
      };

      sessionStorage.setItem('edvora_session_answers', JSON.stringify(sessionAnswers));
      localStorage.setItem('edvora_saved_ids', JSON.stringify(['mysy-gujarat']));

      const guestSummary = detectGuestData('user-456');
      expect(guestSummary.hasData).toBe(true);
      expect(guestSummary.hasSessionAnswers).toBe(true);

      const result = await migrateGuestProfileToAccount('user-456', true);
      expect(result.success).toBe(true);

      // Verify user migration flag is set
      expect(localStorage.getItem('edvora_migrated_user-456')).toBe('true');
    });
  });
});
