import type { ProfileValueStatus } from './eligibility';

export type ProfileValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export interface StudentFieldValue {
  value: ProfileValue;

  status: ProfileValueStatus;

  updatedAt: string;

  source:
    | 'questionnaire'
    | 'profile'
    | 'import'
    | 'admin'
    | 'system';

  customText?: string;
}

export interface StudentProfile {
  id: string;

  profileType: 'guest' | 'registered';

  userId?: string;

  createdAt: string;

  updatedAt: string;

  lastActiveAt?: string;

  fields: Record<string, StudentFieldValue>;

  preferences: {
    language: 'en' | 'hi' | 'gu';

    theme: 'light' | 'dark' | 'system';

    desiredSupportTypes?: string[];
  };

  profileCompletion?: {
    percentage: number;

    knownFields: number;

    relevantFields: number;
  };
}
