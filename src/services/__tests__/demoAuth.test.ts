import { describe, it, expect, beforeEach } from 'vitest';
import {
  demoAuthService,
  getStoredDemoUsers,
  getStoredDemoSession,
} from '../demoAuth';

describe('Demo Authentication Service', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => {
          mockStorage[k] = v;
        },
        removeItem: (k: string) => {
          delete mockStorage[k];
        },
        clear: () => {
          mockStorage = {};
        },
      },
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });

  it('automatically seeds student@edvora.demo if storage is empty', () => {
    const users = getStoredDemoUsers();
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0].email).toBe('student@edvora.demo');
    expect(users[0].password).toBe('demo123');
  });

  it('initially has no active session', () => {
    expect(demoAuthService.getCurrentUser()).toBeNull();
    expect(getStoredDemoSession()).toBeNull();
  });

  it('logs in successfully with default demo credentials student@edvora.demo / demo123', async () => {
    const result = await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'demo123',
    });

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe('student@edvora.demo');
    expect(result.user?.name).toBe('Demo Student');

    const session = getStoredDemoSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('student@edvora.demo');
    expect(session?.authenticated).toBe(true);

    const currentUser = demoAuthService.getCurrentUser();
    expect(currentUser?.email).toBe('student@edvora.demo');
  });

  it('rejects incorrect password with "Invalid email or password."', async () => {
    const result = await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'wrongpassword',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
    expect(demoAuthService.getCurrentUser()).toBeNull();
  });

  it('rejects non-existent email with "Invalid email or password."', async () => {
    const result = await demoAuthService.signIn({
      email: 'nobody@edvora.demo',
      password: 'demo123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
    expect(demoAuthService.getCurrentUser()).toBeNull();
  });

  it('creates new account on signup and automatically signs in', async () => {
    const result = await demoAuthService.signUp({
      name: 'Priya Sharma',
      email: 'priya@edvora.demo',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.user?.name).toBe('Priya Sharma');
    expect(result.user?.email).toBe('priya@edvora.demo');

    // Verify stored session
    const session = getStoredDemoSession();
    expect(session?.email).toBe('priya@edvora.demo');

    // Verify user can now log in
    await demoAuthService.signOut();
    expect(demoAuthService.getCurrentUser()).toBeNull();

    const loginResult = await demoAuthService.signIn({
      email: 'priya@edvora.demo',
      password: 'password123',
    });
    expect(loginResult.success).toBe(true);
    expect(loginResult.user?.name).toBe('Priya Sharma');
  });

  it('rejects duplicate email signup', async () => {
    const result = await demoAuthService.signUp({
      name: 'Duplicate Student',
      email: 'student@edvora.demo',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('An account with this email already exists.');
  });

  it('rejects invalid email or short password on signup', async () => {
    const badEmail = await demoAuthService.signUp({
      name: 'Test',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(badEmail.success).toBe(false);

    const shortPw = await demoAuthService.signUp({
      name: 'Test',
      email: 'valid@edvora.demo',
      password: '123',
    });
    expect(shortPw.success).toBe(false);
  });

  it('persists session across simulated page refresh', async () => {
    await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'demo123',
    });

    // Simulate page reload by calling getCurrentUser from fresh instance
    const reloadedUser = demoAuthService.getCurrentUser();
    expect(reloadedUser).not.toBeNull();
    expect(reloadedUser?.email).toBe('student@edvora.demo');
    expect(reloadedUser?.name).toBe('Demo Student');
  });

  it('signs out completely and clears session', async () => {
    await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'demo123',
    });

    await demoAuthService.signOut();
    expect(demoAuthService.getCurrentUser()).toBeNull();
    expect(getStoredDemoSession()).toBeNull();
  });
});
