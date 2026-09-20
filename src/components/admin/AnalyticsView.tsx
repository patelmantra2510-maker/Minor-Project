import React from 'react';
import { Cpu, Sliders } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-page-enter">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-white">
          Engine Intelligence & AI Assistant Analytics
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Technical telemetry for the 9-dimensional deterministic eligibility engine and the multi-tier AI Assistant.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Engine Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Deterministic Eligibility Engine
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              100% Operational
            </span>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Evaluates every scholarship against 9 discrete rule dimensions with zero AI hallucination.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {[
              { label: '1. Domicile & Location Verification', desc: 'Gujarat State vs All-India eligibility' },
              { label: '2. Education Level Check', desc: 'School, Diploma, ITI, UG, PG, Ph.D.' },
              { label: '3. Approved Course / Stream Mapping', desc: 'Engineering, Medical, Science, Commerce, Arts' },
              { label: '4. Academic Year of Study', desc: '1st Year, 2nd Year, Final Year' },
              { label: '5. Social Category Criterion', desc: 'General, SC, ST, SEBC/OBC, EWS' },
              { label: '6. Gender Eligibility Check', desc: 'All, Female-specific, Male-specific' },
              { label: '7. Annual Family Income Ceiling', desc: '₹2.5L, ₹6L, ₹8L ceilings' },
              { label: '8. Academic Score Percentage Cutoff', desc: 'Prerequisite marks threshold' },
              { label: '9. Special Conditions', desc: 'PwD/Disability %, Orphan, Defence Ward, Minority' },
            ].map((rule, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0A1613] flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300">{rule.label}</span>
                <span className="text-[11px] text-stone-400">{rule.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Performance Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101D19] border border-stone-200/90 dark:border-emerald-950/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Edvora AI Assistant Telemetry
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
              Dual-Tier Active
            </span>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Multi-tier architecture ensuring instantaneous, robust guidance across devices.
          </p>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A1613] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Tier 1 Cloud LLM:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">Groq API (Qwen 3.8-27B)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Tier 2 Offline Knowledge Engine:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Ready (Zero-latency fallback)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Multilingual Execution:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">English, Gujarati, Hindi</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Private Data Isolation:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">No prompt chat logs persisted</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-emerald-950/60">
            <h4 className="font-bold text-xs uppercase text-stone-400 mb-2">Supported Language Modules</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0A1613] font-bold text-stone-800 dark:text-stone-200">
                English (en)
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0A1613] font-bold text-stone-800 dark:text-stone-200">
                ગુજરાતી (gu)
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#0A1613] font-bold text-stone-800 dark:text-stone-200">
                हिन्दी (hi)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
