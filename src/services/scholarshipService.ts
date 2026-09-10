import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import type {
  Scholarship,
  EducationLevel,
  SocialCategory,
  ScholarshipType,
  ApplicationStatus,
} from '../types/scholarship';

// Interface representing the database row in Supabase
export interface SupabaseScholarshipRow {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  provider: string;
  state: 'Gujarat' | 'All India';
  type: ScholarshipType;
  education_levels: EducationLevel[];
  courses: string[];
  categories: (SocialCategory | 'All')[];
  gender_eligibility: 'All' | 'Female' | 'Male';
  income_limit: number | null;
  minimum_percentage: number | null;
  year_eligibility: string[];
  special_conditions?: any;
  benefits: any;
  application_start: string;
  application_deadline: string;
  status: ApplicationStatus;
  documents: string[];
  description: string;
  who_can_apply: string[];
  how_to_apply_steps: string[];
  official_website: string;
  application_website: string;
  last_updated: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Transforms a Supabase database row into the application Scholarship model.
 */
export function mapRowToScholarship(row: SupabaseScholarshipRow): Scholarship {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    shortName: row.short_name,
    provider: row.provider,
    state: row.state,
    type: row.type,
    educationLevels: row.education_levels || [],
    courses: row.courses || ['All'],
    categories: row.categories || ['All'],
    genderEligibility: row.gender_eligibility || 'All',
    incomeLimit: row.income_limit !== null ? Number(row.income_limit) : null,
    minimumPercentage: row.minimum_percentage !== null ? Number(row.minimum_percentage) : null,
    yearEligibility: row.year_eligibility || ['All'],
    specialConditions: row.special_conditions || {},
    benefits: row.benefits || { amountDescription: '' },
    applicationStart: row.application_start || '',
    applicationDeadline: row.application_deadline || '',
    status: row.status || 'Open',
    documents: row.documents || [],
    description: row.description || '',
    whoCanApply: row.who_can_apply || [],
    howToApplySteps: row.how_to_apply_steps || [],
    officialWebsite: row.official_website || '',
    applicationWebsite: row.application_website || '',
    lastUpdated: row.last_updated || '',
    tags: row.tags || [],
  };
}

/**
 * Transforms an application Scholarship model into a Supabase database row format.
 */
export function mapScholarshipToRow(s: Scholarship): Omit<SupabaseScholarshipRow, 'created_at' | 'updated_at'> {
  return {
    id: s.id,
    slug: s.slug || s.id,
    name: s.name,
    short_name: s.shortName,
    provider: s.provider,
    state: s.state,
    type: s.type,
    education_levels: s.educationLevels,
    courses: s.courses,
    categories: s.categories,
    gender_eligibility: s.genderEligibility,
    income_limit: s.incomeLimit,
    minimum_percentage: s.minimumPercentage,
    year_eligibility: s.yearEligibility,
    special_conditions: s.specialConditions || {},
    benefits: s.benefits,
    application_start: s.applicationStart,
    application_deadline: s.applicationDeadline,
    status: s.status,
    documents: s.documents,
    description: s.description,
    who_can_apply: s.whoCanApply,
    how_to_apply_steps: s.howToApplySteps,
    official_website: s.officialWebsite,
    application_website: s.applicationWebsite,
    last_updated: s.lastUpdated,
    tags: s.tags,
  };
}

/**
 * Fetches all scholarships:
 * 1. Checks local SQLite database via `/api/scholarships`
 * 2. If SQLite is not active, checks Supabase if configured
 * 3. Falls back to static SCHOLARSHIPS_DATA
 */
export async function getScholarships(): Promise<{
  data: Scholarship[];
  source: 'sqlite' | 'supabase' | 'local_fallback';
  error?: string;
}> {
  // 1. Check local SQLite Database API
  try {
    const res = await fetch('/api/scholarships');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          data,
          source: 'sqlite',
        };
      }
    }
  } catch {
    // Local SQLite API unavailable, try Supabase or fallback
  }

  // 2. Check Supabase (if configured)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return {
          data: data.map((row: any) => mapRowToScholarship(row as SupabaseScholarshipRow)),
          source: 'supabase',
        };
      }
    } catch {
      // Supabase unavailable
    }
  }

  // 3. Fallback to bundled dataset
  return {
    data: SCHOLARSHIPS_DATA,
    source: 'local_fallback',
  };
}

/**
 * Fetches a single scholarship by ID or slug from SQLite -> Supabase -> Local.
 */
export async function getScholarshipByIdOrSlug(idOrSlug: string): Promise<Scholarship | null> {
  // 1. Try local SQLite
  try {
    const res = await fetch(`/api/scholarships/${encodeURIComponent(idOrSlug)}`);
    if (res.ok) {
      const item = await res.json();
      if (item && item.id) return item as Scholarship;
    }
  } catch {
    // Fallback
  }

  // 2. Try Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (!error && data) {
        return mapRowToScholarship(data as SupabaseScholarshipRow);
      }
    } catch {
      // Fallback
    }
  }

  // 3. Static fallback
  return (
    SCHOLARSHIPS_DATA.find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null
  );
}
