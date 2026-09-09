export type EducationLevel =
  | 'School'
  | 'Diploma'
  | 'ITI'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD'
  | 'Other';

export type SocialCategory =
  | 'General'
  | 'SC'
  | 'ST'
  | 'SEBC/OBC'
  | 'EWS'
  | 'Other'
  | 'Prefer not to say';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type StateLocation = 'Gujarat' | 'Other Indian State';

export interface StudentAnswers {
  location: StateLocation;
  educationLevel: EducationLevel;
  stream: string;
  currentYear: string;
  category: SocialCategory;
  gender: Gender;
  annualIncome: number;
  academicPercentage: number;
  isDisability: boolean;
  disabilityPercentage?: number;
  isOrphan: boolean;
  isDefenceWard: boolean;
  isMinority: boolean;
}

export type ApplicationStatus = 'Open' | 'Opening Soon' | 'Closed';

export type ScholarshipType =
  | 'Merit'
  | 'Need-based'
  | 'Government'
  | 'Private'
  | 'Technical'
  | 'Category-based'
  | 'Special';

export interface ScholarshipSpecialConditions {
  disabilityRequired?: boolean;
  minDisabilityPercentage?: number;
  orphanRequired?: boolean;
  defenceWardRequired?: boolean;
  minorityRequired?: boolean;
  requiresVerification?: boolean;
  verificationNote?: string;
}

export interface ScholarshipBenefits {
  amountDescription: string;
  tuitionFeeCoverage?: string;
  bookAllowance?: string;
  hostelAllowance?: string;
  maxAnnualAmount?: number;
}

export interface Scholarship {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  provider: string;
  state: 'Gujarat' | 'All India';
  type: ScholarshipType;
  educationLevels: EducationLevel[];
  courses: string[]; // e.g. ['All'] or specific streams
  categories: (SocialCategory | 'All')[];
  genderEligibility: 'All' | 'Female' | 'Male';
  incomeLimit: number | null; // null if no ceiling
  minimumPercentage: number | null; // null if no minimum
  yearEligibility: string[]; // ['All'] or ['1st Year', '2nd Year', etc.]
  specialConditions?: ScholarshipSpecialConditions;
  benefits: ScholarshipBenefits;
  applicationStart: string;
  applicationDeadline: string; // ISO date 'YYYY-MM-DD'
  status: ApplicationStatus;
  documents: string[];
  description: string;
  whoCanApply: string[];
  howToApplySteps: string[];
  officialWebsite: string;
  applicationWebsite: string;
  lastUpdated: string;
  tags: string[];
}

export type MatchStatus = 'strong_match' | 'possible_match' | 'not_eligible';

export interface RuleCheck {
  ruleId: string;
  label: string;
  status: 'matched' | 'unmatched' | 'warning';
  detail: string;
}

export interface MatchResult {
  scholarshipId: string;
  scholarship: Scholarship;
  status: MatchStatus;
  checks: RuleCheck[];
  summaryMessage: string;
}
