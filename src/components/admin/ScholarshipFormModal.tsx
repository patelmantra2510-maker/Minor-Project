import React, { useState } from 'react';
import type {
  Scholarship,
  EducationLevel,
  SocialCategory,
  ScholarshipType,
  ApplicationStatus,
} from '../../types/scholarship';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';

interface ScholarshipFormModalProps {
  scholarship: Scholarship | null; // null if creating new
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Scholarship) => Promise<void>;
}

const ALL_EDUCATION_LEVELS: EducationLevel[] = [
  'School',
  'Diploma',
  'ITI',
  'Undergraduate',
  'Postgraduate',
  'PhD',
  'Other',
];

const ALL_CATEGORIES: (SocialCategory | 'All')[] = [
  'All',
  'General',
  'SC',
  'ST',
  'SEBC/OBC',
  'EWS',
];

const ALL_TYPES: ScholarshipType[] = [
  'Government',
  'Private',
  'Merit',
  'Need-based',
  'Technical',
  'Category-based',
  'Special',
];

export const ScholarshipFormModal: React.FC<ScholarshipFormModalProps> = ({
  scholarship,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(scholarship);

  // Form State
  const [formData, setFormData] = useState<Partial<Scholarship>>(() => {
    if (scholarship) {
      return { ...scholarship };
    }
    return {
      id: '',
      slug: '',
      name: '',
      shortName: '',
      provider: '',
      state: 'Gujarat',
      type: 'Government',
      status: 'Open',
      genderEligibility: 'All',
      educationLevels: ['Undergraduate'],
      categories: ['All'],
      courses: ['All'],
      yearEligibility: ['All'],
      incomeLimit: 600000,
      minimumPercentage: 60,
      benefits: {
        amountDescription: '',
        tuitionFeeCoverage: '',
        hostelAllowance: '',
        bookAllowance: '',
        maxAnnualAmount: 50000,
      },
      specialConditions: {
        disabilityRequired: false,
        orphanRequired: false,
        defenceWardRequired: false,
        minorityRequired: false,
      },
      applicationStart: new Date().toISOString().slice(0, 10),
      applicationDeadline: '',
      officialWebsite: '',
      applicationWebsite: '',
      description: '',
      documents: ['Aadhaar Card', 'Income Certificate', 'Academic Marksheet', 'College Admission Letter'],
      whoCanApply: [],
      howToApplySteps: [],
      tags: [],
      isVerified: true,
      isFeatured: false,
    };
  });

  // String helpers for list textareas
  const [documentsText, setDocumentsText] = useState((formData.documents || []).join('\n'));
  const [whoCanApplyText, setWhoCanApplyText] = useState((formData.whoCanApply || []).join('\n'));
  const [howToApplyText, setHowToApplyText] = useState((formData.howToApplySteps || []).join('\n'));
  const [coursesText, setCoursesText] = useState((formData.courses || []).join(', '));
  const [tagsText, setTagsText] = useState((formData.tags || []).join(', '));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate id/slug from name if adding new
  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!isEditing && (!prev.slug || prev.slug === '')) {
        const slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        updated.slug = slug;
        updated.id = slug;
        if (!prev.shortName) updated.shortName = val.slice(0, 24);
      }
      return updated;
    });
  };

  const toggleArrayItem = (key: 'educationLevels' | 'categories' | 'yearEligibility', item: any) => {
    setFormData((prev) => {
      const current = (prev[key] as any[]) || [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((x) => x !== item) : [...current, item];
      return { ...prev, [key]: updated.length > 0 ? updated : [item] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Scholarship name is required.');
      return;
    }
    if (!formData.provider?.trim()) {
      setError('Provider / Organization is required.');
      return;
    }
    if (!formData.slug?.trim()) {
      setError('Unique slug is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const cleanedCourses = coursesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedTags = tagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedDocuments = documentsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedWhoCanApply = whoCanApplyText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedHowToApply = howToApplyText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Scholarship = {
        id: formData.id || formData.slug!,
        slug: formData.slug!,
        name: formData.name!,
        shortName: formData.shortName || formData.name!,
        provider: formData.provider!,
        state: formData.state as 'Gujarat' | 'All India',
        type: formData.type as ScholarshipType,
        educationLevels: formData.educationLevels as EducationLevel[],
        courses: cleanedCourses.length > 0 ? cleanedCourses : ['All'],
        categories: formData.categories as (SocialCategory | 'All')[],
        genderEligibility: formData.genderEligibility as 'All' | 'Female' | 'Male',
        incomeLimit: formData.incomeLimit !== undefined && formData.incomeLimit !== null ? Number(formData.incomeLimit) : null,
        minimumPercentage: formData.minimumPercentage !== undefined && formData.minimumPercentage !== null ? Number(formData.minimumPercentage) : null,
        yearEligibility: formData.yearEligibility || ['All'],
        specialConditions: formData.specialConditions || {},
        benefits: formData.benefits || { amountDescription: '' },
        applicationStart: formData.applicationStart || '',
        applicationDeadline: formData.applicationDeadline || '',
        status: (formData.status as ApplicationStatus) || 'Open',
        documents: cleanedDocuments,
        description: formData.description || '',
        whoCanApply: cleanedWhoCanApply,
        howToApplySteps: cleanedHowToApply,
        officialWebsite: formData.officialWebsite || '',
        applicationWebsite: formData.applicationWebsite || formData.officialWebsite || '',
        lastUpdated: new Date().toISOString().slice(0, 10),
        tags: cleanedTags,
        isVerified: formData.isVerified ?? true,
        isFeatured: formData.isFeatured ?? false,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save scholarship.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#101D19] border border-stone-200 dark:border-emerald-950 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 dark:border-emerald-950/60 flex items-center justify-between bg-stone-50/50 dark:bg-[#0A1613]/50">
          <div>
            <h2 className="text-xl font-bold font-editorial text-stone-900 dark:text-white">
              {isEditing ? `Edit Scholarship: ${scholarship?.shortName}` : 'Add New Scholarship'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Updates will persist to the SQLite database and sync immediately with the live website.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {/* Section 1: Core Information */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              1. Basic Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Scholarship Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Mukhyamantri Yuva Swavalamban Yojana"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Short Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortName || ''}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="e.g. MYSY Gujarat"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Provider / Government Department *
                </label>
                <input
                  type="text"
                  required
                  value={formData.provider || ''}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g. Education Department, Government of Gujarat"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Unique Slug (URL identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value, id: e.target.value })}
                  placeholder="e.g. mysy-gujarat"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  State Scope
                </label>
                <select
                  value={formData.state || 'Gujarat'}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="All India">All India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Scholarship Type
                </label>
                <select
                  value={formData.type || 'Government'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                >
                  {ALL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'Open'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                >
                  <option value="Open">Open</option>
                  <option value="Opening Soon">Opening Soon</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Gender Eligibility
                </label>
                <select
                  value={formData.genderEligibility || 'All'}
                  onChange={(e) => setFormData({ ...formData, genderEligibility: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                >
                  <option value="All">All Genders</option>
                  <option value="Female">Female Only</option>
                  <option value="Male">Male Only</option>
                </select>
              </div>
            </div>

            {/* Verification & Featured switches */}
            <div className="flex flex-wrap gap-6 pt-3 border-t border-stone-200 dark:border-emerald-950/60">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={formData.isVerified ?? true}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Mark as Verified Official Scheme</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={formData.isFeatured ?? false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Feature on Public Home Page</span>
              </label>
            </div>
          </div>

          {/* Section 2: Eligibility Rules */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              2. Eligibility Criteria
            </h3>

            {/* Education Levels */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Eligible Education Levels
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_EDUCATION_LEVELS.map((lvl) => {
                  const selected = (formData.educationLevels || []).includes(lvl);
                  return (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => toggleArrayItem('educationLevels', lvl)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-emerald-950'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Categories */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Eligible Social Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((c) => {
                  const selected = (formData.categories || []).includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleArrayItem('categories', c)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-emerald-950'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial & Marks Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Annual Family Income Limit (₹) — Leave empty if no limit
                </label>
                <input
                  type="number"
                  value={formData.incomeLimit !== null && formData.incomeLimit !== undefined ? formData.incomeLimit : ''}
                  onChange={(e) => setFormData({ ...formData, incomeLimit: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="e.g. 600000"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Minimum Academic Percentage (%) — Leave empty if passing marks
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.minimumPercentage !== null && formData.minimumPercentage !== undefined ? formData.minimumPercentage : ''}
                  onChange={(e) => setFormData({ ...formData, minimumPercentage: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="e.g. 80"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Courses text */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Approved Courses / Streams (Comma-separated or "All")
              </label>
              <input
                type="text"
                value={coursesText}
                onChange={(e) => setCoursesText(e.target.value)}
                placeholder="e.g. Engineering & Technology, MBBS, B.Com, All"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Section 3: Benefits */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              3. Benefits & Financial Grants
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Headline Benefit Description *
              </label>
              <input
                type="text"
                required
                value={formData.benefits?.amountDescription || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: { ...(formData.benefits as any), amountDescription: e.target.value },
                  })
                }
                placeholder="e.g. Up to ₹2,00,000/year tuition subsidy + ₹12,000/yr hostel"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Tuition Fee Details
                </label>
                <input
                  type="text"
                  value={formData.benefits?.tuitionFeeCoverage || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...(formData.benefits as any), tuitionFeeCoverage: e.target.value },
                    })
                  }
                  placeholder="e.g. 50% up to ₹50,000"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Hostel Allowance
                </label>
                <input
                  type="text"
                  value={formData.benefits?.hostelAllowance || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...(formData.benefits as any), hostelAllowance: e.target.value },
                    })
                  }
                  placeholder="e.g. ₹12,000 per year"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Maximum Annual Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.benefits?.maxAnnualAmount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...(formData.benefits as any), maxAnnualAmount: Number(e.target.value) },
                    })
                  }
                  placeholder="e.g. 200000"
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Deadlines & Portals */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              4. Deadlines & Official Portals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Application Deadline (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline || ''}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Application Start Date
                </label>
                <input
                  type="date"
                  value={formData.applicationStart || ''}
                  onChange={(e) => setFormData({ ...formData, applicationStart: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Official Informational Portal
                </label>
                <input
                  type="url"
                  value={formData.officialWebsite || ''}
                  onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Direct Application Link
                </label>
                <input
                  type="url"
                  value={formData.applicationWebsite || ''}
                  onChange={(e) => setFormData({ ...formData, applicationWebsite: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Documents & Checklist */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] border border-stone-100 dark:border-emerald-950/60 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              5. Documents & Guidance
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Required Documents Checklist (One document per line)
              </label>
              <textarea
                rows={3}
                value={documentsText}
                onChange={(e) => setDocumentsText(e.target.value)}
                placeholder="Aadhaar Card&#10;Income Certificate&#10;Bank Passbook"
                className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Who Can Apply Criteria Points (One point per line)
              </label>
              <textarea
                rows={3}
                value={whoCanApplyText}
                onChange={(e) => setWhoCanApplyText(e.target.value)}
                placeholder="Students with Gujarat domicile...&#10;Family annual income under ₹6,00,000"
                className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                How to Apply Steps (One step per line)
              </label>
              <textarea
                rows={3}
                value={howToApplyText}
                onChange={(e) => setHowToApplyText(e.target.value)}
                placeholder="Register online on portal&#10;Upload verified marksheets&#10;Submit application to college"
                className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Description / Overview
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the scheme..."
                className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Tags / Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="e.g. Merit, Gujarat, Higher Education, Engineering"
                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-950 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 dark:border-emerald-950/60 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#101D19] py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-60 transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Scholarship'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
