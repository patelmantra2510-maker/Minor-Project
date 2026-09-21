import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateEmail, validatePassword } from '../auth/authValidation';
import { EdvoraLogo } from '../components/common/EdvoraLogo';
import { GoogleRecaptcha, type GoogleRecaptchaRef } from '../components/auth/GoogleRecaptcha';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recaptchaRef = React.useRef<GoogleRecaptchaRef>(null);

  // If already authenticated, redirect to home immediately
  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('home');
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage(t('auth.errors.emailRequired', undefined, 'Please enter your email address.'));
      return;
    }

    const emailValidation = validateEmail(cleanEmail);
    if (!emailValidation.isValid) {
      setErrorMessage(t('auth.errors.invalidEmail', undefined, 'Please enter a valid email address.'));
      return;
    }

    if (!password) {
      setErrorMessage(t('auth.errors.passwordRequired', undefined, 'Please enter your password.'));
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.error || t('auth.errors.passwordRequired', undefined, 'Please enter your password.'));
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
      const result = await login({
        email: cleanEmail,
        password,
        captchaToken: captchaToken || undefined,
      });
      if (result.success) {
        onNavigate('home');
      } else {
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        setErrorMessage(
          result.error ||
            t(
              'auth.errors.invalidCredentials',
              undefined,
              'Email or password is incorrect. Please check your details and try again.'
            )
        );
      }
    } catch {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setErrorMessage(
        t(
          'auth.errors.networkError',
          undefined,
          "We couldn't sign you in right now. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#142420] rounded-3xl border border-[#DFD8CC] dark:border-[#23453E] shadow-xl overflow-hidden">
        {/* Left Column: High-Contrast Brand & Value Proposition (Desktop) */}
        <div className="lg:col-span-5 bg-linear-to-br from-[#064E3B] to-[#043E2F] text-amber-50 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <EdvoraLogo variant="navbar" inverted={true} showTagline={true} />
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {t('auth.welcomeBackTitle', undefined, 'Welcome Back')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-editorial leading-snug text-white">
                {t('auth.welcomeBackHeading', undefined, 'Your scholarship journey is saved and ready.')}
              </h2>
            </div>

            <ul className="space-y-3 text-xs text-emerald-100/90 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{t('auth.loginBullet1', undefined, 'Access your saved scholarships anytime')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{t('auth.loginBullet2', undefined, 'Personalized eligibility match scores')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{t('auth.loginBullet3', undefined, 'AI document assistance and checklist tracking')}</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-700/60 text-[11px] text-emerald-200">
            <span>{t('auth.freeGuarantee', undefined, '100% Free · Verified Gujarat & All-India Schemes')}</span>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-editorial text-[#064E3B] dark:text-emerald-300">
                {t('auth.signInTitle', undefined, 'Sign In')}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {t('auth.signInSubtitle', undefined, 'Sign in to continue to your Edvora profile.')}
              </p>
            </div>


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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                >
                  {t('auth.emailLabel', undefined, 'Email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', undefined, 'you@example.com')}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
                  >
                    {t('auth.passwordLabel', undefined, 'Password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-medium text-[#065F46] dark:text-emerald-400 hover:underline cursor-pointer focus:outline-none"
                  >
                    {t('auth.forgotPasswordLink', undefined, 'Forgot password?')}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder', undefined, '••••••••')}
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-[#1C3630]/50 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:border-transparent transition-all"
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

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>{t('auth.signingIn', undefined, 'Signing in...')}</span>
                ) : (
                  <>
                    <span>{t('auth.signInBtn', undefined, 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Navigation: Sign Up & Guest */}
            <div className="pt-2 text-center space-y-2">
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {t('auth.dontHaveAccount', undefined, "Don't have an account?")}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="font-semibold text-[#065F46] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {t('auth.createAccountBtn', undefined, 'Create an account')}
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
          </div>
        </div>
      </div>
    </div>
  );
};
