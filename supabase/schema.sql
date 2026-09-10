-- ==============================================================================
-- EDVORA - SCHOLARSHIP DATABASE SCHEMA FOR SUPABASE (PostgreSQL)
-- Run this SQL in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('Gujarat', 'All India')),
  type TEXT NOT NULL,
  education_levels TEXT[] NOT NULL DEFAULT '{}',
  courses TEXT[] NOT NULL DEFAULT '{}',
  categories TEXT[] NOT NULL DEFAULT '{}',
  gender_eligibility TEXT NOT NULL DEFAULT 'All',
  income_limit NUMERIC,
  minimum_percentage NUMERIC,
  year_eligibility TEXT[] NOT NULL DEFAULT '{}',
  special_conditions JSONB DEFAULT '{}'::jsonb,
  benefits JSONB NOT NULL DEFAULT '{}'::jsonb,
  application_start TEXT NOT NULL,
  application_deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  documents TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  who_can_apply TEXT[] NOT NULL DEFAULT '{}',
  how_to_apply_steps TEXT[] NOT NULL DEFAULT '{}',
  official_website TEXT NOT NULL,
  application_website TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast query and filtering
CREATE INDEX IF NOT EXISTS idx_scholarships_slug ON public.scholarships(slug);
CREATE INDEX IF NOT EXISTS idx_scholarships_state ON public.scholarships(state);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON public.scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_levels ON public.scholarships USING GIN (education_levels);
CREATE INDEX IF NOT EXISTS idx_scholarships_categories ON public.scholarships USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_scholarships_courses ON public.scholarships USING GIN (courses);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Anyone (authenticated or unauthenticated) can view scholarships
DROP POLICY IF EXISTS "Public can read scholarships" ON public.scholarships;
CREATE POLICY "Public can read scholarships"
  ON public.scholarships
  FOR SELECT
  USING (true);

-- 5. RLS Policy: Service role or Authenticated users can insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can insert or update scholarships" ON public.scholarships;
CREATE POLICY "Authenticated users can insert or update scholarships"
  ON public.scholarships
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
