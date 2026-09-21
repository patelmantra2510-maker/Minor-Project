import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import { localProfileStorage } from '../services/storage/localProfileStorage';
import { calculateProfileCompletion } from '../engine/structuredEligibilityEvaluator';
import { GoogleIcon } from '../components/auth/GoogleIcon';
import type { StudentAnswers } from '../types/scholarship';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Edit2,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  Bookmark,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface AccountPageProps {
  onNavigate: (route: string) => void;
  studentAnswers?: StudentAnswers | null;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, studentAnswers }) => {
  const { user, isAuthenticated, loading, logout, updateUserProfile, updatePassword } = useAuth();
  const { t } = useLanguage();
  const { savedIds } = useSaved();
  const { compareIds, openCompareModal } = useCompare();
  const isGoogleUser = user?.provider === 'google';

  // Profile completion calculation
  const [profilePercentage, setProfilePercentage] = useState<number>(0);
  const [isProfileReady, setIsProfileReady] = useState<boolean>(false);

  useEffect(() => {
    const computeCompletion = async () => {
      if (studentAnswers && Object.keys(studentAnswers).length > 0) {
        const stats = calculateProfileCompletion(studentAnswers);
        setProfilePercentage(stats.percentage);
        setIsProfileReady(stats.isReady);
        return;
      }

      // Check local profile storage if studentAnswers not passed
      const profile = await localProfileStorage.getProfile();
      if (profile && profile.fields) {
        const stats = calculateProfileCompletion(profile);
        setProfilePercentage(stats.percentage);
        setIsProfileReady(stats.isReady);
      } else {
        setProfilePercentage(0);
        setIsProfileReady(false);
      }
    };

    computeCompletion();
  }, [studentAnswers]);

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameMessage({ type: 'error', text: 'Name cannot be blank.' });
      return;
    }

    setNameSaving(true);
    setNameMessage(null);
    try {
      const res = await updateUserProfile({ name: nameInput.trim() });
      if (res.success) {
        setNameMessage({
          type: 'success',
          text: t('accountPage.nameUpdatedSuccess', undefined, 'Your name has been updated successfully.'),
        });
        setIsEditingName(false);
      } else {
        setNameMessage({ type: 'error', text: res.error || 'Failed to update name.' });
      }
    } catch {
      setNameMessage({ type: 'error', text: 'An unexpected error occurred while updating your name.' });
    } finally {
      setNameSaving(false);
    }
  };

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: t('accountPage.passwordTooShort', undefined, 'Password must be at least 8 characters long.'),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: t('accountPage.passwordsDoNotMatch', undefined, 'Passwords do not match.'),
      });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.success) {
        setPasswordMessage({
          type: 'success',
          text: t('accountPage.passwordUpdatedSuccess', undefined, 'Your password has been updated successfully.'),
        });
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      } else {
        setPasswordMessage({ type: 'error', text: res.error || 'Failed to update password.' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An unexpected error occurred while updating your password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Format creation date safely
  const formattedMemberDate = React.useMemo(() => {
    if (!user?.createdAt) return 'Recent';
    try {
      const d = new Date(user.createdAt);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    } catch {
      return 'Recent';
    }
  }, [user?.createdAt]);

  // If initial auth is still checking
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-3 text-stone-500 dark:text-stone-400">
          <div className="w-8 h-8 rounded-full border-3 border-stone-300 dark:border-stone-600 border-t-[#064E3B] dark:border-t-emerald-400 animate-spin" />
          <span className="text-xs font-medium">Loading account details...</span>
        </div>
      </div>
    );
  }

  // GUEST STATE: Clean invitation to Sign In or Create Account
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-140px)] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-[#142420] rounded-3xl border border-[#DFD8CC] dark:border-[#23453E] shadow-xl p-8 sm:p-10 space-y-6 text-center animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#064E3B] dark:text-emerald-400 mx-auto shadow-2xs">
            <User className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-editorial text-[#064E3B] dark:text-emerald-300">
              {t('accountPage.guestTitle', undefined, 'Sign in to access your account')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {t(
                'accountPage.guestDesc',
                undefined,
                'Create an account or sign in to synchronize your profile, saved scholarships, and compare lists across devices.'
              )}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{t('accountPage.signInBtn', undefined, 'Sign In')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className="w-full py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>{t('auth.createAccountBtn', undefined, 'Create Account')}</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full text-center text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 pt-1"
            >
              {t('accountPage.continueAsGuestBtn', undefined, 'Continue as Guest')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED STATE: Clean, high-contrast Account Page
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300 space-y-8">
      {/* 1. HERO GREETING BANNER */}
      <div className="bg-linear-to-br from-[#064E3B] via-[#043D2E] to-[#0A261E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0B5441] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User avatar'}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-emerald-400/40 shadow-md object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600/40 border border-emerald-400/30 flex items-center justify-center text-white text-2xl font-bold font-editorial shrink-0">
                {(user?.name || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/15 text-amber-300 text-xs font-bold border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('accountPage.statusConnected', undefined, 'Account connected ✓')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial tracking-tight">
                {t('accountPage.welcomeBack', { name: user?.name || 'Student' }, `Welcome back, ${user?.name || 'Student'}`)}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
                {t('accountPage.subtitle', undefined, 'Manage your Edvora account identity, security, and synchronized journey.')}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={async () => {
                await logout();
                onNavigate('home');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('accountPage.signOutBtn', undefined, 'Sign Out')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID: ACCOUNT INFO + YOUR JOURNEY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Account Information (Identity) */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#1E3A33] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-white">
                  {t('accountPage.accountInfoHeading', undefined, 'Account Information')}
                </h2>
              </div>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#065F46] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t('accountPage.editNameBtn', undefined, 'Edit Name')}</span>
                </button>
              )}
            </div>

            {/* Name Update Alert */}
            {nameMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
                  nameMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                }`}
              >
                {nameMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{nameMessage.text}</span>
              </div>
            )}

            {/* Full Name Display or Edit Form */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {t('accountPage.fullNameLabel', undefined, 'Full Name')}
              </span>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="space-y-3 pt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-300 dark:border-[#28483F] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={nameSaving}
                      className="px-3 py-1.5 rounded-lg bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{nameSaving ? t('accountPage.savingChanges', undefined, 'Saving...') : t('accountPage.saveChangesBtn', undefined, 'Save Changes')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(user?.name || '');
                        setIsEditingName(false);
                        setNameMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#28483F] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] text-xs font-semibold cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t('accountPage.cancelBtn', undefined, 'Cancel')}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {user?.name || 'Not provided'}
                </p>
              )}
            </div>

            {/* Email Address (Safe & Read-Only) */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  {t('accountPage.emailLabel', undefined, 'Email Address')}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Verified · Read-only</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>

            {/* Account Status & Joined Date */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  {t('accountPage.accountStatusLabel', undefined, 'Account Status')}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Active</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Joined
                </span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{formattedMemberDate}</span>
                </div>
              </div>
            </div>

            {/* Sign-in Method */}
            <div className="pt-2 border-t border-stone-100 dark:border-[#1E3A33] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Sign-in Method
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1C3630] text-xs font-semibold text-stone-700 dark:text-stone-200">
                {isGoogleUser ? (
                  <>
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>{t('accountPage.googleAccountBadge', undefined, 'Google Account')}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t('accountPage.emailAccountBadge', undefined, 'Email & Password')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Your Edvora Journey */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-[#1E3A33] pb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-white">
                {t('accountPage.journeyHeading', undefined, 'Your Edvora Journey')}
              </h2>
            </div>

            {/* Profile Completion Progress Card */}
            <div className="bg-[#FAF8F5] dark:bg-[#182E29] rounded-2xl p-4 sm:p-5 border border-[#E8E2D7] dark:border-[#1E3A33] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                  {t('accountPage.profileCompletionLabel', undefined, 'Profile Completion')}
                </span>
                <span className="text-sm font-black text-[#064E3B] dark:text-emerald-400 font-mono">
                  {profilePercentage}%
                </span>
              </div>

              {/* Editorial Progress Bar */}
              <div className="h-2 rounded-full bg-stone-200 dark:bg-[#203D34] overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#064E3B] via-emerald-500 to-amber-400 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.max(5, profilePercentage)}%` }}
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                {isProfileReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {isProfileReady
                    ? t('accountPage.profileReadyNotice', undefined, 'Ready for scholarship matching')
                    : t(
                        'accountPage.profileNeedsInfoNotice',
                        undefined,
                        'Some information is still needed for accurate scholarship matching.'
                      )}
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onNavigate('find')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t('accountPage.viewEditProfileBtn', undefined, 'View / Edit Profile')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Saved & Compared Scholarship Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Saved */}
              <button
                onClick={() => onNavigate('saved')}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#182E29] border border-stone-200 dark:border-[#23453E] hover:border-amber-400 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1.5">
                  <Bookmark className="w-4 h-4" />
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-white font-mono">
                  {savedIds.length}
                </div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block mt-0.5">
                  {t('accountPage.savedScholarshipsLabel', undefined, 'Saved Scholarships')}
                </span>
              </button>

              {/* Compare */}
              <button
                onClick={openCompareModal}
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#182E29] border border-stone-200 dark:border-[#23453E] hover:border-emerald-400 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[#065F46] dark:text-emerald-400 mb-1.5">
                  <SlidersHorizontal className="w-4 h-4" />
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-white font-mono">
                  {compareIds.length}
                </div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block mt-0.5">
                  {t('accountPage.comparedScholarshipsLabel', undefined, 'Compared Scholarships')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECURITY & CREDENTIALS SECTION */}
      <div className="bg-white dark:bg-[#142420] rounded-3xl p-6 sm:p-7 border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-[#1E3A33] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-editorial text-stone-900 dark:text-white">
                {t('accountPage.securityHeading', undefined, 'Security & Password')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isGoogleUser
                  ? t(
                      'accountPage.oauthSecurityNote',
                      undefined,
                      'Your account is managed securely via Google Sign-In. Password updates are managed through your Google account.'
                    )
                  : t('accountPage.securityDesc', undefined, 'Update your account password using secure authentication.')}
              </p>
            </div>
          </div>

          {!isGoogleUser && !isChangingPassword && (
            <button
              onClick={() => {
                setIsChangingPassword(true);
                setPasswordMessage(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#28483F] hover:bg-stone-50 dark:hover:bg-[#1C3630] text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('accountPage.changePasswordBtn', undefined, 'Change Password')}</span>
            </button>
          )}
        </div>

        {/* Google OAuth Account Notice */}
        {isGoogleUser && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#182E29]/60 border border-emerald-200/60 dark:border-[#28483F] flex items-start gap-3">
            <GoogleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
              <strong className="block text-[#064E3B] dark:text-emerald-300 font-semibold">
                {t('accountPage.googleAccountBadge', undefined, 'Google Account Connected')}
              </strong>
              <p>
                {t(
                  'accountPage.oauthSecurityNote',
                  undefined,
                  'Your account is managed securely via Google Sign-In. Password updates are managed through your Google account.'
                )}
              </p>
            </div>
          </div>
        )}

        {/* Password Message */}
        {passwordMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              passwordMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
            }`}
          >
            {passwordMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        {/* Expandable Password Update Form */}
        {isChangingPassword && (
          <form onSubmit={handleUpdatePassword} className="max-w-lg space-y-4 pt-1 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('accountPage.newPasswordLabel', undefined, 'New Password')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('accountPage.newPasswordPlaceholder', undefined, 'Min. 8 characters')}
                  className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-300 dark:border-[#28483F] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                {t('accountPage.confirmNewPasswordLabel', undefined, 'Confirm New Password')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('accountPage.confirmNewPasswordPlaceholder', undefined, 'Re-enter your new password')}
                  className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-[#FAF8F5] dark:bg-[#182E29] border border-stone-300 dark:border-[#28483F] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{passwordSaving ? t('accountPage.updatingPassword', undefined, 'Updating...') : t('accountPage.updatePasswordBtn', undefined, 'Update Password')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewPassword('');
                  setConfirmPassword('');
                  setIsChangingPassword(false);
                  setPasswordMessage(null);
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#28483F] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1C3630] text-xs font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('accountPage.cancelBtn', undefined, 'Cancel')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4. FOOTER QUICK ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <p className="text-xs text-stone-400 dark:text-stone-500 text-center sm:text-left">
          Edvora AI Scholarship Finder · Complete Privacy & Transparency
        </p>

        <button
          onClick={() => onNavigate('explore')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#064E3B] dark:text-emerald-300 bg-emerald-50 dark:bg-[#1C3630] hover:bg-emerald-100 dark:hover:bg-[#23453E] border border-emerald-200 dark:border-[#23453E] transition-all cursor-pointer"
        >
          <span>{t('accountPage.browseScholarshipsBtn', undefined, 'Browse Scholarships')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
