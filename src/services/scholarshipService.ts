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
    isVerified: (row as any).is_verified !== false && (row as any).is_verified !== 0,
    isFeatured: (row as any).is_featured === true || (row as any).is_featured === 1,
    createdAt: row.created_at,
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

/**
 * Admin API: Authenticate with administrator passphrase
 */
export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

/**
 * Admin API: Fetch real dashboard statistics
 */
export async function getAdminStats(token: string): Promise<any> {
  const res = await fetch('/api/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to load admin stats');
  }
  return res.json();
}

/**
 * Admin API: Fetch activity audit log
 */
export async function getAdminActivity(token: string): Promise<any[]> {
  const res = await fetch('/api/admin/activity', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to load activity logs');
  }
  return res.json();
}

/**
 * Admin API: Fetch category counts
 */
export async function getAdminCategories(token: string): Promise<any> {
  const res = await fetch('/api/admin/categories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to load categories');
  }
  return res.json();
}

/**
 * Admin API: Insert or update scholarship in SQLite
 */
export async function saveScholarship(scholarship: Scholarship, token: string): Promise<boolean> {
  const res = await fetch('/api/scholarships', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scholarship),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to save scholarship');
  }
  return true;
}

/**
 * Admin API: Delete scholarship from SQLite
 */
export async function deleteScholarship(id: string, token: string): Promise<boolean> {
  const res = await fetch(`/api/scholarships/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete scholarship');
  }
  return true;
}

/**
 * Admin API: Toggle Featured status
 */
export async function toggleFeatureScholarship(id: string, isFeatured: boolean, token: string): Promise<Scholarship> {
  const res = await fetch(`/api/scholarships/${encodeURIComponent(id)}/toggle-feature`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isFeatured }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to toggle featured status');
  }
  return res.json();
}

/**
 * Admin API: Toggle Verified status
 */
export async function toggleVerifyScholarship(id: string, isVerified: boolean, token: string): Promise<Scholarship> {
  const res = await fetch(`/api/scholarships/${encodeURIComponent(id)}/toggle-verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isVerified }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to toggle verified status');
  }
  return res.json();
}

