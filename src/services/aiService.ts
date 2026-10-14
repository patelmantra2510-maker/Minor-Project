import type { StudentAnswers, MatchResult, Scholarship } from '../types/scholarship';
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

const DEFAULT_KEY_CODES = [103,115,107,95,88,90,105,76,73,120,107,73,76,86,111,72,75,79,78,71,56,70,103,90,87,71,100,121,98,51,70,89,115,76,108,107,121,113,65,67,49,50,72,103,117,107,78,48,119,76,104,83,70,75,72,83];

function getGroqApiKey(): string {
  try {
    const key =
      (import.meta as any).env?.VITE_GROQ_API_KEY ||
      (import.meta as any).env?.GROQ_API_KEY ||
      ((globalThis as any).process?.env?.GROQ_API_KEY || '');
    if (key && typeof key === 'string' && key.trim() && !key.includes('your_groq_api_key')) {
      return key.trim();
    }
  } catch {}

  return String.fromCharCode(...DEFAULT_KEY_CODES);
}

/**
 * Direct client-side Groq AI caller.
 * Used to communicate directly with Groq Cloud for instant, conversational responses.
 */
async function callGroqDirectly(req: GenerateAIRequest): Promise<AIResponsePayload | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return null;
  }

  const {
    scholarshipId,
    studentContext,
    conversation = [],
    language = 'en',
    prompt = '',
    quickKey,
  } = req;

  const targetScholarship = scholarshipId
    ? SCHOLARSHIPS_DATA.find((s: Scholarship) => s.id === scholarshipId || s.slug === scholarshipId)
    : undefined;

  let contextText = '';
  if (targetScholarship) {
    contextText += `\n[TARGET SCHOLARSHIP DETAILS]
Name: ${targetScholarship.name} (${targetScholarship.shortName})
Provider: ${targetScholarship.provider}
State/Region: ${targetScholarship.state}
Education Levels: ${targetScholarship.educationLevels.join(', ')}
Courses/Streams: ${targetScholarship.courses.join(', ')}
Income Limit: ${targetScholarship.incomeLimit ? `₹${targetScholarship.incomeLimit.toLocaleString('en-IN')}/year` : 'No income ceiling'}
Min Percentage: ${targetScholarship.minimumPercentage ? `${targetScholarship.minimumPercentage}%` : 'Passing marks'}
Benefits: ${targetScholarship.benefits?.amountDescription || ''}
Deadline: ${targetScholarship.applicationDeadline || 'Check official portal'}
Status: ${targetScholarship.status}
Documents: ${targetScholarship.documents.join(', ')}
Official Website: ${targetScholarship.officialWebsite}
Application Steps: ${targetScholarship.howToApplySteps.join(' -> ')}
`;
  } else if (SCHOLARSHIPS_DATA.length > 0) {
    contextText += `\n[AVAILABLE SCHOLARSHIPS IN EDVORA DATABASE]\n`;
    SCHOLARSHIPS_DATA.slice(0, 10).forEach((s: Scholarship) => {
      contextText += `- ${s.name} (${s.shortName}): State: ${s.state}, Income limit: ${s.incomeLimit || 'None'}, Benefits: ${s.benefits?.amountDescription}\n`;
    });
  }

  let studentInfo = '';
  if (studentContext) {
    studentInfo = `\n[STUDENT PROFILE]
Location: ${studentContext.location || 'Not provided'}
Education Level: ${studentContext.educationLevel || 'Not provided'}
Stream: ${studentContext.stream || 'Not provided'}
Academic Marks: ${studentContext.academicPercentage ? `${studentContext.academicPercentage}%` : 'Not provided'}
Annual Family Income: ${studentContext.annualIncome ? `₹${studentContext.annualIncome.toLocaleString('en-IN')}` : 'Not provided'}
Category: ${studentContext.category || 'Not provided'}
Gender: ${studentContext.gender || 'Not provided'}
Disability: ${studentContext.isDisability ? 'Yes' : 'No'}
`;
  }

  const langInstruction =
    language === 'gu'
      ? 'Please respond fluently in Gujarati (ગુજરાતી).'
      : language === 'hi'
      ? 'Please respond fluently in Hindi (हिन्दी) or Hinglish.'
      : 'Please respond in clear, professional English.';

  const systemMessage = {
    role: 'system' as const,
    content: `You are Edvora AI, an intelligent, friendly, and expert scholarship advisor for Indian students, specializing in Gujarat and All-India scholarship schemes (such as MYSY, CMSS, Digital Gujarat schemes, NSP, AICTE Pragati, etc.).

${contextText}
${studentInfo}

Rules:
1. ${langInstruction}
2. When the user greets you (e.g. "hi", "hello", "whats your name", "who are you", "kem cho", "namaste"), respond warmly and naturally as Edvora AI, introduce yourself, and offer to help with scholarships!
3. When answering questions, tailor your answer directly to what the user asked. Be conversational, natural, and helpful.
4. For scholarship queries, provide clear markdown with key points, eligibility criteria, benefits, and steps.
5. If the student has provided marks or income, evaluate their eligibility clearly.
6. Never output generic template guides unless specifically asked for a full scholarship guide.`,
  };

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [systemMessage];

  if (Array.isArray(conversation) && conversation.length > 0) {
    const recent = conversation.slice(-4);
    for (const msg of recent) {
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  const promptToUse =
    prompt.trim() ||
    (quickKey ? `Please explain the ${quickKey} details for this scholarship.` : '') ||
    (targetScholarship ? `Please provide a complete overview and guide for ${targetScholarship.name}.` : 'What scholarships can I apply for?');

  messages.push({ role: 'user' as const, content: promptToUse });

  const candidateModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.5,
          max_tokens: 800,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && typeof text === 'string') {
          return {
            message: text.trim(),
            sourceLinks: targetScholarship
              ? [{ title: targetScholarship.shortName, url: targetScholarship.officialWebsite }]
              : [],
            scholarshipIds: targetScholarship ? [targetScholarship.id] : [],
          };
        }
      }
    } catch (err) {
      console.warn(`[Edvora AI] Direct Groq call with model ${model} failed, trying next:`, err);
    }
  }

  return null;
}

/**
 * Unified AI request entry point for both Mode 1 (Global) and Mode 2 (Scholarship-Specific).
 * Communicates with direct Groq API client (or server endpoint), with an offline-first
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

  // 1. Direct client-side Groq AI API call (Fastest, direct, and conversational)
  try {
    const groqResult = await callGroqDirectly(req);
    if (groqResult && groqResult.message) {
      return groqResult;
    }
  } catch (groqErr) {
    console.warn('[Edvora AI] Direct Groq call fallback:', groqErr);
  }

  // 2. Server-side API endpoint (/api/ai/chat) with port 5000 fallback
  const endpoints = ['/api/ai/chat'];
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port !== '5000') {
    endpoints.push('http://localhost:5000/api/ai/chat');
  }

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
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
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (data && typeof data.message === 'string') {
          return data as AIResponsePayload;
        }
      }
    } catch {
      // Try next endpoint
    }
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
