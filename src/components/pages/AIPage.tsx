import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarships';
import { evaluateScholarship } from '../../engine/eligibilityEngine';
import { generateAIResponse } from '../../services/aiService';
import type { AIResponsePayload } from '../../services/aiKnowledgeEngine';
import { AIScholarshipCard } from '../ai/AIScholarshipCard';
import { AIMarkdownRenderer } from '../ai/AIMarkdownRenderer';
import { AiHeroVisual } from '../ai/AiHeroVisual';
import type { Scholarship, StudentAnswers } from '../../types/scholarship';
import {
  Sparkles,
  Send,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Search,
  FileText,
  Copy,
  Check,
  GraduationCap,
  Scale,
  Calendar,
  Layers,
} from 'lucide-react';

interface AIPageProps {
  onNavigate: (route: string) => void;
  studentAnswers?: StudentAnswers | null;
  initialScholarshipId?: string;
}

interface PageChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  payload?: AIResponsePayload;
  timestamp: number;
}

export const AIPage: React.FC<AIPageProps> = ({
  onNavigate,
  studentAnswers,
  initialScholarshipId,
}) => {
  const { language, t } = useLanguage();

  // Active scholarship focus context (if any)
  const [activeScholarshipId, setActiveScholarshipId] = useState<string | null>(
    initialScholarshipId || null
  );

  // Sync if initialScholarshipId prop changes
  useEffect(() => {
    if (initialScholarshipId) {
      setActiveScholarshipId(initialScholarshipId);
    }
  }, [initialScholarshipId]);

  const activeScholarship: Scholarship | null = useMemo(() => {
    if (!activeScholarshipId) return null;
    return (
      SCHOLARSHIPS_DATA.find(
        (s) => s.id === activeScholarshipId || s.slug === activeScholarshipId
      ) || null
    );
  }, [activeScholarshipId]);

  // Conversation history
  const [messages, setMessages] = useState<PageChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // References for scrolling and focusing
  const mainInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Copy guide notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scroll to workspace and focus input
  const handleFocusMainInput = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      mainInputRef.current?.focus();
    }, 400);
  };

  // Scroll conversation area to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Specific Scholarship Mode: Auto-generate guide if activeScholarship exists and messages are empty
  const triggerScholarshipGuide = useCallback(
    async (scholarship: Scholarship) => {
      setIsLoading(true);
      setErrorState(null);

      try {
        const matchRes = studentAnswers ? evaluateScholarship(scholarship, studentAnswers) : null;
        const res = await generateAIResponse({
          mode: 'scholarship',
          scholarshipId: scholarship.id,
          studentContext: studentAnswers,
          matchResult: matchRes,
          language,
          currentPage: 'ai',
        });

        const guideMsg: PageChatMessage = {
          id: 'guide-' + Date.now(),
          role: 'assistant',
          content: res.message,
          payload: res,
          timestamp: Date.now(),
        };

        setMessages([guideMsg]);
      } catch {
        setErrorState(t('aiPage.errorResponse', undefined, "Edvora AI couldn't prepare a response right now."));
      } finally {
        setIsLoading(false);
      }
    },
    [studentAnswers, language, t]
  );

  // When activeScholarship is set upon opening, generate initial guide
  useEffect(() => {
    if (activeScholarship && messages.length === 0) {
      triggerScholarshipGuide(activeScholarship);
    }
  }, [activeScholarship, messages.length, triggerScholarshipGuide]);

  // Send message in the AI conversation
  const handleSendMessage = async (textToSend?: string, quickKey?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputPrompt).trim();
    if (!text && !quickKey) return;

    const userMsg: PageChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text || (quickKey ? `Inquiry: ${quickKey}` : ''),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);
    setErrorState(null);

    // Smoothly scroll down to workspace
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const matchRes = activeScholarship && studentAnswers
        ? evaluateScholarship(activeScholarship, studentAnswers)
        : null;

      const convHistory = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await generateAIResponse({
        mode: activeScholarship ? 'scholarship' : 'global',
        scholarshipId: activeScholarship?.id,
        studentContext: studentAnswers,
        matchResult: matchRes,
        conversation: convHistory,
        language,
        currentPage: 'ai',
        prompt: text,
        quickKey,
      });

      const assistantMsg: PageChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: res.message,
        payload: res,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setErrorState(t('aiPage.errorResponse', undefined, "Edvora AI couldn't prepare a response right now."));
    } finally {
      setIsLoading(false);
    }
  };

  // Quick follow-up buttons for scholarship mode
  const scholarshipFollowUpChips = [
    { key: 'eligibility', label: t('ai.chipEligibility', undefined, 'Check My Eligibility') },
    { key: 'documents', label: t('ai.chipDocuments', undefined, 'Required Documents') },
    { key: 'how_to_apply', label: t('ai.chipHowToApply', undefined, 'How to Apply') },
    { key: 'deadline', label: t('ai.chipDeadline', undefined, 'Deadline') },
    { key: 'benefits', label: t('ai.chipBenefits', undefined, 'Benefits') },
    { key: 'source', label: t('ai.chipOfficialSource', undefined, 'Official Source') },
  ];

  // 6 Quick Action Cards below hero
  const quickActions = [
    {
      id: 'find',
      icon: Search,
      title: t('aiPage.qa1Title', undefined, 'Find Scholarships'),
      description: t('aiPage.qa1Desc', undefined, 'Discover scholarships that may fit you.'),
      prompt: t('ai.suggestedFindForMe', undefined, 'Find scholarships for me'),
    },
    {
      id: 'eligibility',
      icon: CheckCircle2,
      title: t('aiPage.qa2Title', undefined, 'Check Eligibility'),
      description: t('aiPage.qa2Desc', undefined, 'Understand the criteria that apply to you.'),
      prompt: 'How do I check if I am eligible for scholarships based on my criteria?',
    },
    {
      id: 'compare',
      icon: Scale,
      title: t('aiPage.qa3Title', undefined, 'Compare Scholarships'),
      description: t('aiPage.qa3Desc', undefined, 'Compare benefits and requirements.'),
      prompt: t('ai.suggestedCompare', undefined, 'Compare MYSY and CSSS scholarships'),
    },
    {
      id: 'documents',
      icon: FileText,
      title: t('aiPage.qa4Title', undefined, 'Required Documents'),
      description: t('aiPage.qa4Desc', undefined, 'Understand what documents may be needed.'),
      prompt: 'What documents are required to apply for scholarships in Gujarat and India?',
    },
    {
      id: 'how_to_apply',
      icon: GraduationCap,
      title: t('aiPage.qa5Title', undefined, 'How to Apply'),
      description: t('aiPage.qa5Desc', undefined, 'Get step-by-step application guidance.'),
      prompt: t('ai.suggestedHowToApply', undefined, 'How do I apply for scholarships step by step?'),
    },
    {
      id: 'deadlines',
      icon: Calendar,
      title: t('aiPage.qa6Title', undefined, 'Deadlines'),
      description: t('aiPage.qa6Desc', undefined, 'Check important scholarship dates.'),
      prompt: 'What are the upcoming scholarship deadlines and status across Gujarat and India?',
    },
  ];

  // 8 Suggested Questions for Empty State
  const emptyStateSuggestions = [
    t('ai.suggestedFindForMe', undefined, 'Find scholarships for me'),
    t('ai.suggestedDiploma', undefined, 'Scholarships for diploma students'),
    t('ai.suggestedGujarat', undefined, 'What scholarships are available in Gujarat?'),
    'Which scholarships may match me?',
    'What documents do I need?',
    t('ai.suggestedHowToApply', undefined, 'How do I apply for a scholarship?'),
    t('ai.suggestedCompare', undefined, 'Compare scholarships'),
    'Explain my scholarship matches',
  ];

  // Copy guide text to clipboard
  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  // Clear or reset conversation
  const handleClearChat = () => {
    setMessages([]);
    setErrorState(null);
    if (activeScholarship) {
      triggerScholarshipGuide(activeScholarship);
    }
  };

  // Clear specific scholarship focus to return to global mode
  const handleClearScholarshipFocus = () => {
    setActiveScholarshipId(null);
    setMessages([]);
    setErrorState(null);
    window.location.hash = '#/ai';
  };

  // Switch to a new scholarship context
  const handleSelectScholarshipFocus = (scholarshipId: string) => {
    setActiveScholarshipId(scholarshipId);
    setMessages([]);
    setErrorState(null);
    window.location.hash = `#/ai?scholarshipId=${scholarshipId}`;
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C1513] text-stone-900 dark:text-stone-100 transition-colors">
      {/* ========================================================================= */}
      {/* 1. AI HERO SECTION                                                        */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading & Large Input CTA (~60%) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-[#142420] border border-[#E8E2D7] dark:border-emerald-900/60 text-[#065F46] dark:text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('aiPage.badge', undefined, 'EDVORA AI')}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-stone-100 font-editorial tracking-tight leading-[1.14]">
                {t('aiPage.title', undefined, 'Your Scholarship Guide,\nPowered by Edvora')}
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t(
                  'aiPage.subtitle',
                  undefined,
                  'Ask questions, discover scholarships, understand your eligibility, and get step-by-step guidance — all in one place.'
                )}
              </p>

              {/* Small Supporting Line */}
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center lg:justify-start gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] dark:text-emerald-400" />
                <span>{t('aiPage.verifiedTag', undefined, "Built around Edvora's verified scholarship information.")}</span>
              </p>

              {/* Hero Large Input-Style CTA */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0 space-y-3">
                <div
                  onClick={handleFocusMainInput}
                  className="flex items-center gap-3 p-2 pl-4 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-md hover:border-[#065F46] dark:hover:border-emerald-600 cursor-pointer transition-all group"
                >
                  <Search className="w-4 h-4 text-stone-400 group-hover:text-[#065F46] dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                  <span className="flex-1 text-left text-xs sm:text-sm text-stone-400 dark:text-stone-500 truncate select-none">
                    {t('aiPage.heroInputPlaceholder', undefined, 'Ask Edvora anything about scholarships...')}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>{t('aiPage.heroBtnAsk', undefined, 'Ask Edvora →')}</span>
                  </button>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                  <button
                    onClick={() => onNavigate('find')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#064E3B] text-xs font-bold text-[#064E3B] dark:text-emerald-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>[ {t('aiPage.heroBtnFind', undefined, 'Find My Scholarships')} ]</span>
                  </button>
                  <span className="text-xs text-stone-400">Zero registration required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Educational Objects Composition (~40%) */}
            <div className="lg:col-span-5 flex justify-center">
              <AiHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. QUICK ACTIONS SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-12 border-t border-b border-stone-200/80 dark:border-[#1E3A33] bg-[#F4EFE6]/40 dark:bg-[#101F1B]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 dark:text-stone-100">
              {t('aiPage.quickActionsTitle', undefined, 'What can Edvora help you with?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Select any topic below to explore verified guidance instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleSendMessage(action.prompt)}
                  className="group p-5 rounded-2xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] hover:border-[#065F46] dark:hover:border-emerald-600 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left flex items-start gap-3.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#1C3630] text-[#064E3B] dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-[#064E3B] group-hover:text-amber-200 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN AI CHAT WORKSPACE                                                 */}
      {/* ========================================================================= */}
      <section ref={workspaceRef} id="ai-workspace" className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Application Workspace Card */}
          <div className="bg-white dark:bg-[#11201C] rounded-3xl border border-[#E8E2D7] dark:border-[#1E3A33] shadow-lg overflow-hidden flex flex-col min-h-[620px]">
            {/* Top Workspace Header Bar */}
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-[#142622] border-b border-[#E8E2D7] dark:border-[#1E3A33] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src="/edvora-emblem.png"
                  alt="Edvora"
                  className="w-8 h-8 object-contain drop-shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                      {t('aiPage.workspaceTitle', undefined, 'Edvora AI')}
                    </h2>
                    <span className="text-[11px] font-bold text-[#064E3B] dark:text-emerald-400">
                      • {t('aiPage.workspaceSubtitle', undefined, 'Scholarship Assistant')}
                    </span>
                  </div>

                  {/* Active Scholarship Context Indicator */}
                  {activeScholarship ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {t('aiPage.focusingOnScholarship', undefined, 'Currently discussing')}:
                      </span>
                      <span className="font-bold text-xs text-[#064E3B] dark:text-emerald-400 truncate max-w-[200px] sm:max-w-xs">
                        {activeScholarship.name}
                      </span>
                      <button
                        onClick={handleClearScholarshipFocus}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200 dark:bg-[#1E3A33] text-stone-700 dark:text-stone-300 hover:bg-stone-300 transition-colors cursor-pointer"
                        title="Clear scholarship focus and view all"
                      >
                        [ {t('aiPage.clearFocusBtn', undefined, 'View all scholarships')} ]
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {t('ai.noSpecificScholarship', undefined, 'General Edvora scholarship assistant')}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Header Badges & Actions */}
              <div className="flex items-center gap-2">
                {/* Personalized session answer badge */}
                {studentAnswers && (
                  <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#064E3B] dark:text-emerald-300 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('aiPage.usingSessionAnswers', undefined, 'Using your current session answers')}</span>
                  </div>
                )}

                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#1E3A33] transition-colors cursor-pointer"
                    title={t('ai.clearChat', undefined, 'Clear conversation')}
                    aria-label="Clear chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('ai.clearChat', undefined, 'Clear')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Stream Area */}
            <div
              className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-4 max-h-[640px]"
              aria-live="polite"
            >
              {/* EMPTY STATE (When no messages exist and not in specific scholarship mode) */}
              {messages.length === 0 && !activeScholarship && (
                <div className="py-8 sm:py-12 px-4 text-center max-w-2xl mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4">
                    <img
                      src="/edvora-emblem.png"
                      alt="Edvora"
                      className="w-10 h-10 object-contain drop-shadow-xs"
                    />
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {t('aiPage.emptyGreeting', undefined, "Hi, I'm Edvora AI.")}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-md mx-auto leading-relaxed">
                    {t(
                      'aiPage.emptyTagline',
                      undefined,
                      'Your scholarship guide for discovering, understanding, and applying for scholarships.'
                    )}
                  </p>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B] dark:text-emerald-400 mt-6 mb-3">
                    {t('aiPage.emptyPrompt', undefined, 'What would you like help with?')}
                  </p>

                  {/* 8 Suggestion Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {emptyStateSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="p-3 rounded-xl bg-stone-50/80 dark:bg-[#142622] hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-stone-200/80 dark:border-[#1E3A33] hover:border-[#064E3B] dark:hover:border-emerald-600 text-xs font-medium text-stone-700 dark:text-stone-300 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{suggestion}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#064E3B] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* No session answers prompt */}
                  {!studentAnswers && (
                    <div className="mt-8 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div>
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                          {t('aiPage.wantPersonalized', undefined, 'Want personalized scholarship suggestions?')}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          Take our 7-step questionnaire. Zero login, results remain in this session.
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigate('find')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043E2F] text-amber-50 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        {t('aiPage.takeQuestionnaire', undefined, 'Find My Scholarships')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGES LIST */}
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 animate-in fade-in duration-200 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                        <img
                          src="/edvora-emblem.png"
                          alt="Edvora"
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-[82%] shadow-xs ${
                        isUser
                          ? 'bg-[#064E3B] text-white rounded-tr-xs'
                          : 'bg-stone-50 dark:bg-[#142622] text-stone-800 dark:text-stone-200 border border-[#E8E2D7] dark:border-[#1E3A33] rounded-tl-xs'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div>
                          {/* Markdown formatted response */}
                          <AIMarkdownRenderer
                            content={msg.content}
                            onNavigate={onNavigate}
                          />

                          {/* Render actual recommended scholarship micro-cards */}
                          {msg.payload?.scholarshipIds &&
                            msg.payload.scholarshipIds.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-[#1E3A33] space-y-2">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                                  Verified Schemes Referenced:
                                </span>
                                {msg.payload.scholarshipIds.map((sid) => {
                                  const sc = SCHOLARSHIPS_DATA.find((s) => s.id === sid);
                                  if (!sc) return null;
                                  return (
                                    <AIScholarshipCard
                                      key={sc.id}
                                      scholarship={sc}
                                      onViewDetails={(slug) =>
                                        onNavigate(`scholarships/${slug}`)
                                      }
                                      onSelectForAI={(id) => {
                                        handleSelectScholarshipFocus(id);
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            )}

                          {/* Official Source Links */}
                          {msg.payload?.sourceLinks && msg.payload.sourceLinks.length > 0 && (
                            <div className="mt-3 pt-2 flex items-center gap-2 flex-wrap text-xs">
                              {msg.payload.sourceLinks.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-[#1A2E28] border border-emerald-200 dark:border-emerald-800 text-[#064E3B] dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-colors"
                                >
                                  <span>{src.title}</span>
                                  <ExternalLink className="w-3 h-3 text-amber-500" />
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Quick copy guide action */}
                          <div className="mt-3 pt-2 flex items-center justify-between border-t border-stone-200/60 dark:border-[#1E3A33] text-[11px] text-stone-400">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied to clipboard</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>{t('aiPage.copyGuide', undefined, 'Copy Guide')}</span>
                                </>
                              )}
                            </button>
                            <span>Edvora Verified Assistant</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Quick Follow-up Buttons for Scholarship Mode */}
              {activeScholarship && messages.length > 0 && !isLoading && (
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block w-full mb-1">
                    Quick Follow-Up:
                  </span>
                  {scholarshipFollowUpChips.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSendMessage(undefined, chip.key)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] text-stone-700 dark:text-stone-300 hover:border-[#064E3B] dark:hover:border-emerald-500 hover:text-[#064E3B] dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* AI Processing / Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src="/edvora-emblem.png"
                      alt="Edvora"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs p-3.5 bg-stone-50 dark:bg-[#142622] border border-[#E8E2D7] dark:border-[#1E3A33] flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300">
                    <span>{t('aiPage.loadingStatus', undefined, 'Edvora is checking the scholarship information...')}</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {errorState && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
                  <span>{errorState}</span>
                  <button
                    onClick={() => handleSendMessage(inputPrompt)}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    {t('aiPage.tryAgainBtn', undefined, 'Try Again')}
                  </button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Chat Input Bar */}
            <div className="p-4 sm:p-5 border-t border-[#E8E2D7] dark:border-[#1E3A33] bg-white dark:bg-[#11201C] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={mainInputRef}
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    activeScholarship
                      ? `Ask a question about ${activeScholarship.name}...`
                      : t('aiPage.heroInputPlaceholder', undefined, 'Ask Edvora anything about scholarships...')
                  }
                  aria-label="Ask Edvora anything about scholarships"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50 dark:bg-[#142622] text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B] dark:focus:ring-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isLoading}
                  className="p-3 rounded-2xl bg-[#064E3B] hover:bg-[#043E2F] disabled:opacity-40 text-amber-200 font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064E3B] shadow-xs"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OPTIONAL SCHOLARSHIP CONTEXT & HELPFUL DISCOVERY SECTION              */}
      {/* ========================================================================= */}
      <section className="py-12 border-t border-stone-200/80 dark:border-[#1E3A33] bg-stone-50/50 dark:bg-[#0E1A17]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#142420] border border-[#E8E2D7] dark:border-[#1E3A33] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
                  <span>{t('aiPage.selectScholarshipLabel', undefined, 'Switch to a specific scholarship guide')}</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Select any scholarship to generate an instant 11-section verified guide.
                </p>
              </div>

              {/* Scholarship Dropdown Selector */}
              <div className="w-full md:w-80">
                <select
                  value={activeScholarshipId || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectScholarshipFocus(e.target.value);
                    } else {
                      handleClearScholarshipFocus();
                    }
                  }}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-stone-200 dark:border-[#1E3A33] bg-stone-50 dark:bg-[#192E28] text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                >
                  <option value="">General Assistant (All Scholarships)</option>
                  {SCHOLARSHIPS_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.state === 'Gujarat' ? 'Gujarat' : 'National'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Cards for 4 Top Verified Schemes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {SCHOLARSHIPS_DATA.slice(0, 4).map((s) => {
                const isCurrent = activeScholarshipId === s.id;
                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-stone-50/50 dark:bg-[#182E29] border-stone-200 dark:border-[#23453E] hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        {s.state === 'Gujarat' ? 'Gujarat State' : 'All India'}
                      </span>
                      <h4 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mt-1">
                        {s.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleSelectScholarshipFocus(s.id)}
                      className="mt-3 w-full py-1.5 px-2.5 rounded-xl bg-white dark:bg-[#142420] border border-stone-200 dark:border-[#1E3A33] hover:border-[#064E3B] text-[11px] font-bold text-[#064E3B] dark:text-emerald-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{isCurrent ? 'Viewing Guide' : 'Ask AI'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
