import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../context/AIContext';
import { useLanguage } from '../../context/LanguageContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { AIScholarshipCard } from './AIScholarshipCard';
import {
  X,
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  Maximize2,
} from 'lucide-react';

import { AIMarkdownRenderer } from './AIMarkdownRenderer';

interface AIChatPanelProps {
  onNavigate: (route: string) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ onNavigate }) => {
  const {
    isOpen,
    mode,
    currentScholarship,
    messages,
    isLoading,
    error,
    closeAI,
    clearChat,
    sendMessage,
    openScholarshipAI,
  } = useAI();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    sendMessage(text);
  };

  const handleQuickChip = (promptText: string, quickKey?: string) => {
    if (isLoading) return;
    sendMessage(promptText, quickKey);
  };

  const suggestedGlobalQuestions = [
    { label: t('ai.suggestedFindForMe', undefined, 'Find scholarships for me'), query: 'Find scholarships for me' },
    { label: t('ai.suggestedDiploma', undefined, 'Scholarships for diploma students'), query: 'Which scholarships are available for diploma students?' },
    { label: t('ai.suggestedGujarat', undefined, 'What scholarships are available in Gujarat?'), query: 'What scholarships can I apply for in Gujarat?' },
    { label: t('ai.suggestedHowToApply', undefined, 'How do I apply for a scholarship?'), query: 'How do I apply for a scholarship?' },
    { label: t('ai.suggestedCompare', undefined, 'Compare scholarships'), query: 'Compare MYSY and CSSS' },
  ];

  const scholarshipQuickChips = [
    { label: t('ai.chipEligibility', undefined, 'Check My Eligibility'), key: 'eligibility', query: 'What are the exact eligibility criteria for this scholarship and do I match?' },
    { label: t('ai.chipDocuments', undefined, 'Required Documents'), key: 'documents', query: 'What documents are required to apply for this scholarship?' },
    { label: t('ai.chipHowToApply', undefined, 'How to Apply'), key: 'howToApply', query: 'How do I apply step by step?' },
    { label: t('ai.chipDeadline', undefined, 'Deadline'), key: 'deadline', query: 'What is the application deadline and status?' },
    { label: t('ai.chipBenefits', undefined, 'Benefits'), key: 'benefits', query: 'What are the financial assistance and benefits provided?' },
    { label: t('ai.chipOfficialSource', undefined, 'Official Source'), key: 'officialSource', query: 'What is the verified official application website?' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edvora AI Assistant"
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      {/* Click outside to close (desktop overlay) */}
      <div className="absolute inset-0 -z-10" onClick={closeAI} />

      {/* Slide-in drawer container */}
      <div className="bg-[#FAF8F5] dark:bg-[#0E1A17] w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-[#E8E2D7] dark:border-[#1E3A33] animate-in slide-in-from-right duration-300 relative z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#142420] border-b border-[#E8E2D7] dark:border-[#1E3A33] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#064E3B] to-emerald-600 flex items-center justify-center text-amber-300 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial font-bold text-slate-900 dark:text-white text-base">
                  {mode === 'scholarship' ? t('ai.panelTitleScholarship', undefined, 'Ask Edvora AI') : t('ai.panelTitleGlobal', undefined, 'Ask Edvora')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {mode === 'scholarship' ? 'Scholarship Mode' : 'Global Assistant'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[260px] sm:max-w-xs mt-0.5">
                {mode === 'scholarship' && currentScholarship
                  ? currentScholarship.name
                  : t('ai.noSpecificScholarship', undefined, 'General Edvora scholarship assistant')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                closeAI();
                if (currentScholarship) {
                  onNavigate(`ai?scholarshipId=${currentScholarship.id}`);
                } else {
                  onNavigate('ai');
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#064E3B] dark:text-emerald-300 bg-emerald-50 dark:bg-[#1A2E28] hover:bg-emerald-100 dark:hover:bg-[#223E36] border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer mr-1"
              title={t('aiPage.openInFullAI', undefined, 'Open Full AI')}
              aria-label="Open Full AI"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold hidden sm:inline">{t('aiPage.openInFullAI', undefined, 'Open Full AI')}</span>
            </button>
            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors"
              title={t('ai.clearChat', undefined, 'Clear chat')}
              aria-label="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={closeAI}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1C3630] transition-colors"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message stream area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Mode 1: Global Welcome Banner if no messages */}
          {mode === 'global' && messages.length === 0 && (
            <div className="text-center py-6 px-4 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-[#1A2E28] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-slate-900 dark:text-white">
                {t('ai.welcomeTitle', undefined, "Hi! I'm Edvora.")}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                {t('ai.welcomeSubtitle', undefined, 'What would you like to know about scholarships?')}
              </p>

              {/* Suggested Questions */}
              <div className="mt-5 text-left">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  {t('ai.suggestedTitle', undefined, 'Suggested questions')}
                </span>
                <div className="flex flex-col gap-1.5">
                  {suggestedGlobalQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickChip(q.query)}
                      className="text-left text-xs p-2.5 rounded-xl bg-stone-50 dark:bg-[#1A2E28] hover:bg-emerald-50 dark:hover:bg-[#203D35] hover:text-[#064E3B] dark:hover:text-emerald-300 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-[#23453E] transition-all flex items-center justify-between group"
                    >
                      <span>{q.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-in fade-in duration-200 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed max-w-[88%] ${
                    isUser
                      ? 'bg-[#064E3B] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white dark:bg-[#142420] text-stone-800 dark:text-stone-200 border border-[#E8E2D7] dark:border-[#1E3A33] rounded-tl-xs shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div>
                      <AIMarkdownRenderer content={msg.content} onNavigate={onNavigate} />

                      {/* Embedded Recommended Scholarship Cards */}
                      {msg.payload?.scholarshipIds && msg.payload.scholarshipIds.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-stone-100 dark:border-[#1E3A33] space-y-2">
                          {msg.payload.scholarshipIds.map((sid) => {
                            const sc = SCHOLARSHIPS_DATA.find((s) => s.id === sid);
                            if (!sc) return null;
                            return (
                              <AIScholarshipCard
                                key={sc.id}
                                scholarship={sc}
                                onViewDetails={(slug) => {
                                  onNavigate(`scholarships/${slug}`);
                                }}
                                onSelectForAI={(id) => {
                                  openScholarshipAI(id);
                                }}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Action buttons attached to AI response */}
                      {msg.payload?.actions && msg.payload.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-[#1E3A33]">
                          {msg.payload.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => {
                                if (act.type === 'view_scholarship' && act.payload) {
                                  onNavigate(`scholarships/${act.payload}`);
                                } else if (act.type === 'explore') {
                                  onNavigate('explore');
                                } else if (act.type === 'find') {
                                  onNavigate('find');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#064E3B] hover:text-white dark:bg-[#1C3630] text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors border border-stone-200 dark:border-[#23453E]"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-stone-200 dark:bg-[#1C3630] text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 animate-in fade-in">
              <div className="w-7 h-7 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] rounded-tl-xs shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#064E3B] dark:bg-emerald-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#064E3B] dark:bg-emerald-400 animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-[#064E3B] dark:bg-emerald-400 animate-pulse delay-300" />
                <span className="text-xs text-stone-500 font-medium ml-1">
                  {mode === 'scholarship' && messages.length === 0
                    ? t('ai.generatingGuide', undefined, 'Generating complete verified guide...')
                    : 'Thinking...'}
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => {
                  if (mode === 'scholarship' && currentScholarship) {
                    clearChat();
                  } else {
                    sendMessage('Find scholarships for me');
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 shrink-0"
              >
                {t('ai.tryAgain', undefined, 'Try Again')}
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips for Mode 2 (Scholarship-Specific) */}
        {mode === 'scholarship' && currentScholarship && (
          <div className="px-4 py-2 border-t border-stone-200/60 dark:border-[#1A2E28] bg-white/60 dark:bg-[#12221E]/60 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 w-max">
              {scholarshipQuickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickChip(chip.query, chip.key)}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#1A2E28] hover:bg-emerald-50 dark:hover:bg-[#203D35] hover:text-[#064E3B] dark:hover:text-emerald-300 text-[11px] font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#23453E] transition-all whitespace-nowrap shadow-2xs disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#142420] border-t border-[#E8E2D7] dark:border-[#1E3A33] shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'scholarship' && currentScholarship
                  ? `Ask about ${currentScholarship.shortName}...`
                  : t('ai.inputPlaceholder', undefined, 'Ask a question about scholarships...')
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#1A2E28] text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 border border-stone-200 dark:border-[#23453E] focus:outline-none focus:border-[#065F46] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#065F46] transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send question"
              className="p-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#044734] text-amber-100 disabled:opacity-40 disabled:hover:bg-[#064E3B] transition-all shadow-xs flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center mt-2 leading-tight">
            {t('ai.disclaimer', undefined, 'Edvora AI provides guidance strictly based on verified dataset records and official sources.')}
          </p>
        </div>
      </div>
    </div>
  );
};
