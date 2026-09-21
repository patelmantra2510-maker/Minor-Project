import React, { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateEmail } from '../auth/authValidation';
import { EdvoraLogo } from '../components/common/EdvoraLogo';
import { GoogleRecaptcha, type GoogleRecaptchaRef } from '../components/auth/GoogleRecaptcha';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage(null);

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email.');
      return;
    }

    const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined)?.trim();
    if (recaptchaSiteKey && !captchaToken) {
      setErrorMessage(
        t('auth.errors.recaptchaRequired', undefined, 'Please complete the security check before continuing.')
      );
      return;
    }


    setLoading(true);
    try {
      const result = await resetPassword(email, captchaToken || undefined);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        setErrorMessage(result.error || 'Failed to send reset link.');
      }
    } catch {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-[#142420] rounded-3xl border border-[#DFD8CC] dark:border-[#23453E] shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <EdvoraLogo variant="navbar" />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#064E3B] dark:text-emerald-400 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold font-editorial text-[#064E3B] dark:text-emerald-400">
            {t('auth.resetPasswordTitle', undefined, 'Reset your password')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t(
              'auth.resetPasswordSubtitle',
              undefined,
              'Enter your email address and we will send you a password reset link.'
            )}
          </p>
        </div>


        {/* Success State */}
        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                {t('auth.resetSentTitle', undefined, 'Check your email')}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
                {t(
                  'auth.resetSentSubtitle',
                  undefined,
                  "If an account exists for this email, we've sent instructions to reset your password."
                )}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="reset-email"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                {t('auth.emailLabel', undefined, 'Email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reset-email"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>{t('auth.sendingResetLink', undefined, 'Sending link...')}</span>
              ) : (
                <>
                  <span>{t('auth.sendResetLink', undefined, 'Send Reset Link')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-[#065F46] dark:hover:text-emerald-400 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('auth.backToSignIn', undefined, 'Back to Sign In')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
