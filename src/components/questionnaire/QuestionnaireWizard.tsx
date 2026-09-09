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
  const totalSteps = 6; // Grouped logically into 6 comfortable phases:
  // Phase 1: Location & Domicile
  // Phase 2: Education Level
  // Phase 3: Stream & Year
  // Phase 4: Category & Gender
  // Phase 5: Annual Income & Academic Percentage
  // Phase 6: Special Circumstances

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

  // When education level changes, reset stream to the first matching option
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
        setErrorMsg('Please enter a valid annual family income (or 0).');
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
    'Location',
    'Education Level',
    'Stream & Year',
    'Category & Gender',
    'Income & Percentage',
    'Special Eligibility',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Header & Progress Indicator */}
      <div className="mb-8 sm:mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Your Scholarship Journey
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {stepTitles[currentStep - 1]}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Step {currentStep} of {totalSteps} · No login required · Answers stored only for this session
        </p>

        {/* Progress Bar & Dots */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-300 -translate-y-1/2 z-0"
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
                      ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 scale-110'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label={`Go to step ${stepNum}: ${stepTitles[idx]}`}
                >
                  {isPassed ? '✓' : stepNum}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-1">
            <span>Location</span>
            <span>Education</span>
            <span>Course</span>
            <span>Category</span>
            <span>Finances</span>
            <span>Special</span>
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gujarat government schemes require state domicile or study in Gujarat institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, location: 'Gujarat' })}
                className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  answers.location === 'Gujarat'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  {answers.location === 'Gujarat' && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Gujarat
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Eligible for Gujarat State Scholarships (MYSY, Digital Gujarat, CMSS) plus All-India programs.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAnswers({ ...answers, location: 'Other Indian State' })}
                className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  answers.location === 'Other Indian State'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  {answers.location === 'Other Indian State' && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Other Indian State
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
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
                What is your current education level?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the education qualification you are currently enrolled in or applying for.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {(
                [
                  { level: 'Diploma', desc: 'Polytechnic & Technical Diploma' },
                  { level: 'Undergraduate', desc: 'B.E., B.Tech, MBBS, B.Sc, B.Com, B.A.' },
                  { level: 'School', desc: 'Secondary & Higher Secondary (9-12)' },
                  { level: 'ITI', desc: 'Industrial Training Trade' },
                  { level: 'Postgraduate', desc: 'M.E., M.Tech, MBA, M.Sc, M.A., MD' },
                  { level: 'PhD', desc: 'Doctoral Research & Fellowship' },
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
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 absolute top-3 right-3" />
                    )}
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.level}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: STREAM & YEAR (Dynamic!) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Stream & Academic Year
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Showing courses dynamically filtered for{' '}
                <strong className="text-blue-600">{answers.educationLevel}</strong>.
              </p>
            </div>

            {/* Dynamic Stream Dropdown/Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="truncate mr-2">{streamName}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year of Study */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
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
                Category & Gender
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Certain government scholarships are dedicated to specific categories or girl students.
              </p>
            </div>

            {/* Social Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * Used only for programs with explicit gender criteria (e.g. AICTE Pragati, Kanya Kelavani, Kotak Kanya).
              </p>
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your latest relevant academic percentage and total annual family income.
              </p>
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Annual Family Income (in ₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="text"
                  value={incomeInput}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  placeholder="e.g. 250000"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick shortcut chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '₹1.5 Lakh', val: 150000 },
                  { label: '₹2.5 Lakh (Post-Matric Cap)', val: 250000 },
                  { label: '₹4.5 Lakh (CSSS / CMSS Cap)', val: 450000 },
                  { label: '₹6.0 Lakh (MYSY Cap)', val: 600000 },
                  { label: '₹8.0 Lakh (AICTE Cap)', val: 800000 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleIncomeChange(chip.val.toString())}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Percentage */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  %
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: For Diploma fresh admission, enter your 10th percentage. For Degree fresh admission, enter 12th percentage.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: SPECIAL ELIGIBILITY */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Special Eligibility Conditions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Optional criteria used for exclusive reservation and affirmative schemes (e.g. Saksham, Swanath).
              </p>
            </div>

            <div className="space-y-4">
              {/* Disability */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Are you a Person with Disability (Divyangjan)?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Unlocks AICTE Saksham and special assistance grants.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, isDisability: true })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        answers.isDisability
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswers({ ...answers, isDisability: false })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        !answers.isDisability
                          ? 'bg-slate-700 text-white dark:bg-slate-600'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {answers.isDisability && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between animate-in fade-in">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs font-bold"
                      />
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Orphan / Armed Forces Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Orphan Candidate?
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      For AICTE Swanath scheme
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, isOrphan: !answers.isOrphan })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      answers.isOrphan
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {answers.isOrphan ? 'Yes' : 'No'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Ward of Armed Forces?
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {answers.isDefenceWard ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>

              {/* Minority Community */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Notified Minority Community?
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Muslim, Christian, Sikh, Buddhist, Jain, or Parsi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnswers({ ...answers, isMinority: !answers.isMinority })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    answers.isMinority
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {answers.isMinority ? 'Yes' : 'No'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span>{currentStep === totalSteps ? 'Find Matching Scholarships' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
