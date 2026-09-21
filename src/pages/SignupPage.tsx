import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateEmail, validatePassword, validateConfirmPassword } from '../auth/authValidation';
import { EdvoraLogo } from '../components/common/EdvoraLogo';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import { GoogleRecaptcha, type GoogleRecaptchaRef } from '../components/auth/GoogleRecaptcha';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Compass,
  Loader2,
} from 'lucide-react';

interface SignupPageProps {
  onNavigate: (route: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup, loginWithGoogle, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState(false);

  const recaptchaRef = React.useRef<GoogleRecaptchaRef>(null);

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('home');
    }
  }, [isAuthenticated, onNavigate]);

  // Check for any OAuth errors passed via URL
  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('error=access_denied') || hash.includes('error_code=access_denied')) {
      setErrorMessage(t('auth.errors.googleCancelled', undefined, 'Google sign-in was cancelled.'));
    } else if (hash.includes('error=')) {
      setErrorMessage(
        t(
          'auth.errors.googleUnavailable',
          undefined,
          'Google sign-in is temporarily unavailable. Please try email and password or continue as a guest.'
        )
      );
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || googleLoading) return;
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.error || 'Password is required.');
      return;
    }

    const confirmValidation = validateConfirmPassword(password, confirmPassword);
    if (!confirmValidation.isValid) {
      setErrorMessage(confirmValidation.error || 'Passwords do not match.');
      return;
    }

    // If reCAPTCHA is configured in the environment, require the token
    const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined)?.trim();
    if (recaptchaSiteKey && !captchaToken) {
      setErrorMessage(
        t('auth.errors.recaptchaRequired', undefined, 'Please complete the security check before continuing.')
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signup({
        name,
        email,
        password,
        captchaToken: captchaToken || undefined,
      });
      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setConfirmationNotice(true);
        } else {
          onNavigate('home');
        }
      } else {
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        setErrorMessage(result.error || 'Failed to create account.');
      }
    } catch {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setErrorMessage(null);

    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.error) {
        if (result.error.toLowerCase().includes('cancel') || result.error.toLowerCase().includes('denied')) {
          setErrorMessage(t('auth.errors.googleCancelled', undefined, 'Google sign-in was cancelled.'));
        } else if (result.error.toLowerCase().includes('network') || result.error.toLowerCase().includes('fetch')) {
          setErrorMessage(t('auth.errors.googleNetworkError', undefined, "We couldn't connect to Google right now. Please try again."));
        } else {
          setErrorMessage(
            result.error ||
            t(
              'auth.errors.googleUnavailable',
              undefined,
              'Google sign-in is temporarily unavailable. Please try email and password or continue as a guest.'
            )
          );
        }
      }
    } catch {
      setErrorMessage(
        t('auth.errors.googleNetworkError', undefined, "We couldn't connect to Google right now. Please try again.")
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#142420] rounded-3xl border border-[#DFD8CC] dark:border-[#23453E] shadow-xl overflow-hidden">
        {/* Left Column: Brand & Value Proposition */}
        <div className="lg:col-span-5 bg-linear-to-br from-[#064E3B] to-[#043E2F] text-amber-50 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <EdvoraLogo variant="navbar" inverted={true} showTagline={true} />
            </div>

            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/70 text-amber-200 border border-emerald-600/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {t('auth.createAccountTitle', undefined, 'Create your Edvora account')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-amber-50 leading-tight">
                {t(
                  'auth.createAccountSubtitle',
                  undefined,
                  'Start your personalized scholarship journey with cloud sync.'
                )}
              </h2>
            </div>

            <ul className="space-y-3 pt-4 text-xs sm:text-sm text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>One-click transfer of your guest profile answers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Automatic eligibility recalculation whenever criteria change</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>100% Free for students with verified information</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8 border-t border-emerald-800/80 text-[11px] text-emerald-200/90 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Guaranteed privacy: No commercial ads, no selling of personal data</span>
          </div>
        </div>

        {/* Right Column: Sign Up Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-editorial text-[#064E3B] dark:text-emerald-400">
                {t('auth.createAccountTitle', undefined, 'Create your Edvora account')}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Enter your details to create an account. You can complete your student profile anytime.
              </p>
            </div>

            {/* Email Confirmation Required Screen */}
            {confirmationNotice ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    {t('auth.resetSentTitle', undefined, 'Check your email')}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    We sent a verification link to <strong>{email}</strong>. Please confirm your email to activate your account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
                >
                  {t('auth.backToSignIn', undefined, 'Back to Sign In')}
                </button>
              </div>
            ) : (
              <>

                {/* Error Message */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-200"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Continue with Google (Top of authentication form) */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  aria-label={t('auth.continueWithGoogle', undefined, 'Continue with Google')}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1A332B] hover:bg-stone-50 dark:hover:bg-[#204036] text-stone-700 dark:text-stone-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                      <span>{t('auth.connectingToGoogle', undefined, 'Connecting to Google...')}</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4" />
                      <span>{t('auth.continueWithGoogle', undefined, 'Continue with Google')}</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
                  <span className="bg-white dark:bg-[#142420] px-3 text-[11px] uppercase tracking-wider text-stone-400 font-medium absolute">
                    {t('auth.orDivider', undefined, 'or')}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      {t('auth.nameLabel', undefined, 'Full Name')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('auth.namePlaceholder', undefined, 'e.g. Aarav Patel')}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      {t('auth.emailLabel', undefined, 'Email')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder', undefined, 'you@example.com')}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      {t('auth.passwordLabel', undefined, 'Password')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.passwordPlaceholder', undefined, '••••••••')}
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="signup-confirm-password"
                      className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                    >
                      {t('auth.confirmPasswordLabel', undefined, 'Confirm Password')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('auth.confirmPasswordPlaceholder', undefined, '••••••••')}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Real Google reCAPTCHA */}
                  <GoogleRecaptcha
                    ref={recaptchaRef}
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(null)}
                    onError={() => {
                      setCaptchaToken(null);
                      setErrorMessage(
                        t('auth.errors.recaptchaFailed', undefined, 'Security verification failed. Please try again.')
                      );
                    }}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>{t('auth.creatingAccount', undefined, 'Creating account...')}</span>
                    ) : (
                      <>
                        <span>{t('auth.createAccountBtn', undefined, 'Create Account')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="pt-2 text-center space-y-2">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {t('auth.alreadyHaveAccount', undefined, 'Already have an account?')}{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('login')}
                      className="font-semibold text-[#065F46] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {t('auth.signInBtn', undefined, 'Sign In')}
                    </button>
                  </p>

                  <div>
                    <button
                      type="button"
                      onClick={() => onNavigate('find')}
                      className="text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 underline cursor-pointer"
                    >
                      {t('auth.continueAsGuest', undefined, 'Continue as Guest')} →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
