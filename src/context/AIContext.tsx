import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { Scholarship, StudentAnswers, MatchResult } from '../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { evaluateScholarship } from '../engine/eligibilityEngine';
import { generateAIResponse } from '../services/aiService';
import type { AIResponsePayload } from '../services/aiKnowledgeEngine';
import { useLanguage } from './LanguageContext';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  payload?: AIResponsePayload;
  timestamp: number;
}

export interface AIContextType {
  isOpen: boolean;
  mode: 'global' | 'scholarship';
  currentScholarshipId: string | null;
  currentScholarship: Scholarship | null;
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  openGlobalAI: () => void;
  openScholarshipAI: (scholarshipId: string) => void;
  closeAI: () => void;
  clearChat: () => void;
  sendMessage: (text: string, quickKey?: string) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: React.ReactNode;
  studentAnswers?: StudentAnswers | null;
  currentPage?: string;
}

export const AIProvider: React.FC<AIProviderProps> = ({
  children,
  studentAnswers,
  currentPage = 'home',
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'global' | 'scholarship'>('global');
  const [currentScholarshipId, setCurrentScholarshipId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentScholarship = currentScholarshipId
    ? SCHOLARSHIPS_DATA.find((s) => s.id === currentScholarshipId || s.slug === currentScholarshipId) || null
    : null;

  // Track active scholarship ID ref to prevent race conditions
  const activeScholarshipIdRef = useRef<string | null>(null);
  activeScholarshipIdRef.current = currentScholarshipId;

  // Helper to calculate matchResult on the fly
  const getMatchResult = useCallback(
    (scholarship: Scholarship | null): MatchResult | null => {
      if (!scholarship || !studentAnswers) return null;
      return evaluateScholarship(scholarship, studentAnswers);
    },
    [studentAnswers]
  );

  // Trigger automatic first guide when opening a scholarship
  const triggerScholarshipGuide = useCallback(
    async (scholarship: Scholarship) => {
      setIsLoading(true);
      setError(null);

      try {
        const matchResult = getMatchResult(scholarship);
        const res = await generateAIResponse({
          mode: 'scholarship',
          scholarshipId: scholarship.id,
          studentContext: studentAnswers,
          matchResult,
          language,
          currentPage,
        });

        // Ensure we haven't switched scholarships while awaiting response
        if (activeScholarshipIdRef.current === scholarship.id) {
          setMessages([
            {
              id: 'initial-guide-' + Date.now(),
              role: 'assistant',
              content: res.message,
              payload: res,
              timestamp: Date.now(),
            },
          ]);
        }
      } catch {
        setError(t('ai.errorGeneric'));
      } finally {
        setIsLoading(false);
      }
    },
    [getMatchResult, studentAnswers, language, currentPage, t]
  );

  const openGlobalAI = useCallback(() => {
    setMode('global');
    setCurrentScholarshipId(null);
    setError(null);
    setIsOpen(true);
  }, []);

  const openScholarshipAI = useCallback(
    (scholarshipId: string) => {
      setMode('scholarship');
      setError(null);
      setIsOpen(true);

      const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === scholarshipId || s.slug === scholarshipId);
      if (scholarship) {
        if (currentScholarshipId !== scholarship.id) {
          setCurrentScholarshipId(scholarship.id);
          setMessages([]);
          triggerScholarshipGuide(scholarship);
        }
      }
    },
    [currentScholarshipId, triggerScholarshipGuide]
  );

  const closeAI = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setError(null);
    if (mode === 'scholarship' && currentScholarship) {
      setMessages([]);
      triggerScholarshipGuide(currentScholarship);
    } else {
      setMessages([]);
    }
  }, [mode, currentScholarship, triggerScholarshipGuide]);

  const sendMessage = useCallback(
    async (text: string, quickKey?: string) => {
      if (!text.trim() && !quickKey) return;

      const userMsg: AIMessage = {
        id: 'user-' + Date.now(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const matchResult = getMatchResult(currentScholarship);
        const convHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await generateAIResponse({
          mode,
          scholarshipId: currentScholarship?.id,
          studentContext: studentAnswers,
          matchResult,
          conversation: convHistory,
          language,
          currentPage,
          prompt: text,
          quickKey,
        });

        const assistantMsg: AIMessage = {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content: res.message,
          payload: res,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setError(t('ai.errorGeneric'));
      } finally {
        setIsLoading(false);
      }
    },
    [currentScholarship, getMatchResult, messages, mode, studentAnswers, language, currentPage, t]
  );

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAI();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAI]);

  return (
    <AIContext.Provider
      value={{
        isOpen,
        mode,
        currentScholarshipId,
        currentScholarship,
        messages,
        isLoading,
        error,
        openGlobalAI,
        openScholarshipAI,
        closeAI,
        clearChat,
        sendMessage,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
