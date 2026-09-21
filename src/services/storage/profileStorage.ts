import type { StudentProfile } from '../../types/studentProfile';

export interface ProfileStorage {
  getProfile(userId?: string): Promise<StudentProfile | null>;
  saveProfile(profile: StudentProfile): Promise<void>;
  updateProfile(profile: StudentProfile): Promise<void>;
  clearProfile(userId?: string): Promise<void>;
}
