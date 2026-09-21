import React from 'react';
import type { AdminUserRecord } from '../../services/adminUserService';
import type { StudentProfile } from '../../types/studentProfile';
import {
  X,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  IndianRupee,
  Award,
} from 'lucide-react';

interface UserDetailModalProps {
  user: AdminUserRecord | null;
  profile: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDateTime(isoStr?: string): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}

function formatFieldValue(key: string, val: any): string {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';

  // Currency / Income
  if (key.includes('income')) {
    const num = Number(val);
    if (!isNaN(num)) {
      if (num >= 100000) {
        return `₹${(num / 100000).toFixed(1)} Lakh (₹${num.toLocaleString('en-IN')})`;
      }
      return `₹${num.toLocaleString('en-IN')}`;
    }
  }

  // Score
  if (key.includes('score') || key.includes('percentage')) {
    const num = Number(val);
    if (!isNaN(num)) {
      return `${num}%`;
    }
  }

  // Common coded values
  const labels: Record<string, string> = {
    diploma: 'Diploma',
    undergraduate: 'Undergraduate (UG)',
    postgraduate: 'Postgraduate (PG)',
    school: 'School (Class 1-12)',
    phd: 'PhD / Doctoral',
    iti: 'ITI',
    sebc_obc: 'SEBC / OBC',
    sc: 'Scheduled Caste (SC)',
    st: 'Scheduled Tribe (ST)',
    general: 'General (Open)',
    ews: 'Economically Weaker Section (EWS)',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    year_1: '1st Year',
    year_2: '2nd Year',
    year_3: '3rd Year',
    year_4: '4th Year',
    year_5: '5th Year',
    sem_1: 'Semester 1',
    sem_2: 'Semester 2',
    sem_3: 'Semester 3',
    sem_4: 'Semester 4',
    sem_5: 'Semester 5',
    sem_6: 'Semester 6',
    sem_7: 'Semester 7',
    sem_8: 'Semester 8',
    gujarat: 'Gujarat',
    government: 'Government Hostel',
    private: 'Private Hostel',
    college_run: 'College Campus Hostel',
  };

  if (typeof val === 'string' && labels[val.toLowerCase()]) {
    return labels[val.toLowerCase()];
  }

  if (Array.isArray(val)) {
    return val.join(', ');
  }

  return String(val);
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  const fields = profile?.fields || {};

  // Extract existing profile attributes
  const getVal = (key: string) => {
    const f = fields[key];
    if (!f || f.status === 'unknown' || f.value === null || f.value === undefined || f.value === '') {
      return null;
    }
    return f.customText || f.value;
  };

  const eduLevel = getVal('field_education_level');
  const program = getVal('field_program');
  const stream = getVal('field_stream');
  const branch = getVal('field_branch');
  const academicYear = getVal('field_academic_year') || getVal('field_semester');
  const institution = getVal('field_institution');
  const institutionState = getVal('field_institution_state');

  const latestScore = getVal('field_latest_score') || getVal('field_class_12_percentage') || getVal('field_class_10_percentage');
  const scoreType = getVal('field_score_type');

  const state = getVal('field_state') || getVal('field_domicile_state');
  const district = getVal('field_district');

  const category = getVal('field_category');
  const subcaste = getVal('field_subcaste');
  const familyIncome = getVal('field_family_income');

  const isHosteller = getVal('field_is_hosteller');
  const hostelType = getVal('field_hostel_type');
  const isDisabled = getVal('field_is_disabled');
  const disabilityPct = getVal('field_disability_percentage');
  const disabilityType = getVal('field_disability_type');
  const minorityCommunity = getVal('field_minority_community');
  const isOrphan = getVal('field_is_orphan');
  const isSingleParent = getVal('field_is_single_parent');
  const isDefenceWard = getVal('field_is_defence_ward');
  const hasCasteCert = getVal('field_has_caste_certificate');

  const hasAnyProfileData =
    eduLevel !== null ||
    stream !== null ||
    branch !== null ||
    category !== null ||
    familyIncome !== null ||
    state !== null ||
    latestScore !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#101D19] border border-stone-200 dark:border-emerald-950 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-emerald-950/60 flex items-start justify-between gap-4 bg-stone-50/50 dark:bg-[#0A1613]/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-editorial text-stone-900 dark:text-white">
                  {user.name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-emerald-950 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* SECTION 1: ACCOUNT INFORMATION */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Account Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50/80 dark:bg-[#0A1613]/80 p-4 rounded-2xl border border-stone-200/60 dark:border-emerald-950/60">
              <div>
                <span className="text-[11px] text-stone-400 block">Full Name</span>
                <span className="font-semibold text-stone-900 dark:text-white">{user.name}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Email Address</span>
                <span className="font-semibold text-stone-900 dark:text-white font-mono text-[11px]">
                  {user.email}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">User ID</span>
                <span className="font-mono text-[10px] text-stone-600 dark:text-stone-300">
                  {user.id}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Account Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                  {user.status}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Account Created</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {formatDateTime(user.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Last Login</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {formatDateTime(user.lastLoginAt)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Last Active</span>
                <span className="text-stone-800 dark:text-stone-200">
                  {formatDateTime(user.lastActiveAt)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">Total Logins</span>
                <span className="font-bold font-mono text-stone-900 dark:text-white">
                  {user.loginCount} {user.loginCount === 1 ? 'session' : 'sessions'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[11px] text-stone-400 block">Authentication Method</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{user.authMethod}</span>
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: SECURITY & PASSWORD STATUS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Security & Credentials</span>
            </h3>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-white">Password Status:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{user.passwordConfigured ? 'Set' : 'Not Set'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  Protected credential. Plaintext password inspection is strictly disabled in administrative views.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: STUDENT PROFILE INFORMATION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student Profile Details</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400">Profile Readiness:</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {user.profileCompletion}%
                </span>
              </div>
            </div>

            {/* Profile Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-emerald-950/50 h-2 rounded-full overflow-hidden mb-4 border border-stone-200/50 dark:border-emerald-900/40">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, user.profileCompletion))}%` }}
              />
            </div>

            {!hasAnyProfileData ? (
              <div className="p-6 rounded-2xl bg-stone-50 dark:bg-[#0A1613]/50 border border-stone-200/60 dark:border-emerald-950/60 text-center text-stone-400 space-y-1">
                <BookOpen className="w-6 h-6 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="font-medium text-stone-600 dark:text-stone-300">
                  No student profile completed yet.
                </p>
                <p className="text-[11px]">
                  This account has registered but has not yet provided academic or eligibility questionnaire details.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Academic & Education */}
                <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#0A1613]/80 border border-stone-200/60 dark:border-emerald-950/60 space-y-2.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Education & Course</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                    {eduLevel !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Education Level</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_education_level', eduLevel)}
                        </span>
                      </div>
                    )}

                    {program !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Program</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_program', program)}
                        </span>
                      </div>
                    )}

                    {stream !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Stream / Discipline</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_stream', stream)}
                        </span>
                      </div>
                    )}

                    {branch !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Branch / Specialization</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_branch', branch)}
                        </span>
                      </div>
                    )}

                    {academicYear !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Current Year / Sem</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_academic_year', academicYear)}
                        </span>
                      </div>
                    )}

                    {institution !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">Institution</span>
                        <span className="font-semibold text-stone-900 dark:text-white truncate block">
                          {formatFieldValue('field_institution', institution)}
                        </span>
                      </div>
                    )}

                    {institutionState !== null && (
                      <div>
                        <span className="text-stone-400 block text-[10px]">College State</span>
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {formatFieldValue('field_institution_state', institutionState)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance & Academic Score */}
                {latestScore !== null && (
                  <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#0A1613]/80 border border-stone-200/60 dark:border-emerald-950/60 space-y-2.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>Academic Performance</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Latest Score</span>
                        <span className="font-bold text-stone-900 dark:text-white text-xs">
                          {formatFieldValue('field_latest_score', latestScore)}
                        </span>
                      </div>

                      {scoreType !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Score Metric</span>
                          <span className="font-semibold text-stone-900 dark:text-white capitalize">
                            {formatFieldValue('field_score_type', scoreType)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social, Category & Financial */}
                {(category !== null || familyIncome !== null || state !== null) && (
                  <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#0A1613]/80 border border-stone-200/60 dark:border-emerald-950/60 space-y-2.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      <span>Socio-Economic & Location</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                      {category !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Caste Category</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_category', category)}
                          </span>
                        </div>
                      )}

                      {subcaste !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Sub-caste</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_subcaste', subcaste)}
                          </span>
                        </div>
                      )}

                      {familyIncome !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Family Annual Income</span>
                          <span className="font-bold text-stone-900 dark:text-white">
                            {formatFieldValue('field_family_income', familyIncome)}
                          </span>
                        </div>
                      )}

                      {state !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Domicile State</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_domicile_state', state)}
                          </span>
                        </div>
                      )}

                      {district !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">District</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_district', district)}
                          </span>
                        </div>
                      )}

                      {hasCasteCert !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Caste Certificate</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_has_caste_certificate', hasCasteCert)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Factors */}
                {(isHosteller !== null ||
                  isDisabled !== null ||
                  minorityCommunity !== null ||
                  isOrphan !== null ||
                  isSingleParent !== null ||
                  isDefenceWard !== null) && (
                  <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#0A1613]/80 border border-stone-200/60 dark:border-emerald-950/60 space-y-2.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Special Criteria</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                      {isHosteller !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Hosteller</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_is_hosteller', isHosteller)}
                          </span>
                        </div>
                      )}

                      {hostelType !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Hostel Type</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_hostel_type', hostelType)}
                          </span>
                        </div>
                      )}

                      {isDisabled !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Disability</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_is_disabled', isDisabled)}
                          </span>
                        </div>
                      )}

                      {disabilityPct !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Disability %</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {disabilityPct}%
                          </span>
                        </div>
                      )}

                      {disabilityType !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Disability Type</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_disability_type', disabilityType)}
                          </span>
                        </div>
                      )}

                      {minorityCommunity !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Minority</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_minority_community', minorityCommunity)}
                          </span>
                        </div>
                      )}

                      {isOrphan !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Orphan Status</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_is_orphan', isOrphan)}
                          </span>
                        </div>
                      )}

                      {isSingleParent !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Single Parent</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_is_single_parent', isSingleParent)}
                          </span>
                        </div>
                      )}

                      {isDefenceWard !== null && (
                        <div>
                          <span className="text-stone-400 block text-[10px]">Defence Ward</span>
                          <span className="font-semibold text-stone-900 dark:text-white">
                            {formatFieldValue('field_is_defence_ward', isDefenceWard)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-stone-100 dark:border-emerald-950/60 bg-stone-50/50 dark:bg-[#0A1613]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-emerald-600 hover:bg-stone-800 dark:hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
