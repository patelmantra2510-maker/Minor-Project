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
  Sparkles,
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
  const totalSteps = 6;

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
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const stepTitles = [
    'Where do you study or reside?',
    'What are you studying?',
    'Course Stream & Year',
    'Category & Gender',
    'Income & Percentage',
    'Additional Conditions',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Header & Progress Indicator */}
      <div className="mb-8 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#142420] text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Step {currentStep} of {totalSteps}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] dark:text-emerald-400 font-editorial">
          {stepTitles[currentStep - 1]}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Zero login · Answers evaluated only for this session
        </p>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 dark:bg-[#1E3A33] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#064E3B] dark:bg-emerald-500 transition-all duration-300 -translate-y-1/2 z-0"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (stepNum < currentStep) setCurrentStep(stepNum);
                  }}
                  disabled={stepNum > currentStep}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all ${
                    isPassed
                      ? 'bg-[#064E3B] text-amber-100 cursor-pointer'
                      : isCurrent
                      ? 'bg-[#064E3B] text-amber-100 ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110'
                      : 'bg-stone-200 dark:bg-[#1C3630] text-stone-500 dark:text-stone-400 cursor-not-allowed'
                  }`}
                  aria-label={`Go to step ${stepNum}`}
                >
                  {isPassed ? '✓' : stepNum}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-medium text-stone-400 mt-2 px-1">
            <span>Location</span>
            <span>Level</span>
            <span>Stream</span>
            <span>Category</span>
            <span>Finances</span>
            <span>Special</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-10 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs transition-all">
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: LOCATION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
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
                className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  answers.location === 'Gujarat'
                    ? 'border-[#064E3B] bg-emerald-50/60 dark:bg-[#1C3630] shadow-sm'
                    : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-[#132A24] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  {answers.location === 'Gujarat' && (
                    <CheckCircle2 className="w-6 h-6 text-[#064E3B] dark:text-emerald-400" />
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
                className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  answers.location === 'Other Indian State'
                    ? 'border-[#064E3B] bg-emerald-50/60 dark:bg-[#1C3630] shadow-sm'
                    : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-[#2A2415] text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  {answers.location === 'Other Indian State' && (
                    <CheckCircle2 className="w-6 h-6 text-[#064E3B] dark:text-emerald-400" />
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
          <div className="space-y-5 animate-in fade-in">
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
                    className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                      isSelected
                        ? 'border-[#064E3B] bg-emerald-50/60 dark:bg-[#1C3630] shadow-sm'
                        : 'border-stone-200 dark:border-[#1E3A33] hover:border-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#064E3B] dark:text-emerald-400 absolute top-3 right-3" />
                    )}
                    <GraduationCap className="w-6 h-6 text-[#065F46] dark:text-emerald-400 mb-2" />
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
          <div className="space-y-6 animate-in fade-in">
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
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 ring-1 ring-[#064E3B]'
                          : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
                      }`}
                    >
                      <span className="truncate mr-2">{streamName}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0" />}
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
                        className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-[#064E3B] bg-[#064E3B] text-amber-50 shadow-xs'
                            : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
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
          <div className="space-y-6 animate-in fade-in">
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
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-300 ring-1 ring-[#064E3B]'
                          : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
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
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#064E3B] bg-[#064E3B] text-amber-50 shadow-xs'
                          : 'border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#182E29]'
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

        {/* STEP 5: INCOME & PERCENTAGE */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Family Income & Academic Score
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Enter your latest relevant academic percentage and total annual family income.
              </p>
            </div>

            {/* Income */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Annual Family Income (in ₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                  ₹
                </span>
                <input
                  type="text"
                  value={incomeInput}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  placeholder="e.g. 250000"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-300 dark:border-[#23453E] bg-white dark:bg-[#1C3630] text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '₹1.5 Lakh', val: 150000 },
                  { label: '₹2.5 Lakh (Post-Matric)', val: 250000 },
                  { label: '₹4.5 Lakh (CSSS / CMSS)', val: 450000 },
                  { label: '₹6.0 Lakh (MYSY)', val: 600000 },
                  { label: '₹8.0 Lakh (AICTE)', val: 800000 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleIncomeChange(chip.val.toString())}
                    className="px-2.5 py-1 rounded-lg text-xs bg-stone-100 dark:bg-[#1C3630] hover:bg-emerald-50 hover:text-[#064E3B] text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Percentage */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Latest Academic Percentage (0 - 100%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={percentageInput}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  placeholder="e.g. 78"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 dark:border-[#23453E] bg-white dark:bg-[#1C3630] text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                  %
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: ADDITIONAL CONDITIONS */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Additional Circumstances
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Optional criteria for exclusive affirmative welfare grants (e.g. AICTE Saksham, Swanath).
              </p>
            </div>

            <div className="space-y-4">
              {/* Disability */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] space-y-3">
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        answers.isDisability
                          ? 'bg-[#064E3B] text-white'
                          : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, isDisability: false })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        !answers.isDisability
                          ? 'bg-stone-700 text-white dark:bg-stone-600'
                          : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300'
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
                        className="w-full px-2 py-1 rounded-lg border border-stone-300 dark:border-[#23453E] bg-white dark:bg-[#142420] text-center text-xs font-bold"
                      />
                      <span className="text-xs font-bold text-stone-500">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Orphan / Defence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Orphan Candidate?
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      AICTE Swanath
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, isOrphan: !answers.isOrphan })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      answers.isOrphan
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {answers.isOrphan ? 'Yes' : 'No'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Ward of Armed Forces?
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Defence / CAPF martyred
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, isDefenceWard: !answers.isDefenceWard })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      answers.isDefenceWard
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {answers.isDefenceWard ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>

              {/* Minority Community */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#182E29] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Notified Minority Community?
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Muslim, Christian, Sikh, Buddhist, Jain, or Parsi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, isMinority: !answers.isMinority })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    answers.isMinority
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {answers.isMinority ? 'Yes' : 'No'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#182E29]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-md shadow-[#064E3B]/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span>{currentStep === totalSteps ? 'Find My Scholarships' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
