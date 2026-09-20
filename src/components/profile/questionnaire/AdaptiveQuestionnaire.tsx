import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import type { Scholarship } from '../../../types/scholarship';
import type { StudentProfile, StudentFieldValue } from '../../../types/studentProfile';
import type { QuestionnaireState, QuestionDefinition } from '../../../types/questionnaire';
import type { ProfileValueStatus } from '../../../types/eligibility';
import { getNextQuestion, invalidateDependentFields } from '../../../engine/dynamicQuestionEngine';
import { getField, validateFieldValue } from '../../../engine/fieldRegistry';
import { questionById } from '../../../data/eligibility/questions';
import { profileStorage } from '../../../services/profile/profileStorage';
import { QuestionCard } from './QuestionCard';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  FastForward,
} from 'lucide-react';

interface AdaptiveQuestionnaireProps {
  initialProfile: StudentProfile;
  scholarships: Scholarship[];
  preferredFieldId?: string;
  onComplete: (updatedProfile: StudentProfile) => void;
  onExit: () => void;
  onFindScholarships: () => void;
}

export const AdaptiveQuestionnaire: React.FC<AdaptiveQuestionnaireProps> = ({
  initialProfile,
  scholarships,
  preferredFieldId,
  onComplete,
  onExit,
  onFindScholarships,
}) => {
  const { t } = useLanguage();

  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [questionState, setQuestionState] = useState<QuestionnaireState>(() => ({
    sessionId: `sess_${Date.now()}`,
    profileId: initialProfile.id,
    startedAt: new Date().toISOString(),
    askedQuestionIds: [],
    skippedQuestionIds: [],
    answers: {},
    candidateScholarshipIds: scholarships.map((s) => s.id),
    missingFieldIds: [],
    status: 'in_progress',
  }));

  // Stack of question IDs to support reliable Back navigation
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  // Current active question
  const [activeQuestion, setActiveQuestion] = useState<QuestionDefinition | null>(null);

  // Active answer state for current question
  const [answerValue, setAnswerValue] = useState<any>(null);
  const [answerStatus, setAnswerStatus] = useState<ProfileValueStatus>('known');
  const [customText, setCustomText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  // Focus management ref for active question card
  const questionCardRef = useRef<HTMLDivElement | null>(null);

  // Completion state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Accessible focus shift when moving to a new question
  useEffect(() => {
    if (activeQuestion && questionCardRef.current) {
      questionCardRef.current.focus();
    }
  }, [activeQuestion?.id]);

  // Determine next question dynamically
  const advanceToNext = useCallback(
    (
      currentProf: StudentProfile,
      currentQState: QuestionnaireState,
      targetFieldId?: string
    ) => {
      const nextRes = getNextQuestion(currentProf, scholarships, currentQState, targetFieldId);

      if (!nextRes.question) {
        setIsCompleted(true);
        setActiveQuestion(null);
        profileStorage.clearQuestionnaireState();
      } else {
        setActiveQuestion(nextRes.question);
        // Pre-fill if answer exists in profile
        const existingField = currentProf.fields[nextRes.question.fieldId];
        if (existingField) {
          setAnswerValue(existingField.value);
          setAnswerStatus(existingField.status);
          setCustomText(existingField.customText || '');
        } else {
          setAnswerValue(null);
          setAnswerStatus('known');
          setCustomText('');
        }
        setValidationError(undefined);
      }
    },
    [scholarships]
  );

  // Initial load with state hydration for seamless resume
  useEffect(() => {
    let isMounted = true;

    async function init() {
      let stateToUse = questionState;

      // Only attempt resume if no specific target field was requested
      if (!preferredFieldId) {
        try {
          const savedState = await profileStorage.loadQuestionnaireState();
          if (
            isMounted &&
            savedState &&
            savedState.profileId === initialProfile.id &&
            (savedState.status === 'in_progress' || savedState.status === 'paused')
          ) {
            stateToUse = {
              ...savedState,
              candidateScholarshipIds: scholarships.map((s) => s.id),
              status: 'in_progress',
            };
            setQuestionState(stateToUse);
            if (savedState.askedQuestionIds && savedState.askedQuestionIds.length > 0) {
              setHistoryStack(savedState.askedQuestionIds);
            }
          }
        } catch {
          // Graceful fallback to initial default
        }
      }

      if (isMounted) {
        advanceToNext(initialProfile, stateToUse, preferredFieldId);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save state on pause/exit
  const handleExitWithSave = useCallback(async () => {
    try {
      await profileStorage.saveQuestionnaireState({
        ...questionState,
        status: 'paused',
      });
    } catch {
      // Storage error safeguard
    }
    onExit();
  }, [questionState, onExit]);

  // Clean completion handler
  const handleFinish = useCallback(
    async (action: 'complete' | 'find') => {
      try {
        await profileStorage.clearQuestionnaireState();
      } catch {
        // Storage error safeguard
      }
      if (action === 'complete') {
        onComplete(profile);
      } else {
        onFindScholarships();
      }
    },
    [profile, onComplete, onFindScholarships]
  );

  // Compute live progress via dynamic question engine
  const liveProgress = useMemo(() => {
    const nextRes = getNextQuestion(profile, scholarships, questionState);
    return nextRes.progress;
  }, [profile, scholarships, questionState]);

  // Handle value change from QuestionRenderer
  const handleAnswerChange = (val: any, status: ProfileValueStatus, custom?: string) => {
    setAnswerValue(val);
    setAnswerStatus(status);
    if (custom !== undefined) setCustomText(custom);
    setValidationError(undefined);
  };

  // Submit Answer & Dynamically Progress
  const handleContinue = async () => {
    if (!activeQuestion) return;

    const fieldDef = getField(activeQuestion.fieldId);
    if (!fieldDef) return;

    // Validate only if status is known
    if (answerStatus === 'known') {
      const validation = validateFieldValue(fieldDef, answerValue);
      if (!validation.valid) {
        setValidationError(validation.error || 'Please provide a valid answer.');
        return;
      }
    }

    if (answerStatus === 'custom' && (!customText || customText.trim() === '')) {
      setValidationError('Please specify your custom option.');
      return;
    }

    const now = new Date().toISOString();
    const newFieldValue: StudentFieldValue = {
      value: answerStatus === 'known' ? answerValue : null,
      status: answerStatus,
      customText: answerStatus === 'custom' ? customText.trim() : undefined,
      updatedAt: now,
      source: 'questionnaire',
    };

    // 1. Update Profile Fields
    const updatedProfileFields = {
      ...profile.fields,
      [activeQuestion.fieldId]: newFieldValue,
    };

    // 2. Prune Invalid Dependent Fields (Parent Answer Invalidation)
    const cleanedProfile = invalidateDependentFields({
      ...profile,
      updatedAt: now,
      fields: updatedProfileFields,
    });

    // 3. Persist Profile Immediately
    await profileStorage.saveProfile(cleanedProfile);
    setProfile(cleanedProfile);

    // 4. Update Questionnaire State & History Stack
    const nextAsked = Array.from(new Set([...questionState.askedQuestionIds, activeQuestion.id]));
    const nextQState: QuestionnaireState = {
      ...questionState,
      askedQuestionIds: nextAsked,
      answers: {
        ...questionState.answers,
        [activeQuestion.fieldId]: newFieldValue,
      },
    };

    setQuestionState(nextQState);
    setHistoryStack((prev) => [...prev, activeQuestion.id]);

    // Save questionnaire state progress for resume
    try {
      await profileStorage.saveQuestionnaireState(nextQState);
    } catch {
      // Ignore
    }

    // 5. Dynamically Load Next Question
    advanceToNext(cleanedProfile, nextQState);
  };

  // Skip Current Question
  const handleSkip = async () => {
    if (!activeQuestion) return;

    const nextSkipped = Array.from(new Set([...questionState.skippedQuestionIds, activeQuestion.id]));
    const nextQState: QuestionnaireState = {
      ...questionState,
      skippedQuestionIds: nextSkipped,
    };

    setQuestionState(nextQState);
    setHistoryStack((prev) => [...prev, activeQuestion.id]);

    try {
      await profileStorage.saveQuestionnaireState(nextQState);
    } catch {
      // Ignore
    }

    advanceToNext(profile, nextQState);
  };

  // Back Navigation
  const handleBack = async () => {
    if (historyStack.length === 0) {
      await handleExitWithSave();
      return;
    }

    const prevQuestionId = historyStack[historyStack.length - 1];
    const prevQuestion = questionById[prevQuestionId];
    if (!prevQuestion) {
      await handleExitWithSave();
      return;
    }

    // Pop from stack
    setHistoryStack((prev) => prev.slice(0, -1));

    // Remove from asked/skipped so it can be re-evaluated
    const nextQState: QuestionnaireState = {
      ...questionState,
      askedQuestionIds: questionState.askedQuestionIds.filter((id) => id !== prevQuestionId),
      skippedQuestionIds: questionState.skippedQuestionIds.filter((id) => id !== prevQuestionId),
    };
    setQuestionState(nextQState);

    try {
      await profileStorage.saveQuestionnaireState(nextQState);
    } catch {
      // Ignore
    }

    setActiveQuestion(prevQuestion);
    setIsCompleted(false);

    // Load existing value
    const existingField = profile.fields[prevQuestion.fieldId];
    if (existingField) {
      setAnswerValue(existingField.value);
      setAnswerStatus(existingField.status);
      setCustomText(existingField.customText || '');
    } else {
      setAnswerValue(null);
      setAnswerStatus('known');
      setCustomText('');
    }
    setValidationError(undefined);
  };

  // Completion Screen View
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-[#065F46] dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-md">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-stone-900 dark:text-white">
            {t('profile.questionnaire.profileReadyTitle', undefined, 'Your Profile is Ready!')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            {t(
              'profile.questionnaire.profileReadySubtitle',
              undefined,
              'Your eligibility profile is now detailed enough to accurately match verified scholarships across India.'
            )}
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-[#182E29] border border-amber-500/20 dark:border-[#23453E] max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-stone-600 dark:text-stone-300">Profile Readiness</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">
              {liveProgress.percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-[#1C3630] overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#065F46] to-amber-600 transition-all duration-500"
              style={{ width: `${Math.max(liveProgress.percentage, 5)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-2">
            {liveProgress.knownFields} of {liveProgress.relevantFields} relevant candidate fields completed
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
          <button
            onClick={() => handleFinish('find')}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-sm font-bold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          >
            <Search className="w-4 h-4" />
            <span>{t('profile.questionnaire.findScholarshipsBtn', undefined, 'Find Scholarships Now')}</span>
          </button>

          <button
            onClick={() => handleFinish('complete')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-stone-100 dark:bg-[#1C3630] hover:bg-stone-200 dark:hover:bg-[#23453E] text-stone-800 dark:text-stone-200 text-sm font-semibold border border-stone-200 dark:border-[#23453E] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
          >
            <span>{t('profile.questionnaire.reviewProfileBtn', undefined, 'Review Profile')}</span>
          </button>
        </div>
      </div>
    );
  }

  const currentFieldDef = activeQuestion ? getField(activeQuestion.fieldId) : null;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6">
      {/* Questionnaire Top Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#E8E2D7] dark:border-[#1E3A33]">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#1C3630]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('profile.questionnaire.back', undefined, 'Back')}</span>
        </button>

        {/* Dynamic Readiness Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Profile Readiness
            </span>
            <span className="text-xs font-bold text-[#065F46] dark:text-emerald-400">
              {liveProgress.percentage}%
            </span>
          </div>
          <div className="w-20 sm:w-28 h-2 rounded-full bg-stone-200 dark:bg-[#1C3630] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#065F46] dark:bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.max(liveProgress.percentage, 5)}%` }}
            />
          </div>
        </div>

        {/* Pause / Exit Button */}
        <button
          onClick={handleExitWithSave}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors cursor-pointer"
          title={t('profile.questionnaire.pauseAndExit', undefined, 'Pause & Finish Later')}
          aria-label="Pause questionnaire"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Subtle Candidate Guidance Banner */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-[#182E29]/50 border border-stone-200/80 dark:border-[#23453E] text-stone-500 dark:text-stone-400 text-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#065F46] dark:text-emerald-400 shrink-0" />
        <span className="truncate">
          {t(
            'profile.questionnaire.narrowingDownCandidates',
            undefined,
            'Narrowing down potential scholarships based on your answers...'
          )}
        </span>
      </div>

      {/* Screen Reader Live Announcement */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {activeQuestion ? `${activeQuestion.question}. Category: ${currentFieldDef?.category || ''}` : ''}
      </div>

      {/* Active Question Card */}
      {activeQuestion && currentFieldDef ? (
        <QuestionCard
          cardRef={questionCardRef}
          question={activeQuestion}
          fieldDef={currentFieldDef}
          currentValue={answerValue}
          currentStatus={answerStatus}
          customText={customText}
          onChange={handleAnswerChange}
          validationError={validationError}
        />
      ) : (
        <div className="p-8 text-center text-stone-500">
          Loading next question...
        </div>
      )}

      {/* Navigation & Action Footer */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={handleSkip}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46]"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>{t('profile.questionnaire.skipForNow', undefined, 'Skip for now')}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#065F46] hover:bg-[#044835] text-amber-50 text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065F46] hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{t('profile.questionnaire.saveAndNext', undefined, 'Continue')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
