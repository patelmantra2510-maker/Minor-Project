import React, { useState } from 'react';
import type {
  StudentAnswers,
  EducationLevel,
  SocialCategory,
  Gender,
} from '../../types/scholarship';
import { STREAMS_BY_EDUCATION } from '../../data/streams';
import {
  MapPin,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface QuestionnaireWizardProps {
  onComplete: (answers: StudentAnswers) => void;
  initialAnswers?: StudentAnswers | null;
}

export const QuestionnaireWizard: React.FC<QuestionnaireWizardProps> = ({
  onComplete,
  initialAnswers,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const totalSteps = 7;

  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    if (initialAnswers) return initialAnswers;
    return {
      location: 'Gujarat',
      educationLevel: 'Undergraduate',
      stream: 'Engineering & Technology (B.E. / B.Tech)',
      currentYear: '1st Year',
      category: 'General',
      gender: 'Male',
      annualIncome: 300000,
      academicPercentage: 75,
      isDisability: false,
      disabilityPercentage: 40,
      isOrphan: false,
      isDefenceWard: false,
      isMinority: false,
    };
  });

  const [incomeInput, setIncomeInput] = useState<string>(
    answers.annualIncome ? answers.annualIncome.toString() : '300000'
  );
  const [percentageInput, setPercentageInput] = useState<string>(
    answers.academicPercentage ? answers.academicPercentage.toString() : '75'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEducationChange = (level: EducationLevel) => {
    const available = STREAMS_BY_EDUCATION[level] || ['Other'];
    setAnswers((prev) => ({
      ...prev,
      educationLevel: level,
      stream: available[0],
    }));
  };

  const handleIncomeChange = (valStr: string) => {
    setIncomeInput(valStr);
    const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setAnswers((prev) => ({ ...prev, annualIncome: num }));
    }
  };

  const handlePercentageChange = (valStr: string) => {
    setPercentageInput(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      setAnswers((prev) => ({ ...prev, academicPercentage: num }));
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);
    if (currentStep === 5) {
      const income = parseInt(incomeInput, 10);
      if (isNaN(income) || income < 0) {
        setErrorMsg('Please enter a valid annual family income.');
        return false;
      }
    }
    if (currentStep === 6) {
      const percent = parseFloat(percentageInput);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        setErrorMsg('Please enter a valid academic percentage between 0% and 100%.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const stepTitles = [
    'Where do you study or reside?',
    'What are you studying?',
    'Course / Stream & Current Year',
    'Social Category & Gender',
    'Annual Family Income',
    'Academic Percentage',
    'Additional Circumstances',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative animate-in fade-in duration-300">
      {/* Subtle Ambient Decorative Motifs (Prompt §§24-25) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
        <div className="absolute top-8 -left-4 w-3 h-3 rounded-full bg-amber-400/25 blur-[0.5px] animate-ambient-drift" />
        <div className="absolute top-44 -right-6 w-3.5 h-3.5 rounded-full bg-emerald-500/20 blur-[0.5px] animate-float" />
        <div className="absolute top-1/3 -left-10 w-24 h-24 rounded-full border border-emerald-600/10 dark:border-emerald-400/10" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-amber-500/10 dark:border-amber-400/10" />
      </div>

      {/* Header & Progress Indicator */}
      <div className="mb-8 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-[#142420] text-[#064E3B] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-bold mb-2 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          <span>Step 0{currentStep} of 0{totalSteps}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial tracking-tight">
          {stepTitles[currentStep - 1]}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Zero login · Answers evaluated only for this session
        </p>

        {/* Progress Bar with Editorial Journey-Line */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-stone-200 dark:bg-[#1E3A33] -translate-y-1/2 z-0 rounded-full" />
            <div
              className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-[#064E3B] via-[#064E3B] to-amber-500 dark:from-emerald-500 dark:to-amber-400 transition-all duration-500 ease-out -translate-y-1/2 z-0 rounded-full"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 96}%` }}
            />
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              const stepFormatted = `0${stepNum}`;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (stepNum < currentStep) {
                      setDirection('backward');
                      setCurrentStep(stepNum);
                    }
                  }}
                  disabled={stepNum > currentStep}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[11px] font-bold relative z-10 transition-all duration-300 font-mono ${
                    isPassed
                      ? 'bg-[#064E3B] text-amber-200 cursor-pointer shadow-xs border border-emerald-700 hover:scale-105 active:scale-95'
                      : isCurrent
                      ? 'bg-[#064E3B] text-amber-300 ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110 shadow-sm border border-amber-400/90 font-extrabold'
                      : 'bg-stone-100 dark:bg-[#1C3630] text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-[#23453E] cursor-not-allowed'
                  }`}
                  aria-label={`Go to step ${stepNum}`}
                >
                  {isPassed ? (
                    <span className="animate-checkmark-scale">✓</span>
                  ) : (
                    stepFormatted
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] sm:text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-2.5 px-0.5">
            {['Location', 'Level', 'Stream', 'Category', 'Income', 'Score', 'Profile'].map((lbl, i) => (
              <span
                key={i}
                className={`transition-colors duration-300 ${
                  currentStep === i + 1
                    ? 'font-bold text-[#064E3B] dark:text-emerald-400'
                    : i + 1 < currentStep
                    ? 'font-medium text-stone-600 dark:text-stone-300'
                    : ''
                }`}
              >
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Container - Rock-Solid Stationary Card */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-10 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs transition-shadow duration-300">
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content with Smooth Directional Slide Transition */}
        <div
          key={currentStep}
          className={direction === 'forward' ? 'animate-step-forward' : 'animate-step-backward'}
        >
          {/* STEP 1: LOCATION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="text-center sm:text-left mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Where do you study or reside?
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Gujarat government schemes require state domicile or study in Gujarat institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, location: 'Gujarat' })}
                  className={`group p-6 rounded-2xl border-2 text-left transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer ${
                    answers.location === 'Gujarat'
                      ? 'border-[#064E3B] bg-emerald-50/70 dark:bg-[#1C3630] shadow-sm -translate-y-0.5'
                      : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 dark:hover:border-[#28483F] hover:bg-stone-50 dark:hover:bg-[#182E29] hover:-translate-y-0.5 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-[#132A24] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                      <MapPin className="w-6 h-6" />
                    </div>
                    {answers.location === 'Gujarat' && (
                      <div className="animate-checkmark-scale">
                        <CheckCircle2 className="w-6 h-6 text-[#064E3B] dark:text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Gujarat
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Eligible for Gujarat State Scholarships (MYSY, Digital Gujarat, CMSS) plus All-India programs.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, location: 'Other Indian State' })}
                  className={`group p-6 rounded-2xl border-2 text-left transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer ${
                    answers.location === 'Other Indian State'
                      ? 'border-[#064E3B] bg-emerald-50/70 dark:bg-[#1C3630] shadow-sm -translate-y-0.5'
                      : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 dark:hover:border-[#28483F] hover:bg-stone-50 dark:hover:bg-[#182E29] hover:-translate-y-0.5 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-[#2A2415] text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                      <MapPin className="w-6 h-6" />
                    </div>
                    {answers.location === 'Other Indian State' && (
                      <div className="animate-checkmark-scale">
                        <CheckCircle2 className="w-6 h-6 text-[#064E3B] dark:text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Other Indian State
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Eligible for Central Sector, AICTE, DST INSPIRE, and popular nationwide schemes.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION LEVEL */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="text-center sm:text-left mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  What are you currently studying?
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Select your current level of education or the course you are taking admission into.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {(
                  [
                    { level: 'School', desc: 'Class 9th to 12th' },
                    { level: 'Diploma', desc: 'Polytechnic Diploma' },
                    { level: 'ITI', desc: 'Industrial Trades' },
                    { level: 'Undergraduate', desc: 'B.E., B.Tech, MBBS, B.Sc, B.Com, B.A.' },
                    { level: 'Postgraduate', desc: 'M.Tech, MBA, M.Sc, M.A., MD' },
                    { level: 'PhD', desc: 'Doctoral Fellowships' },
                  ] as { level: EducationLevel; desc: string }[]
                ).map((item) => {
                  const isSelected = answers.educationLevel === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => handleEducationChange(item.level)}
                      className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200 ease-out relative cursor-pointer ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50/70 dark:bg-[#1C3630] shadow-xs -translate-y-0.5'
                          : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 dark:hover:border-[#28483F] hover:bg-stone-50 dark:hover:bg-[#182E29] hover:-translate-y-0.5 hover:shadow-xs'
                      }`}
                    >
                      {isSelected && (
                        <div className="animate-checkmark-scale absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
                        </div>
                      )}
                      <div className="group-hover:scale-105 transition-transform duration-200 inline-block">
                        <GraduationCap className="w-6 h-6 text-[#065F46] dark:text-emerald-400 mb-2" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.level}
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: STREAM & YEAR (Dynamic) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Course Stream & Academic Year
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Showing courses dynamically populated for{' '}
                  <strong className="text-[#065F46] dark:text-emerald-400">{answers.educationLevel}</strong>.
                </p>
              </div>

              {/* Dynamic Stream Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Select Your Course / Stream
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {(STREAMS_BY_EDUCATION[answers.educationLevel] || ['Other']).map((streamName) => {
                    const isSelected = answers.stream === streamName;
                    return (
                      <button
                        key={streamName}
                        type="button"
                        onClick={() => setAnswers({ ...answers, stream: streamName })}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#064E3B] bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 ring-1 ring-[#064E3B] -translate-y-0.5 shadow-xs'
                            : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29] hover:border-stone-300'
                        }`}
                      >
                        <span className="truncate mr-2">{streamName}</span>
                        {isSelected && (
                          <div className="animate-checkmark-scale shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-[#064E3B] dark:text-emerald-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Academic Year */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Current Year of Study
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Other'].map(
                    (year) => {
                      const isSelected = answers.currentYear === year;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setAnswers({ ...answers, currentYear: year })}
                          className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-[#064E3B] bg-[#064E3B] text-amber-50 shadow-xs scale-105'
                              : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29] hover:border-stone-300'
                          }`}
                        >
                          {year}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CATEGORY & GENDER */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Social Category & Gender
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Certain government scholarships provide dedicated affirmative reservations or support for girl students.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Social Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    ['General', 'SC', 'ST', 'SEBC/OBC', 'EWS', 'Other', 'Prefer not to say'] as SocialCategory[]
                  ).map((cat) => {
                    const isSelected = answers.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAnswers({ ...answers, category: cat })}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#064E3B] bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 ring-1 ring-[#064E3B] scale-[1.02] shadow-xs'
                            : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29] hover:border-stone-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Gender
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Male', 'Female', 'Other', 'Prefer not to say'] as Gender[]).map((g) => {
                    const isSelected = answers.gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setAnswers({ ...answers, gender: g })}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#064E3B] bg-[#064E3B] text-amber-50 shadow-xs scale-[1.02]'
                            : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29] hover:border-stone-300'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ANNUAL FAMILY INCOME */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-editorial">
                  Annual Family Income
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Many government, state, and private scholarships have specific household income ceilings.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Total Family Income (₹ per annum)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={incomeInput}
                    onChange={(e) => handleIncomeChange(e.target.value)}
                    placeholder="e.g. 250000"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl border border-stone-200 dark:border-[#23453E] bg-white dark:bg-[#1C3630] text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all shadow-2xs"
                  />
                </div>

                {/* Quick Preset Chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Common Thresholds
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '₹1.5 Lakh', val: 150000 },
                      { label: '₹2.5 Lakh (Post-Matric)', val: 250000 },
                      { label: '₹4.5 Lakh (CSSS / CMSS)', val: 450000 },
                      { label: '₹6.0 Lakh (MYSY)', val: 600000 },
                      { label: '₹8.0 Lakh (AICTE / Central)', val: 800000 },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => handleIncomeChange(chip.val.toString())}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          answers.annualIncome === chip.val
                            ? 'bg-[#064E3B] text-amber-100 border-[#064E3B] shadow-2xs scale-105'
                            : 'bg-stone-50 dark:bg-[#1C3630] hover:bg-emerald-50 hover:text-[#064E3B] hover:border-emerald-200 border-stone-200 dark:border-[#23453E] text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: ACADEMIC PERCENTAGE */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-editorial">
                  Academic Percentage
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Enter your score from your latest qualifying exam (Class 10th, 12th, Diploma, or recent semester).
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Percentage Score (0 - 100%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={percentageInput}
                    onChange={(e) => handlePercentageChange(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-stone-200 dark:border-[#23453E] bg-white dark:bg-[#1C3630] text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all shadow-2xs"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 font-bold text-lg">
                    %
                  </span>
                </div>

                {/* Quick Percent Chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Common Benchmarks
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '50% (Passing)', val: 50 },
                      { label: '60% (1st Class)', val: 60 },
                      { label: '75% (Distinction)', val: 75 },
                      { label: '80% (MYSY cutoff)', val: 80 },
                      { label: '90%+ (National Merit)', val: 90 },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => handlePercentageChange(chip.val.toString())}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          answers.academicPercentage === chip.val
                            ? 'bg-[#064E3B] text-amber-100 border-[#064E3B] shadow-2xs scale-105'
                            : 'bg-stone-50 dark:bg-[#1C3630] hover:bg-emerald-50 hover:text-[#064E3B] hover:border-emerald-200 border-stone-200 dark:border-[#23453E] text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: ADDITIONAL CIRCUMSTANCES */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-editorial">
                  Additional Circumstances
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Optional criteria for exclusive affirmative welfare grants (e.g. AICTE Saksham, Swanath).
                </p>
              </div>

              <div className="space-y-4">
                {/* Disability */}
                <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Person with Disability (Divyangjan)?
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Unlocks AICTE Saksham grant
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, isDisability: true })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          answers.isDisability
                            ? 'bg-[#064E3B] text-white shadow-xs scale-105'
                            : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, isDisability: false })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          !answers.isDisability
                            ? 'bg-stone-700 text-white dark:bg-stone-600 shadow-xs scale-105'
                            : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {answers.isDisability && (
                    <div className="pt-2 border-t border-stone-200 dark:border-[#1E3A33] flex items-center justify-between animate-in fade-in">
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Disability Percentage on Medical Certificate:
                      </span>
                      <div className="flex items-center gap-1.5 w-28">
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={answers.disabilityPercentage || 40}
                          onChange={(e) =>
                            setAnswers({
                              ...answers,
                              disabilityPercentage: parseInt(e.target.value, 10) || 40,
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-[#23453E] bg-white dark:bg-[#142420] text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                        />
                        <span className="text-xs font-bold text-stone-500">%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Orphan / Single Parent */}
                <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Orphan / Wards of COVID-19?
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Unlocks AICTE Swanath scheme
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, isOrphan: !answers.isOrphan })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      answers.isOrphan
                        ? 'bg-[#064E3B] text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    {answers.isOrphan ? 'Yes' : 'No'}
                  </button>
                </div>

                {/* Armed Forces / Paramilitary Ward */}
                <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Ward of Armed Forces / CAPF?
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Unlocks AICTE Swanath & defence welfare assistance
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, isDefenceWard: !answers.isDefenceWard })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      answers.isDefenceWard
                        ? 'bg-[#064E3B] text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    {answers.isDefenceWard ? 'Yes' : 'No'}
                  </button>
                </div>

                {/* Religious Minority */}
                <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Belong to a Notified Religious Minority?
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Muslim, Christian, Sikh, Buddhist, Jain, or Parsi
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, isMinority: !answers.isMinority })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      answers.isMinority
                        ? 'bg-[#064E3B] text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                    }`}
                  >
                    {answers.isMinority ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons: Back & Continue (Prompt §§4-7) */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#182E29] hover:-translate-x-0.5 active:translate-x-0 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-md shadow-[#064E3B]/20 hover:shadow-lg hover:shadow-[#064E3B]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:ring-offset-2 cursor-pointer"
          >
            <span>{currentStep === totalSteps ? 'Find My Scholarships' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 group-active:translate-x-1.5 transition-transform duration-200 ease-out shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
