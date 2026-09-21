import { describe, it, expect } from 'vitest';
import { authService } from '../authService';

describe('authService', () => {
  it('isConfigured returns a boolean without throwing', () => {
    const configured = authService.isConfigured();
    expect(typeof configured).toBe('boolean');
  });

  it('handles unconfigured state gracefully for signIn without crashing or faking success', async () => {
    if (!authService.isConfigured()) {
      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Supabase authentication is not configured');
    }
  });

  it('handles unconfigured state gracefully for signUp without crashing or faking success', async () => {
    if (!authService.isConfigured()) {
      const result = await authService.signUp({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Supabase authentication is not configured');
    }
  });

  it('handles unconfigured state gracefully for resetPassword', async () => {
    if (!authService.isConfigured()) {
      const result = await authService.resetPassword('test@example.com');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Supabase authentication is not configured');
    }
  });

  it('getCurrentUser returns null when unconfigured', async () => {
    if (!authService.isConfigured()) {
      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    }
  });

  it('handles unconfigured state gracefully for signInWithGoogle without crashing', async () => {
    if (!authService.isConfigured()) {
      const result = await authService.signInWithGoogle();
      expect(result.error).toContain('Supabase authentication is not configured');
    }
  });

  it('accepts captchaToken parameter in signIn, signUp, and resetPassword without breaking unconfigured handler', async () => {
    if (!authService.isConfigured()) {
      const resLogin = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'mock-captcha-token',
      });
      expect(resLogin.success).toBe(false);

      const resSignup = await authService.signUp({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'mock-captcha-token',
      });
      expect(resSignup.success).toBe(false);

      const resReset = await authService.resetPassword('test@example.com', 'mock-captcha-token');
      expect(resReset.success).toBe(false);
    }
  });
});
