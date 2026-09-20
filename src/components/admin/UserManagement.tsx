import React from 'react';
import { Shield, Lock, CheckCircle2, HeartHandshake } from 'lucide-react';

export const UserManagement: React.FC = () => {
  return (
    <div className="space-y-8 animate-page-enter">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
          User & Privacy Management
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Edvora's privacy-by-design user architecture, local bookmark statistics, and administrative session security.
        </p>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold font-editorial text-emerald-950 dark:text-emerald-50">
              Zero-PII Privacy Architectural Guarantee
            </h3>
            <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
              Unlike commercial portals that harvest student Aadhaar numbers, phone numbers, and caste certificates into marketing databases, Edvora requires <strong>no mandatory registration or public user accounts</strong>.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Student Responses:</strong> Kept strictly in browser <code>sessionStorage</code> and cleared when tab closes.
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Saved Bookmarks:</strong> Retained on student's private device via <code>localStorage</code> (never sent to server).
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#0A1613]/70 border border-emerald-200/60 dark:border-emerald-900/40">
                <strong>Admin Authority:</strong> Isolated to verified staff via HMAC SHA-256 session tokens.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrator Accounts Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Administrator Accounts & Permissions
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            1 Active Session
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-emerald-950/60 text-stone-400 uppercase font-semibold">
                <th className="pb-3">Identity</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Authentication Mode</th>
                <th className="pb-3">Access Level</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-emerald-950/40">
              <tr>
                <td className="py-3 font-bold text-stone-900 dark:text-white">
                  Lead Administrator (Staff)
                </td>
                <td className="py-3 text-stone-600 dark:text-stone-400">
                  Platform Owner & Curator
                </td>
                <td className="py-3 font-mono text-[11px] text-stone-500">
                  HMAC-SHA256 Token
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold text-[10px]">
                    Full CRUD / Verified / Featured
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authenticated</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>Security & Server Configuration</span>
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed">
          To modify the default administrator passphrase, define <code>ADMIN_PASSWORD</code> in your environment or <code>.env</code> file. Administrative tokens expire automatically after 24 hours of inactivity.
        </p>
      </div>
    </div>
  );
};
