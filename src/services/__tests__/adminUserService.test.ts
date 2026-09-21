import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAdminUserRecords,
  getAdminStats,
  getUserProfile,
  isSameDay,
} from '../adminUserService';
import { demoAuthService } from '../demoAuth';

describe('Admin User Management Service', () => {
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

  it('retrieves default demo student record without exposing passwords', () => {
    const records = getAdminUserRecords();
    expect(records.length).toBeGreaterThanOrEqual(1);

    const demoUser = records.find((u) => u.email === 'student@edvora.demo');
    expect(demoUser).toBeDefined();
    expect(demoUser?.name).toBe('Demo Student');
    expect(demoUser?.passwordConfigured).toBe(true);

    // CRITICAL SECURITY ASSERTIONS: Zero password property or plaintext exposure
    expect('password' in (demoUser || {})).toBe(false);
    expect((demoUser as any)?.password).toBeUndefined();
  });

  it('increments login count and updates timestamps upon successful login', async () => {
    const initialRecords = getAdminUserRecords();
    const initialUser = initialRecords.find((u) => u.email === 'student@edvora.demo');
    const initialLogins = initialUser?.loginCount || 0;

    const loginRes = await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'demo123',
    });
    expect(loginRes.success).toBe(true);

    const updatedRecords = getAdminUserRecords();
    const updatedUser = updatedRecords.find((u) => u.email === 'student@edvora.demo');
    expect(updatedUser?.loginCount).toBe(initialLogins + 1);
    expect(updatedUser?.lastLoginAt).toBeDefined();
  });

  it('does NOT increment login count upon failed login attempts', async () => {
    const initialRecords = getAdminUserRecords();
    const initialUser = initialRecords.find((u) => u.email === 'student@edvora.demo');
    const initialLogins = initialUser?.loginCount || 0;

    const failedRes = await demoAuthService.signIn({
      email: 'student@edvora.demo',
      password: 'incorrect-password',
    });
    expect(failedRes.success).toBe(false);

    const currentRecords = getAdminUserRecords();
    const currentUser = currentRecords.find((u) => u.email === 'student@edvora.demo');
    expect(currentUser?.loginCount).toBe(initialLogins);
  });

  it('automatically registers new demo accounts into admin records', async () => {
    const beforeCount = getAdminUserRecords().length;

    const signupRes = await demoAuthService.signUp({
      name: 'Mantra Patel',
      email: 'mantra@example.com',
      password: 'mypassword123',
    });
    expect(signupRes.success).toBe(true);

    const afterRecords = getAdminUserRecords();
    expect(afterRecords.length).toBe(beforeCount + 1);

    const newUser = afterRecords.find((u) => u.email === 'mantra@example.com');
    expect(newUser).toBeDefined();
    expect(newUser?.name).toBe('Mantra Patel');
    expect(newUser?.loginCount).toBe(1);
    expect(newUser?.status).toBe('active');
    expect(newUser?.passwordConfigured).toBe(true);

    // SECURITY CHECK: password is not in admin record
    expect('password' in (newUser || {})).toBe(false);
    expect((newUser as any)?.password).toBeUndefined();
  });

  it('computes accurate live statistics from user data', async () => {
    const stats = getAdminStats();
    expect(stats.totalUsers).toBeGreaterThanOrEqual(1);
    expect(stats.activeUsers).toBeGreaterThanOrEqual(1);
    expect(typeof stats.newUsersToday).toBe('number');
    expect(typeof stats.loggedInToday).toBe('number');
  });

  it('correctly retrieves and seeds student profile for demo student', () => {
    const profile = getUserProfile('demo-student-001');
    expect(profile).not.toBeNull();
    expect(profile?.fields.field_education_level?.value).toBe('diploma');
    expect(profile?.fields.field_branch?.value).toBe('Computer Engineering');
    expect(profile?.fields.field_category?.value).toBe('sebc_obc');
    expect(profile?.fields.field_latest_score?.value).toBe(82);
  });

  it('detects dates on the same calendar day correctly', () => {
    const now = new Date();
    const todayIso = now.toISOString();
    expect(isSameDay(todayIso, now)).toBe(true);

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(isSameDay(yesterday.toISOString(), now)).toBe(false);
  });
});
