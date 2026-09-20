import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { StudentProfile, StudentFieldValue } from '../types/studentProfile';
import type { ProfileValueStatus } from '../types/eligibility';
import { profileStorage, EDVORA_PROFILE_KEY } from '../services/profile/profileStorage';
import {
  calculateProfileCompletion,
  type ProfileCompletionResult,
} from '../engine/profileCompletion';
import { invalidateDependentFields } from '../engine/dynamicQuestionEngine';
import { useScholarships } from './ScholarshipContext';
import { useLanguage } from './LanguageContext';

export interface StudentProfileContextType {
  profile: StudentProfile | null;
  isLoading: boolean;
  profileCompletion: ProfileCompletionResult;
  hasProfile: boolean;
  hasPopulatedFields: boolean;
  saveProfile: (profile: StudentProfile) => Promise<void>;
  updateField: (
    fieldId: string,
    value: any,
    status?: ProfileValueStatus,
    customText?: string,
    source?: 'questionnaire' | 'profile' | 'import' | 'admin' | 'system'
  ) => Promise<StudentProfile>;
  updateFields: (
    fieldsMap: Record<string, StudentFieldValue>,
    invalidateDependents?: boolean
  ) => Promise<StudentProfile>;
  createDefaultProfile: () => Promise<StudentProfile>;
  refreshProfile: () => Promise<void>;
  resetProfile: () => Promise<void>;
}

const StudentProfileContext = createContext<StudentProfileContextType | undefined>(undefined);

export const StudentProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const { scholarships } = useScholarships();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Refresh profile from persistent storage
  const refreshProfile = useCallback(async () => {
    try {
      const loaded = await profileStorage.getProfile();
      setProfile(loaded);
    } catch (err) {
      console.warn('[StudentProfileContext] Error refreshing profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Multi-tab synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EDVORA_PROFILE_KEY || e.key === null) {
        refreshProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshProfile]);

  // Compute live profile completion percentage
  const profileCompletion = useMemo<ProfileCompletionResult>(() => {
    if (!profile) {
      return { percentage: 0, knownFields: 0, relevantFields: 10 };
    }
    return calculateProfileCompletion(profile, scholarships);
  }, [profile, scholarships]);

  // Check if profile has any answered fields
  const hasPopulatedFields = useMemo<boolean>(() => {
    if (!profile || !profile.fields) return false;
    return Object.values(profile.fields).some(
      (f) =>
        f.status === 'prefer_not_to_say' ||
        (f.value !== null && f.value !== undefined && f.value !== '')
    );
  }, [profile]);

  // Create default guest profile
  const createDefaultProfile = useCallback(async (): Promise<StudentProfile> => {
    const now = new Date().toISOString();
    const newProfile: StudentProfile = {
      id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      profileType: 'guest',
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      fields: {},
      preferences: {
        language: language || 'en',
        theme: 'system',
      },
    };

    await profileStorage.saveProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  }, [language]);

  // Save full profile object
  const saveProfile = useCallback(async (newProfile: StudentProfile): Promise<void> => {
    const updated: StudentProfile = {
      ...newProfile,
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    await profileStorage.saveProfile(updated);
    setProfile(updated);
  }, []);

  // Update a single field
  const updateField = useCallback(
    async (
      fieldId: string,
      value: any,
      status: ProfileValueStatus = 'known',
      customText?: string,
      source: 'questionnaire' | 'profile' | 'import' | 'admin' | 'system' = 'profile'
    ): Promise<StudentProfile> => {
      const now = new Date().toISOString();
      const currentProfile = profile || (await createDefaultProfile());

      const newFieldValue: StudentFieldValue = {
        value: status === 'known' ? value : null,
        status,
        customText: status === 'custom' ? customText?.trim() : undefined,
        updatedAt: now,
        source,
      };

      const updatedFields = {
        ...currentProfile.fields,
        [fieldId]: newFieldValue,
      };

      const cleanedProfile = invalidateDependentFields({
        ...currentProfile,
        updatedAt: now,
        lastActiveAt: now,
        fields: updatedFields,
      });

      await profileStorage.saveProfile(cleanedProfile);
      setProfile(cleanedProfile);
      return cleanedProfile;
    },
    [profile, createDefaultProfile]
  );

  // Update multiple fields simultaneously with optional dependency invalidation
  const updateFields = useCallback(
    async (
      fieldsMap: Record<string, StudentFieldValue>,
      invalidateDependents = true
    ): Promise<StudentProfile> => {
      const now = new Date().toISOString();
      const currentProfile = profile || (await createDefaultProfile());

      const mergedFields = {
        ...currentProfile.fields,
        ...fieldsMap,
      };

      let nextProfile: StudentProfile = {
        ...currentProfile,
        updatedAt: now,
        lastActiveAt: now,
        fields: mergedFields,
      };

      if (invalidateDependents) {
        nextProfile = invalidateDependentFields(nextProfile);
      }

      await profileStorage.saveProfile(nextProfile);
      setProfile(nextProfile);
      return nextProfile;
    },
    [profile, createDefaultProfile]
  );

  // Reset profile (clears profile & questionnaire without touching saved scholarships, compare lists, or app preferences)
  const resetProfile = useCallback(async (): Promise<void> => {
    await profileStorage.clearProfile();
    setProfile(null);
  }, []);

  const value: StudentProfileContextType = {
    profile,
    isLoading,
    profileCompletion,
    hasProfile: profile !== null,
    hasPopulatedFields,
    saveProfile,
    updateField,
    updateFields,
    createDefaultProfile,
    refreshProfile,
    resetProfile,
  };

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
};

export const useStudentProfile = (): StudentProfileContextType => {
  const context = useContext(StudentProfileContext);
  if (!context) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider');
  }
  return context;
};
