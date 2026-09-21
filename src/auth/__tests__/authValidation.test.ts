import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  sanitizeAuthError,
} from '../authValidation';

describe('Authentication Validation', () => {
  describe('validateEmail', () => {
    it('rejects empty or whitespace-only email', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('   ').isValid).toBe(false);
      expect(validateEmail('').error).toContain('required');
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('notanemail').isValid).toBe(false);
      expect(validateEmail('missing@domain').isValid).toBe(false);
      expect(validateEmail('@missinguser.com').isValid).toBe(false);
      expect(validateEmail('user@domain..com').isValid).toBe(false);
    });

    it('accepts valid email formats', () => {
      expect(validateEmail('student@example.com').isValid).toBe(true);
      expect(validateEmail('aarav.patel@gujarat.edu.in').isValid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('rejects empty password', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('').error).toContain('required');
    });

    it('rejects password shorter than 6 characters', () => {
      expect(validatePassword('12345').isValid).toBe(false);
      expect(validatePassword('12345').error).toContain('6 characters');
    });

    it('accepts password of 6 or more characters', () => {
      expect(validatePassword('123456').isValid).toBe(true);
      expect(validatePassword('strongPassword!2026').isValid).toBe(true);
    });
  });

  describe('validateConfirmPassword', () => {
    it('rejects empty confirm password', () => {
      expect(validateConfirmPassword('password123', '').isValid).toBe(false);
    });

    it('rejects mismatched password and confirmPassword', () => {
      expect(validateConfirmPassword('password123', 'different456').isValid).toBe(false);
      expect(validateConfirmPassword('password123', 'different456').error).toContain('do not match');
    });

    it('accepts matching passwords', () => {
      expect(validateConfirmPassword('secret123', 'secret123').isValid).toBe(true);
    });
  });

  describe('sanitizeAuthError', () => {
    it('maps invalid login credentials to friendly user message', () => {
      const err = new Error('Invalid login credentials');
      expect(sanitizeAuthError(err)).toBe('Email or password is incorrect. Please check your details and try again.');
    });

    it('maps already registered to friendly message', () => {
      const err = { message: 'User already registered' };
      expect(sanitizeAuthError(err)).toBe('An account with this email already exists. Please sign in.');
    });

    it('maps rate limit errors to friendly message', () => {
      const err = 'too many requests';
      expect(sanitizeAuthError(err)).toBe('Too many attempts. Please wait a moment and try again.');
    });

    it('maps network errors to friendly message', () => {
      const err = new Error('Failed to fetch');
      expect(sanitizeAuthError(err)).toBe("We couldn't sign you in right now. Please try again.");
    });
  });
});
