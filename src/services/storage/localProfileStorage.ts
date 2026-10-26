import type { StudentProfile } from '../../types/studentProfile';
import type { ProfileStorage } from './profileStorage';

const LOCAL_STORAGE_KEY = 'edvora_student_profile_v1';
const LEGACY_STORAGE_KEY = 'vidyasetu_student_profile_v1';

export class LocalProfileStorage implements ProfileStorage {
  async getProfile(userId?: string): Promise<StudentProfile | null> {
    try {
      const key = userId ? `edvora_profile_${userId}` : LOCAL_STORAGE_KEY;
      const data = localStorage.getItem(key) || (!userId ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
      if (!data) return null;
      const parsed = JSON.parse(data);
      const profile = parsed?.profile || parsed;
      return profile as StudentProfile;
    } catch {
      return null;
    }
  }

  async loadProfile(userId?: string): Promise<StudentProfile | null> {
    return this.getProfile(userId);
  }

  async saveProfile(profile: StudentProfile, userId?: string): Promise<void> {
    try {
      const targetUserId = userId || (profile.profileType === 'registered' && profile.userId ? profile.userId : undefined);
      const toSave: StudentProfile = {
        ...profile,
        profileType: (targetUserId || userId) ? 'registered' : (profile.profileType || 'guest'),
        userId: targetUserId,
        updatedAt: new Date().toISOString(),
      };
      if (userId) {
        localStorage.setItem(`edvora_profile_${userId}`, JSON.stringify(toSave));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
        if (targetUserId) {
          localStorage.setItem(`edvora_profile_${targetUserId}`, JSON.stringify(toSave));
        }
      }
    } catch (err) {
      console.warn('Failed to save profile to localStorage:', err);
    }
  }

  async updateProfile(profile: StudentProfile, userId?: string): Promise<void> {
    return this.saveProfile(profile, userId);
  }

  async clearProfile(userId?: string): Promise<void> {
    try {
      if (userId) {
        localStorage.removeItem(`edvora_profile_${userId}`);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Failed to clear local profile:', err);
    }
  }
}

export const localProfileStorage = new LocalProfileStorage();
