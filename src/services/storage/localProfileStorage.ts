import type { StudentProfile } from '../../types/studentProfile';
import type { ProfileStorage } from './profileStorage';

const LOCAL_STORAGE_KEY = 'edvora_student_profile_v1';
const LEGACY_STORAGE_KEY = 'vidyasetu_student_profile_v1';

export class LocalProfileStorage implements ProfileStorage {
  async getProfile(): Promise<StudentProfile | null> {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as StudentProfile;
      return parsed;
    } catch {
      return null;
    }
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    try {
      const toSave: StudentProfile = {
        ...profile,
        profileType: 'guest',
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.warn('Failed to save profile to localStorage:', err);
    }
  }

  async updateProfile(profile: StudentProfile): Promise<void> {
    return this.saveProfile(profile);
  }

  async clearProfile(): Promise<void> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear local profile:', err);
    }
  }
}

export const localProfileStorage = new LocalProfileStorage();
