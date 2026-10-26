import type { EducationLevel } from '../types/scholarship';

export const STREAMS_BY_EDUCATION: Record<EducationLevel, string[]> = {
  School: [
    'Science (PCM / PCB)',
    'Commerce',
    'Arts / Humanities',
    'Vocational / Technical',
    'General Schooling (Class 9-10)',
    'Other',
  ],
  Diploma: [
    'Computer Engineering / IT',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Chemical Engineering',
    'Automobile Engineering',
    'Other Diploma Stream',
  ],
  ITI: [
    'Electrician',
    'Fitter',
    'COPA (Computer Operator & Programming Assistant)',
    'Wireman',
    'Welder',
    'Mechanic (Motor Vehicle / Diesel)',
    'Turner / Machinist',
    'Other ITI Trade',
  ],
  Undergraduate: [
    'Engineering & Technology (B.E. / B.Tech)',
    'Medical & Dental (MBBS / BDS / BAMS / BHMS)',
    'Pharmacy (B.Pharm)',
    'Nursing & Physiotherapy',
    'Computer Applications (BCA / B.Sc IT)',
    'Pure Sciences (B.Sc)',
    'Commerce & Management (B.Com / BBA)',
    'Arts & Humanities (B.A.)',
    'Law (LL.B / Integrated Law)',
    'Architecture & Design (B.Arch / B.Des)',
    'Other Undergraduate Stream',
  ],
  Postgraduate: [
    'Engineering & Technology (M.E. / M.Tech)',
    'Management Studies (MBA / PGDM)',
    'Computer Applications (MCA / M.Sc IT)',
    'Medical Specialties (MD / MS / MDS)',
    'Pharmacy (M.Pharm)',
    'Sciences (M.Sc)',
    'Commerce (M.Com)',
    'Arts & Social Sciences (M.A. / MSW)',
    'Law (LL.M)',
    'Other Postgraduate Stream',
  ],
  PhD: [
    'Engineering & Technology',
    'Science & Mathematics',
    'Pharmacy & Health Sciences',
    'Humanities & Social Sciences',
    'Commerce & Management',
    'Interdisciplinary Research',
    'Other PhD Discipline',
  ],
  Other: [
    'Certificate / Vocational Course',
    'Preparatory / Foundation Studies',
    'Other Professional Course',
  ],
};

/**
 * Unique list of all specific streams across all education levels.
 */
export const ALL_CANONICAL_STREAMS: string[] = Array.from(
  new Set(Object.values(STREAMS_BY_EDUCATION).flat())
);

/**
 * Legacy broad category options previously used in static definitions.
 */
export const LEGACY_STREAM_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'engineering_technology', label: 'Engineering & Technology' },
  { value: 'medicine_health_sciences', label: 'Medicine & Health Sciences' },
  { value: 'pure_applied_sciences', label: 'Pure & Applied Sciences' },
  { value: 'commerce_management', label: 'Commerce & Management' },
  { value: 'arts_humanities', label: 'Arts & Humanities' },
  { value: 'law_legal_studies', label: 'Law & Legal Studies' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'agriculture_allied', label: 'Agriculture & Allied Sciences' },
  { value: 'polytechnic_diploma', label: 'Polytechnic / Diploma' },
  { value: 'vocational_iti', label: 'Vocational / ITI' },
  { value: 'general', label: 'General / School Education' },
  { value: 'other', label: 'Other' },
];

/**
 * Mapping dictionary from legacy snake_case IDs and common aliases to canonical display strings.
 */
export const LEGACY_STREAM_MAP: Record<string, string> = {
  engineering_technology: 'Engineering & Technology',
  engineering: 'Engineering & Technology',
  medicine_health_sciences: 'Medicine & Health Sciences',
  medicine: 'Medicine & Health Sciences',
  medical: 'Medical & Dental (MBBS / BDS / BAMS / BHMS)',
  pure_applied_sciences: 'Pure Sciences (B.Sc)',
  sciences: 'Sciences (M.Sc)',
  science: 'Science (PCM / PCB)',
  commerce_management: 'Commerce & Management (B.Com / BBA)',
  commerce: 'Commerce',
  management: 'Management Studies (MBA / PGDM)',
  arts_humanities: 'Arts & Humanities (B.A.)',
  arts: 'Arts / Humanities',
  humanities: 'Arts & Humanities (B.A.)',
  law_legal_studies: 'Law (LL.B / Integrated Law)',
  law: 'Law (LL.B / Integrated Law)',
  pharmacy: 'Pharmacy (B.Pharm)',
  agriculture_allied: 'Agriculture & Allied Sciences',
  polytechnic_diploma: 'Polytechnic / Diploma',
  diploma: 'Diploma',
  vocational_iti: 'Vocational / ITI',
  iti: 'ITI',
  general: 'General Schooling (Class 9-10)',
  other: 'Other',
  // Common shorthands
  'computer engineering': 'Computer Engineering / IT',
  it: 'Computer Engineering / IT',
  'computer science': 'Computer Engineering / IT',
  'mechanical engineering': 'Mechanical Engineering',
  'electrical engineering': 'Electrical Engineering',
  'civil engineering': 'Civil Engineering',
  electronics: 'Electronics & Communication',
};

/**
 * Aggregated options for the field_stream definition in fields.ts.
 * Contains all streams from STREAMS_BY_EDUCATION as well as legacy options for backwards compatibility.
 */
export const ALL_STREAM_FIELD_OPTIONS: Array<{ value: string; label: string }> = [
  ...ALL_CANONICAL_STREAMS.map((stream) => ({ value: stream, label: stream })),
  ...LEGACY_STREAM_OPTIONS.filter((opt) => !ALL_CANONICAL_STREAMS.includes(opt.value)),
];

/**
 * Checks if a given stream string is a valid recognized stream.
 * Valid options include:
 * - Any stream from STREAMS_BY_EDUCATION (e.g. 'Computer Engineering / IT', 'Mechanical Engineering')
 * - Any legacy option value (e.g. 'engineering_technology')
 * - Any legacy option label (e.g. 'Engineering & Technology')
 * - Any recognized legacy/shorthand token in LEGACY_STREAM_MAP
 */
export function isKnownStudyStream(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  const clean = val.trim();
  if (!clean) return false;
  const lower = clean.toLowerCase();

  // 1. Direct match in ALL_CANONICAL_STREAMS (case-insensitive)
  if (ALL_CANONICAL_STREAMS.some((s) => s.toLowerCase() === lower)) {
    return true;
  }

  // 2. Direct match in LEGACY_STREAM_OPTIONS value or label
  if (
    LEGACY_STREAM_OPTIONS.some(
      (opt) => opt.value.toLowerCase() === lower || opt.label.toLowerCase() === lower
    )
  ) {
    return true;
  }

  // 3. Match in LEGACY_STREAM_MAP
  if (LEGACY_STREAM_MAP[lower] !== undefined) {
    return true;
  }

  return false;
}

/**
 * Normalizes a stream value into its canonical display string.
 * If the value is a known legacy ID, maps it to the standard label.
 * If it matches a canonical stream with different casing, returns the exact canonical string.
 */
export function normalizeStudyStream(val: string): string {
  if (!val || typeof val !== 'string') return '';
  const clean = val.trim();
  const lower = clean.toLowerCase();

  // 1. Check if matches canonical stream exactly or case-insensitively
  const canonicalMatch = ALL_CANONICAL_STREAMS.find((s) => s.toLowerCase() === lower);
  if (canonicalMatch) return canonicalMatch;

  // 2. Check legacy options value -> label
  const legacyOpt = LEGACY_STREAM_OPTIONS.find((opt) => opt.value.toLowerCase() === lower);
  if (legacyOpt) return legacyOpt.label;

  // 3. Check legacy mapping dictionary
  if (LEGACY_STREAM_MAP[lower]) return LEGACY_STREAM_MAP[lower];

  return clean;
}

/**
 * Evaluates whether a student's study stream satisfies the scholarship's courses requirement.
 */
export function isStreamEligibleForScholarship(
  scholarshipCourses: string[],
  studentStream?: string
): { status: 'matched' | 'warning' | 'unmatched'; detail: string } {
  if (scholarshipCourses.includes('All')) {
    return {
      status: 'matched',
      detail: 'Open to all course streams within eligible education levels.',
    };
  }

  if (!studentStream) {
    return {
      status: 'unmatched',
      detail: `Restricted to specified courses (e.g. ${scholarshipCourses.slice(0, 2).join(', ')}). No stream provided.`,
    };
  }

  // 1. Direct exact match
  if (scholarshipCourses.includes(studentStream)) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) is directly covered.`,
    };
  }

  // 2. Case-insensitive match
  const lowerStream = studentStream.trim().toLowerCase();
  const caseMatch = scholarshipCourses.find((c) => c.toLowerCase() === lowerStream);
  if (caseMatch) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) is directly covered.`,
    };
  }

  // 3. Legacy / broad normalization match
  const normalized = normalizeStudyStream(studentStream);
  if (scholarshipCourses.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) is covered under ${normalized}.`,
    };
  }

  // 4. Broad category alignments for legacy saved profiles
  const isEngineeringCategory =
    lowerStream.includes('engineering') || lowerStream === 'engineering_technology';
  if (
    isEngineeringCategory &&
    scholarshipCourses.some((c) => c.toLowerCase().includes('engineering'))
  ) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) matches eligible engineering courses.`,
    };
  }

  const isMedicalCategory =
    lowerStream.includes('medic') ||
    lowerStream === 'medicine_health_sciences' ||
    lowerStream.includes('dental');
  if (
    isMedicalCategory &&
    scholarshipCourses.some((c) => c.toLowerCase().includes('medical'))
  ) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) matches eligible medical/health courses.`,
    };
  }

  const isScienceCategory =
    lowerStream.includes('science') || lowerStream === 'pure_applied_sciences';
  if (
    isScienceCategory &&
    scholarshipCourses.some((c) => c.toLowerCase().includes('science'))
  ) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) matches eligible science courses.`,
    };
  }

  const isCommerceCategory =
    lowerStream.includes('commerce') ||
    lowerStream.includes('management') ||
    lowerStream === 'commerce_management';
  if (
    isCommerceCategory &&
    scholarshipCourses.some(
      (c) => c.toLowerCase().includes('commerce') || c.toLowerCase().includes('management')
    )
  ) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) matches eligible commerce/management courses.`,
    };
  }

  const isArtsCategory =
    lowerStream.includes('arts') ||
    lowerStream.includes('humanities') ||
    lowerStream === 'arts_humanities';
  if (
    isArtsCategory &&
    scholarshipCourses.some(
      (c) => c.toLowerCase().includes('arts') || c.toLowerCase().includes('humanities')
    )
  ) {
    return {
      status: 'matched',
      detail: `Your stream (${studentStream}) matches eligible arts/humanities courses.`,
    };
  }

  // 5. Other / unlisted stream requires verification
  if (lowerStream.includes('other')) {
    return {
      status: 'warning',
      detail: 'Selected course stream requires verification against approved institution programs.',
    };
  }

  return {
    status: 'unmatched',
    detail: `Restricted to specified courses (e.g. ${scholarshipCourses.slice(0, 2).join(', ')}). Your stream: ${studentStream}.`,
  };
}
