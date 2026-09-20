import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useScholarships } from '../../context/ScholarshipContext';
import { useStudentProfile } from '../../context/StudentProfileContext';
import type { StudentFieldValue } from '../../types/studentProfile';
import { ProfileOnboardingState } from '../profile/ProfileOnboardingState';
import { ProfileReadiness } from '../profile/ProfileReadiness';
import { ProfileSectionCard, type DisplayFieldItem } from '../profile/ProfileSectionCard';
import { ProfileEditModal } from '../profile/ProfileEditModal';
import { AdaptiveQuestionnaire } from '../profile/questionnaire/AdaptiveQuestionnaire';
import { fieldById } from '../../data/eligibility/fields';
import {
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  Coins,
  Home,
  HeartHandshake,
  Award,
  FileCheck,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

// Configuration of the 9 universal profile sections
interface SectionConfig {
  id: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  emptyKey: string;
  defaultEmpty: string;
  icon: React.ReactNode;
  fieldIds: string[];
}

const PROFILE_SECTIONS: SectionConfig[] = [
  {
    id: 'about',
    titleKey: 'profile.sections.aboutYou',
    defaultTitle: 'About You',
    descKey: 'profile.sections.aboutYouDesc',
    defaultDesc: 'Your demographic and personal identity information.',
    emptyKey: 'profile.sections.aboutYouEmpty',
    defaultEmpty: 'Tell us a little about your age, gender, and background.',
    icon: <User className="w-4 h-4" />,
    fieldIds: ['field_age', 'field_gender', 'field_nationality'],
  },
  {
    id: 'location',
    titleKey: 'profile.sections.location',
    defaultTitle: 'Location',
    descKey: 'profile.sections.locationDesc',
    defaultDesc: 'State and domicile details determining regional eligibility.',
    emptyKey: 'profile.sections.locationEmpty',
    defaultEmpty: 'Add your domicile and location to unlock state government scholarships.',
    icon: <MapPin className="w-4 h-4" />,
    fieldIds: ['field_domicile_state', 'field_current_state', 'field_rural_urban'],
  },
  {
    id: 'education',
    titleKey: 'profile.sections.education',
    defaultTitle: 'Education',
    descKey: 'profile.sections.educationDesc',
    defaultDesc: 'Your current educational level, ongoing stream, and institution.',
    emptyKey: 'profile.sections.educationEmpty',
    defaultEmpty: 'Tell us about your current course and academic level.',
    icon: <GraduationCap className="w-4 h-4" />,
    fieldIds: [
      'field_education_level',
      'field_stream',
      'field_program',
      'field_academic_year',
      'field_institution_type',
    ],
  },
  {
    id: 'academic',
    titleKey: 'profile.sections.academic',
    defaultTitle: 'Academic',
    descKey: 'profile.sections.academicDesc',
    defaultDesc: 'Percentage, qualifying exam marks, and past qualifications.',
    emptyKey: 'profile.sections.academicEmpty',
    defaultEmpty: 'Add your marks or percentage to unlock merit-based schemes.',
    icon: <BookOpen className="w-4 h-4" />,
    fieldIds: [
      'field_latest_score',
      'field_class_12_percentage',
      'field_previous_qualification',
      'field_board',
      'field_percentile',
    ],
  },
  {
    id: 'financial',
    titleKey: 'profile.sections.categoryFinancial',
    defaultTitle: 'Category & Financial',
    descKey: 'profile.sections.categoryFinancialDesc',
    defaultDesc: 'Social category and family income range for reserved schemes.',
    emptyKey: 'profile.sections.categoryFinancialEmpty',
    defaultEmpty: 'Add category and income to match reserved and need-based aid.',
    icon: <Coins className="w-4 h-4" />,
    fieldIds: [
      'field_category',
      'field_family_income',
      'field_minority_status',
      'field_income_range',
      'field_income_certificate_status',
    ],
  },
  {
    id: 'residence',
    titleKey: 'profile.sections.residence',
    defaultTitle: 'Residence',
    descKey: 'profile.sections.residenceDesc',
    defaultDesc: 'Living arrangements and accommodation during study.',
    emptyKey: 'profile.sections.residenceEmpty',
    defaultEmpty: 'Specify day scholar or hosteller status for accommodation benefits.',
    icon: <Home className="w-4 h-4" />,
    fieldIds: ['field_accommodation_type', 'field_is_hosteller', 'field_hostel_type'],
  },
  {
    id: 'special',
    titleKey: 'profile.sections.specialCircumstances',
    defaultTitle: 'Special Circumstances',
    descKey: 'profile.sections.specialCircumstancesDesc',
    defaultDesc: 'Benchmark disability, defence ward, orphan or farmer family benefits.',
    emptyKey: 'profile.sections.specialCircumstancesEmpty',
    defaultEmpty: 'No special circumstances or quotas entered.',
    icon: <HeartHandshake className="w-4 h-4" />,
    fieldIds: [
      'field_has_disability',
      'field_disability_percentage',
      'field_is_orphan',
      'field_is_defence_dependent',
      'field_is_farmer_family',
      'field_is_first_generation_student',
    ],
  },
  {
    id: 'achievements',
    titleKey: 'profile.sections.achievements',
    defaultTitle: 'Achievements',
    descKey: 'profile.sections.achievementsDesc',
    defaultDesc: 'National olympiads, sports medals, research or academic awards.',
    emptyKey: 'profile.sections.achievementsEmpty',
    defaultEmpty: 'Add notable awards, sports recognition, or research experience.',
    icon: <Award className="w-4 h-4" />,
    fieldIds: [
      'field_has_academic_achievement',
      'field_sports_achievement',
      'field_research_experience',
    ],
  },
  {
    id: 'documents',
    titleKey: 'profile.sections.documents',
    defaultTitle: 'Documents',
    descKey: 'profile.sections.documentsDesc',
    defaultDesc: 'Readiness check of certificates required for application submission.',
    emptyKey: 'profile.sections.documentsEmpty',
    defaultEmpty: 'Track certificate readiness so you are ready when portals open.',
    icon: <FileCheck className="w-4 h-4" />,
    fieldIds: [
      'field_has_income_certificate',
      'field_has_caste_certificate',
      'field_has_domicile_certificate',
      'field_has_institution_certificate',
    ],
  },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { scholarships } = useScholarships();
  const {
    profile,
    isLoading,
    profileCompletion: completion,
    hasPopulatedFields,
    createDefaultProfile,
    updateFields,
    resetProfile,
    refreshProfile,
  } = useStudentProfile();

  const [activeEditSection, setActiveEditSection] = useState<SectionConfig | null>(null);
  const [isQuestionnaireActive, setIsQuestionnaireActive] = useState(false);
  const [preferredQuestionFieldId, setPreferredQuestionFieldId] = useState<string | undefined>(undefined);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Escape key listener for Reset Modal
  useEffect(() => {
    if (!showResetModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResetModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResetModal]);

  // Initializing profile when clicking "Start My Profile"
  const handleStartProfile = async () => {
    if (!profile) {
      await createDefaultProfile();
    }
    setPreferredQuestionFieldId(undefined);
    setIsQuestionnaireActive(true);
  };

  // Saving section updates with dependency invalidation
  const handleSaveSectionFields = async (
    updatedFields: Record<string, StudentFieldValue>
  ) => {
    await updateFields(updatedFields, true);
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetProfile();
      setShowResetModal(false);
      setIsQuestionnaireActive(false);
      setActiveEditSection(null);
    } finally {
      setIsResetting(false);
    }
  };

  // Loading spinner
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#065F46] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
          {t('profile.loadingProfile', undefined, 'Loading your scholarship profile...')}
        </p>
      </div>
    );
  }

  // Active Adaptive Questionnaire Loop View
  if (isQuestionnaireActive && profile) {
    return (
      <AdaptiveQuestionnaire
        initialProfile={profile}
        scholarships={scholarships}
        preferredFieldId={preferredQuestionFieldId}
        onComplete={async () => {
          await refreshProfile();
          setIsQuestionnaireActive(false);
          setPreferredQuestionFieldId(undefined);
        }}
        onExit={async () => {
          await refreshProfile();
          setIsQuestionnaireActive(false);
          setPreferredQuestionFieldId(undefined);
        }}
        onFindScholarships={() => {
          setIsQuestionnaireActive(false);
          setPreferredQuestionFieldId(undefined);
          onNavigate('find');
        }}
      />
    );
  }

  // First-time onboarding view if no profile or completely empty
  if (!profile || !hasPopulatedFields) {
    return (
      <>
        <ProfileOnboardingState
          onStartProfile={handleStartProfile}
          onExploreScholarships={() => onNavigate('explore')}
        />
        {activeEditSection && profile && (
          <ProfileEditModal
            isOpen={true}
            sectionId={activeEditSection.id}
            sectionTitle={t(
              activeEditSection.titleKey,
              undefined,
              activeEditSection.defaultTitle
            )}
            fieldIds={activeEditSection.fieldIds}
            currentProfile={profile}
            onClose={() => setActiveEditSection(null)}
            onSave={handleSaveSectionFields}
          />
        )}
      </>
    );
  }

  // Returning user dashboard view
  return (
    <main className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EE] dark:bg-[#163328] text-[#065F46] dark:text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('profile.guestBadge', undefined, 'Guest Profile · Stored locally')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white tracking-tight">
            {t('profile.welcomeBack', undefined, 'Welcome back')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            {t(
              'profile.privacyNotice',
              undefined,
              'Edvora saves your profile locally on this device. No account or password required.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#23453E] hover:border-red-300 dark:hover:border-red-800 text-stone-600 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-400 bg-white dark:bg-[#142420] text-xs sm:text-sm font-medium shadow-2xs transition-colors cursor-pointer"
            title={t('profile.reset.btn', undefined, 'Reset Profile')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('profile.reset.btn', undefined, 'Reset Profile')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPreferredQuestionFieldId(undefined);
              setIsQuestionnaireActive(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('profile.questionnaire.questionnaireTitle', undefined, 'Adaptive Questionnaire')}</span>
          </button>
        </div>
      </header>

      {/* Profile Readiness Indicator */}
      <ProfileReadiness
        completion={completion}
        onFindScholarships={() => onNavigate('find')}
        onUpdateProfile={() => {
          setPreferredQuestionFieldId(undefined);
          setIsQuestionnaireActive(true);
        }}
      />

      {/* Structured Profile Sections Grid */}
      <section aria-labelledby="eligibility-info-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="eligibility-info-heading" className="text-lg sm:text-xl font-bold font-editorial text-stone-900 dark:text-white">
            Eligibility Information
          </h2>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
            9 Universal Sections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFILE_SECTIONS.map((sec) => {
            const displayItems: DisplayFieldItem[] = sec.fieldIds.map((fid) => {
              const def = fieldById[fid];
              const fVal = profile.fields[fid] || {
                value: null,
                status: 'unknown',
                updatedAt: '',
                source: 'profile',
              };
              return {
                fieldId: fid,
                label: def?.label || fid,
                fieldValue: fVal,
              };
            });

            return (
              <ProfileSectionCard
                key={sec.id}
                sectionId={sec.id}
                title={t(sec.titleKey, undefined, sec.defaultTitle)}
                description={t(sec.descKey, undefined, sec.defaultDesc)}
                emptyPrompt={t(sec.emptyKey, undefined, sec.defaultEmpty)}
                icon={sec.icon}
                fields={displayItems}
                onEdit={() => setActiveEditSection(sec)}
              />
            );
          })}
        </div>
      </section>

      {/* Edit Section Modal */}
      {activeEditSection && profile && (
        <ProfileEditModal
          isOpen={true}
          sectionId={activeEditSection.id}
          sectionTitle={t(
            activeEditSection.titleKey,
            undefined,
            activeEditSection.defaultTitle
          )}
          fieldIds={activeEditSection.fieldIds}
          currentProfile={profile}
          onClose={() => setActiveEditSection(null)}
          onSave={handleSaveSectionFields}
        />
      )}

      {/* Profile Reset Confirmation Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onClick={() => setShowResetModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="reset-modal-title" className="text-base font-bold text-stone-900 dark:text-white">
                  {t('profile.reset.title', undefined, 'Reset Eligibility Profile?')}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  {t(
                    'profile.reset.description',
                    undefined,
                    'This will clear all answered questions and reset your eligibility profile. Your saved scholarships, comparison list, and language preferences will NOT be affected.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-[#1E3A33]">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1C3630] border border-stone-200 dark:border-[#23453E] cursor-pointer transition-colors"
              >
                {t('profile.reset.cancel', undefined, 'Keep Profile')}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-50 bg-[#065F46] hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                {isResetting && <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />}
                <span>{t('profile.reset.confirm', undefined, 'Yes, Reset Profile')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
