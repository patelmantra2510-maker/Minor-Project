import type { StudentProfile } from '../types/studentProfile';
import { getSafeAdminUserRecords, type AdminUserRecord, getStoredDemoSession } from './demoAuth';
import { calculateProfileCompletion } from '../engine/profileCompletion';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { EDVORA_PROFILE_KEY } from './profile/profileStorage';

export { type AdminUserRecord } from './demoAuth';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  loggedInToday: number;
}

export const USER_PROFILE_PREFIX = 'edvora_profile_';

export const DEFAULT_DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 'demo-student-001',
  profileType: 'registered',
  userId: 'demo-student-001',
  createdAt: '2026-09-20T10:00:00.000Z',
  updatedAt: '2026-09-21T08:30:00.000Z',
  lastActiveAt: '2026-09-21T08:30:00.000Z',
  fields: {
    field_education_level: {
      value: 'diploma',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_program: {
      value: 'Diploma',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_stream: {
      value: 'Computer Engineering / IT',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_branch: {
      value: 'Computer Engineering',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_academic_year: {
      value: 'year_3',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_semester: {
      value: '5',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_latest_score: {
      value: 82,
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_score_type: {
      value: 'percentage',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_domicile_state: {
      value: 'gujarat',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_state: {
      value: 'Gujarat',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_district: {
      value: 'Ahmedabad',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_category: {
      value: 'sebc_obc',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_family_income: {
      value: 120000,
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_gender: {
      value: 'male',
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_is_hosteller: {
      value: false,
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
    field_is_disabled: {
      value: false,
      status: 'known',
      updatedAt: '2026-09-21T08:30:00.000Z',
      source: 'questionnaire',
    },
  },
  preferences: {
    language: 'en',
    theme: 'system',
  },
};

const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

/**
 * Checks if two ISO date strings or Date objects represent the same calendar day (local time).
 */
export function isSameDay(dateStrA?: string, dateStrB: Date = new Date()): boolean {
  if (!dateStrA) return false;
  try {
    const d1 = new Date(dateStrA);
    return (
      d1.getFullYear() === dateStrB.getFullYear() &&
      d1.getMonth() === dateStrB.getMonth() &&
      d1.getDate() === dateStrB.getDate()
    );
  } catch {
    return false;
  }
}

/**
 * Retrieves the StudentProfile associated with a specific user ID.
 */
export function getUserProfile(userId: string): StudentProfile | null {
  const storage = getLocalStorage();
  if (!storage) {
    return userId === 'demo-student-001' ? DEFAULT_DEMO_STUDENT_PROFILE : null;
  }

  try {
    // 1. Direct per-user profile
    const raw = storage.getItem(`${USER_PROFILE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.fields) {
        return parsed as StudentProfile;
      }
    }

    // 2. Default seeded demo student profile
    if (userId === 'demo-student-001') {
      storage.setItem(
        `${USER_PROFILE_PREFIX}demo-student-001`,
        JSON.stringify(DEFAULT_DEMO_STUDENT_PROFILE)
      );
      return DEFAULT_DEMO_STUDENT_PROFILE;
    }

    // 3. Fallback: check current active profile if user is currently signed in
    const session = getStoredDemoSession();
    if (session && session.userId === userId) {
      const activeRaw = storage.getItem(EDVORA_PROFILE_KEY);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        const candidate = parsed?.profile || parsed;
        if (candidate && typeof candidate === 'object' && candidate.fields) {
          return candidate as StudentProfile;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Computes profile completion percentage for a given profile.
 */
export function getProfileCompletionPercentage(profile: StudentProfile | null): number {
  if (!profile) return 0;
  try {
    const result = calculateProfileCompletion(profile, SCHOLARSHIPS_DATA);
    return result.percentage;
  } catch {
    return 0;
  }
}

/**
 * Returns all user records formatted safely for the Admin Panel.
 * Crucially, user passwords are NEVER present or exposed in this data structure.
 */
export function getAdminUserRecords(): AdminUserRecord[] {
  const safeRecords = getSafeAdminUserRecords();

  return safeRecords.map((record) => {
    const profile = getUserProfile(record.id);
    const profileCompletion = getProfileCompletionPercentage(profile);
    return {
      ...record,
      profileCompletion,
    };
  });
}

/**
 * Computes live user activity metrics from real user data.
 */
export function getAdminStats(): AdminStats {
  const records = getAdminUserRecords();
  const now = new Date();

  const totalUsers = records.length;
  const activeUsers = records.filter((u) => u.status === 'active').length;
  const newUsersToday = records.filter((u) => isSameDay(u.createdAt, now)).length;
  const loggedInToday = records.filter((u) => isSameDay(u.lastLoginAt, now)).length;

  return {
    totalUsers,
    activeUsers,
    newUsersToday,
    loggedInToday,
  };
}

/**
 * Subscribes to changes in user accounts, logins, or profile updates.
 */
export function subscribeToUserChanges(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback();
  };

  window.addEventListener('storage', handler);
  window.addEventListener('edvora:demo-users-change', handler);
  window.addEventListener('edvora:demo-auth-change', handler);
  window.addEventListener('edvora:profile-updated', handler);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('edvora:demo-users-change', handler);
    window.removeEventListener('edvora:demo-auth-change', handler);
    window.removeEventListener('edvora:profile-updated', handler);
  };
}
