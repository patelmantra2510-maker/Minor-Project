import { getSupabaseClient } from '../supabaseClient';
import type { StudentProfile } from '../../types/studentProfile';
import type { ProfileStorage } from './profileStorage';

export class CloudProfileStorage implements ProfileStorage {
  async getProfile(userId?: string): Promise<StudentProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;

      const profile: StudentProfile = {
        id: data.user_id,
        profileType: 'registered',
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
        fields: data.profile_data?.fields || {},
        preferences: data.preferences || { language: 'en', theme: 'light' },
        profileCompletion: data.profile_data?.profileCompletion,
      };

      return profile;
    } catch (err) {
      console.warn('Failed to retrieve cloud profile:', err);
      return null;
    }
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !profile.id) return;

    try {
      const payload = {
        user_id: profile.id,
        profile_data: {
          fields: profile.fields,
          profileCompletion: profile.profileCompletion,
        },
        preferences: profile.preferences,
        updated_at: new Date().toISOString(),
      };

      await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' });
    } catch (err) {
      console.warn('Failed to upsert cloud profile:', err);
    }
  }

  async updateProfile(profile: StudentProfile): Promise<void> {
    return this.saveProfile(profile);
  }

  async clearProfile(userId?: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) return;

    try {
      await supabase.from('profiles').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Failed to clear cloud profile:', err);
    }
  }
}

export const cloudProfileStorage = new CloudProfileStorage();
