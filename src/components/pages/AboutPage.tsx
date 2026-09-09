import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Globe2,
  MapPin,
  Lock,
} from 'lucide-react';

interface AboutPageProps {
  onStartFinder: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartFinder }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in duration-300 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>About VidyaSetu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Democratizing Scholarship Discovery
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A modern, student-centric platform designed to solve the complexity of finding and understanding higher education scholarships in Gujarat and across India.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Zero Registration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No accounts, passwords, email verification, or permanent student records. Your answers stay strictly in your browser session.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Transparent Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No artificial black-box scores. Our engine displays the exact reason why each criterion passed, requires verification, or failed.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Gujarat + National
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Curated coverage of state-level schemes like MYSY and Digital Gujarat alongside popular Central Sector and AICTE initiatives.
          </p>
        </div>
      </div>

      {/* Scope Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          What Does This Platform Cover?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Gujarat State Scholarships</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• Mukhyamantri Yuva Swavalamban Yojana (MYSY)</li>
              <li>• Hon. Chief Minister Scholarship Scheme (CMSS)</li>
              <li>• Digital Gujarat Post-Matric (SC, ST, SEBC/OBC)</li>
              <li>• Kanya Kelavani Nidhi for Girl Students</li>
              <li>• Swami Vivekananda ITI Stipend Scheme</li>
              <li>• SHODH Ph.D. Research Fellowships</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Globe2 className="w-4 h-4" />
              <span>Popular All-India Scholarships</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• PM-USP CSSS (Ministry of Education / NSP)</li>
              <li>• AICTE Pragati Scholarship for Girls</li>
              <li>• AICTE Saksham for Specially-Abled Students</li>
              <li>• AICTE Swanath for Orphans & Defence Wards</li>
              <li>• DST INSPIRE Scholarship for Higher Education</li>
              <li>• Post-Matric Scholarships for Minorities</li>
              <li>• Kotak Kanya & Tata Trusts Education Grants</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal & Application Disclaimer */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/80 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4" />
          <span>Crucial Disclaimer & Processing Policy</span>
        </div>
        <p className="leading-relaxed">
          VidyaSetu is an informational discovery guide. We do <strong>NOT</strong> accept, process, or approve scholarship applications, nor do we handle government disbursements. All applications must be submitted directly through the designated official portals (such as Digital Gujarat, MYSY, or the National Scholarship Portal).
        </p>
        <p className="leading-relaxed">
          Eligibility evaluations shown on this site are indicative estimations based solely on the criteria provided. Final eligibility, document verification, quota allocation, and selection are determined exclusively by the respective scholarship authority.
        </p>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <button
          onClick={onStartFinder}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          Try the Scholarship Finder Now →
        </button>
      </div>
    </div>
  );
};
