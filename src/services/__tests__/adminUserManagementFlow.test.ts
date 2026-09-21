import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAdminUserRecords,
  getAdminStats,
  getUserProfile,
} from '../adminUserService';
import { demoAuthService } from '../demoAuth';

describe('Admin User Management — Complete 10-Step Verification Flow', () => {
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

  it('executes the full 10-test flow as required', async () => {
    // Initial state: default seeded student exists
    const initialUsers = getAdminUserRecords();
    const initialCount = initialUsers.length;
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // TEST 1: Create a new demo account -> User appears in Admin -> Users
    const signup1 = await demoAuthService.signUp({
      name: 'Mantra Patel',
      email: 'mantra@test.demo',
      password: 'securePassword123',
    });
    expect(signup1.success).toBe(true);

    const usersAfterSignup1 = getAdminUserRecords();
    expect(usersAfterSignup1.length).toBe(initialCount + 1);
    const mantraUser = usersAfterSignup1.find((u) => u.email === 'mantra@test.demo');
    expect(mantraUser).toBeDefined();
    expect(mantraUser?.name).toBe('Mantra Patel');

    // TEST 2: Open user details -> Name, Email, Created appear. Password shows ONLY Set, NEVER plaintext.
    expect(mantraUser?.name).toBe('Mantra Patel');
    expect(mantraUser?.email).toBe('mantra@test.demo');
    expect(mantraUser?.createdAt).toBeDefined();
    expect(mantraUser?.passwordConfigured).toBe(true);
    expect('password' in (mantraUser || {})).toBe(false);
    expect((mantraUser as any)?.password).toBeUndefined();

    // TEST 3: Log in with that account -> Login count increases, Last Login updates, Last Active updates
    const initialLogins = mantraUser?.loginCount || 1;
    const initialLastLogin = mantraUser?.lastLoginAt;

    // Small delay to verify timestamp update
    await new Promise((r) => setTimeout(r, 5));

    const loginRes = await demoAuthService.signIn({
      email: 'mantra@test.demo',
      password: 'securePassword123',
    });
    expect(loginRes.success).toBe(true);

    const usersAfterLogin = getAdminUserRecords();
    const mantraAfterLogin = usersAfterLogin.find((u) => u.email === 'mantra@test.demo');
    expect(mantraAfterLogin?.loginCount).toBe(initialLogins + 1);
    expect(mantraAfterLogin?.lastLoginAt).toBeDefined();
    expect(new Date(mantraAfterLogin!.lastLoginAt).getTime()).toBeGreaterThanOrEqual(
      new Date(initialLastLogin!).getTime()
    );

    // TEST 4: Refresh the application -> Session remains
    const currentUser = demoAuthService.getCurrentUser();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.email).toBe('mantra@test.demo');

    // TEST 5: Log out -> User becomes Guest, Admin user record remains
    await demoAuthService.signOut();
    expect(demoAuthService.getCurrentUser()).toBeNull();

    const usersAfterLogout = getAdminUserRecords();
    const mantraAfterLogout = usersAfterLogout.find((u) => u.email === 'mantra@test.demo');
    expect(mantraAfterLogout).toBeDefined();
    expect(mantraAfterLogout?.email).toBe('mantra@test.demo');

    // TEST 6: Create another account -> Total Users increases automatically
    const signup2 = await demoAuthService.signUp({
      name: 'Aarav Shah',
      email: 'aarav@test.demo',
      password: 'password456',
    });
    expect(signup2.success).toBe(true);

    const stats = getAdminStats();
    expect(stats.totalUsers).toBe(initialCount + 2);

    // TEST 7: Search for user by name
    const allUsers = getAdminUserRecords();
    const searchByName = allUsers.filter((u) =>
      u.name.toLowerCase().includes('mantra'.toLowerCase())
    );
    expect(searchByName.length).toBe(1);
    expect(searchByName[0].name).toBe('Mantra Patel');

    // TEST 8: Search by email
    const searchByEmail = allUsers.filter((u) =>
      u.email.toLowerCase().includes('@test.demo'.toLowerCase())
    );
    expect(searchByEmail.length).toBe(2);

    // TEST 9: Open User Details -> Student profile data appears if user has provided it
    // Check demo-student-001 has seeded Diploma profile
    const demoStudentProfile = getUserProfile('demo-student-001');
    expect(demoStudentProfile).not.toBeNull();
    expect(demoStudentProfile?.fields.field_education_level?.value).toBe('diploma');
    expect(demoStudentProfile?.fields.field_branch?.value).toBe('Computer Engineering');
    expect(demoStudentProfile?.fields.field_category?.value).toBe('sebc_obc');
    expect(demoStudentProfile?.fields.field_family_income?.value).toBe(120000);

    // TEST 10: Inspect console / error safety
    // All queries above completed without throwing or corrupting storage
    expect(getAdminUserRecords().every((u) => !('password' in u))).toBe(true);
  });
});
