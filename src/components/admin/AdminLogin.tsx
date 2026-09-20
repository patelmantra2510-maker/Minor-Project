import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { EdvoraLogo } from '../common/EdvoraLogo';
import { Shield, KeyRound, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrator password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login(password.trim());
      if (!res.success) {
        setError(res.error || 'Invalid password. Access denied.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#F7F5F0] to-[#EFECE6] dark:from-[#08100E] dark:to-[#0C1513] text-stone-900 dark:text-stone-100">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Edvora Website</span>
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 rounded-3xl shadow-xl shadow-stone-900/5 p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#064E3B] via-[#D97706] to-[#064E3B]" />

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <EdvoraLogo variant="navbar" showTagline={false} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Administrative Portal</span>
            </div>

            <h1 className="text-2xl font-bold font-editorial text-stone-900 dark:text-white tracking-tight">
              Sign In to Management
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Authorized administrators only. Manage scholarships, categories, and live platform data.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 dark:bg-[#0A1613] border border-stone-200 dark:border-emerald-900/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-400 text-stone-900 dark:text-white placeholder-stone-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span>Default development key: <code className="bg-stone-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-mono">admin123</code></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-sm font-bold shadow-md shadow-emerald-950/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Access Admin Control Center</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-emerald-950/60 text-center text-[11px] text-stone-400 dark:text-stone-500">
            Protected by Edvora Security Framework & SQLite Session Tokens
          </div>
        </div>
      </div>
    </div>
  );
};
