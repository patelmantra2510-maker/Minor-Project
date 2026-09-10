import type { StudentAnswers, MatchResult } from '../types/scholarship';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import {
  generateScholarshipGuide,
  processScholarshipQuickQuestion,
  processGlobalQuery,
  type AIResponsePayload,
} from './aiKnowledgeEngine';

export interface GenerateAIRequest {
  mode: 'global' | 'scholarship';
  scholarshipId?: string;
  studentContext?: StudentAnswers | null;
  matchResult?: MatchResult | null;
  conversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
  language?: 'en' | 'hi' | 'gu';
  currentPage?: string;
  prompt?: string;
  quickKey?: string;
}

/**
 * Unified AI request entry point for both Mode 1 (Global) and Mode 2 (Scholarship-Specific).
 * Communicates with the server-side /api/ai/chat endpoint, with an offline-first
 * deterministic knowledge engine fallback.
 */
export async function generateAIResponse(req: GenerateAIRequest): Promise<AIResponsePayload> {
  const {
    mode,
    scholarshipId,
    studentContext,
    matchResult,
    conversation = [],
    language = 'en',
    currentPage = 'home',
    prompt = '',
    quickKey,
  } = req;

  // 1. Attempt server-side API endpoint
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        scholarshipId,
        studentContext,
        matchResult,
        conversation,
        language,
        currentPage,
        prompt,
        quickKey,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.message === 'string') {
        return data as AIResponsePayload;
      }
    }
  } catch {
    // Network or server offline; proceed to verified fallback engine
  }

  // 2. Client-side verified knowledge fallback (No server/network failure will break Edvora)
  if (mode === 'scholarship' && scholarshipId) {
    const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === scholarshipId || s.slug === scholarshipId);
    if (scholarship) {
      if (quickKey) {
        return processScholarshipQuickQuestion(quickKey, scholarship, studentContext, matchResult, language);
      }
      if (!prompt || prompt.toLowerCase().includes('complete guide') || conversation.length === 0) {
        return generateScholarshipGuide(scholarship, studentContext, matchResult, language);
      }
      // Follow-up question inside scholarship mode
      const p = prompt.toLowerCase();
      if (p.includes('eligib') || p.includes('criteria') || p.includes('can i apply')) {
        return processScholarshipQuickQuestion('eligibility', scholarship, studentContext, matchResult, language);
      }
      if (p.includes('doc') || p.includes('certif')) {
        return processScholarshipQuickQuestion('documents', scholarship, studentContext, matchResult, language);
      }
      if (p.includes('apply') || p.includes('step') || p.includes('portal') || p.includes('process')) {
        return processScholarshipQuickQuestion('howToApply', scholarship, studentContext, matchResult, language);
      }
      if (p.includes('deadline') || p.includes('date') || p.includes('last day') || p.includes('when')) {
        return processScholarshipQuickQuestion('deadline', scholarship, studentContext, matchResult, language);
      }
      if (p.includes('benefit') || p.includes('amount') || p.includes('money') || p.includes('rupee') || p.includes('fee')) {
        return processScholarshipQuickQuestion('benefits', scholarship, studentContext, matchResult, language);
      }
      if (p.includes('official') || p.includes('website') || p.includes('link') || p.includes('url')) {
        return processScholarshipQuickQuestion('officialSource', scholarship, studentContext, matchResult, language);
      }

      // Contextual answer referencing this specific scholarship
      return {
        message: `Regarding **${scholarship.name}**:\n\n${scholarship.description}\n\n- **Target Education:** ${scholarship.educationLevels.join(', ')}\n- **Benefits:** ${scholarship.benefits.amountDescription}\n- **Deadline:** ${scholarship.applicationDeadline}\n- **Official Portal:** [${scholarship.officialWebsite}](${scholarship.officialWebsite})\n\nYou can use the quick chips below for dedicated answers.`,
        scholarshipIds: [scholarship.id],
        sourceLinks: [{ title: `${scholarship.shortName} Official Portal`, url: scholarship.applicationWebsite }],
      };
    }
  }

  // Global Mode
  return processGlobalQuery(prompt, {
    studentAnswers: studentContext,
    currentPage,
    language,
  });
}
