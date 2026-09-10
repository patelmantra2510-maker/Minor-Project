const https = require('https');
const fs = require('fs');
const path = require('path');

function getGroqApiKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GROQ_API_KEY=(.+)/);
      if (match) return match[1].trim();
    }
  } catch {}
  return '';
}

/**
 * Calls Groq API to generate an intelligent, context-aware scholarship response.
 */
async function callGroqChat({
  prompt,
  conversation = [],
  scholarship,
  studentContext,
  matchResult,
  language = 'en',
  allScholarships = [],
}) {
  const apiKey = getGroqApiKey();
  if (!apiKey || apiKey.includes('your_groq_api_key')) {
    return null;
  }

  // Build Context Information
  let contextText = '';
  if (scholarship) {
    contextText += `\n[TARGET SCHOLARSHIP DETAILS]
Name: ${scholarship.name} (${scholarship.shortName})
Provider: ${scholarship.provider}
State/Region: ${scholarship.state}
Education Levels: ${scholarship.educationLevels.join(', ')}
Courses/Streams: ${scholarship.courses.join(', ')}
Income Limit: ${scholarship.incomeLimit ? `₹${scholarship.incomeLimit.toLocaleString('en-IN')}/year` : 'No income ceiling'}
Min Percentage: ${scholarship.minimumPercentage ? `${scholarship.minimumPercentage}%` : 'Passing marks'}
Benefits: ${scholarship.benefits?.amountDescription || ''}
Deadline: ${scholarship.applicationDeadline || 'Check official portal'}
Status: ${scholarship.status}
Documents: ${scholarship.documents.join(', ')}
Official Website: ${scholarship.officialWebsite}
Application Steps: ${scholarship.howToApplySteps.join(' -> ')}
`;
  } else if (allScholarships.length > 0) {
    contextText += `\n[AVAILABLE SCHOLARSHIPS IN EDVORA DATABASE]\n`;
    allScholarships.slice(0, 10).forEach((s) => {
      contextText += `- ${s.name} (${s.shortName}): State: ${s.state}, Income limit: ${s.incomeLimit || 'None'}, Benefits: ${s.benefits?.amountDescription}\n`;
    });
  }

  let studentInfo = '';
  if (studentContext) {
    studentInfo = `\n[STUDENT PROFILE]
Location: ${studentContext.location}
Education Level: ${studentContext.educationLevel}
Stream: ${studentContext.stream}
Academic Marks: ${studentContext.academicPercentage}%
Annual Family Income: ₹${studentContext.annualIncome?.toLocaleString('en-IN')}
Category: ${studentContext.category}
Gender: ${studentContext.gender}
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
    role: 'system',
    content: `You are Edvora AI, an expert scholarship advisor for Indian students, specializing in Gujarat and All-India scholarship schemes (such as MYSY, CMSS, Digital Gujarat schemes, NSP, AICTE Pragati, etc.).
Your mission is to provide accurate, concise, encouraging, and actionable guidance to students.

${contextText}
${studentInfo}

Rules:
1. ${langInstruction}
2. Use markdown formatting with clear headings, bullet points, and bold keywords.
3. Be factual, concise, and helpful. Never invent non-existent government criteria.
4. If the student has provided their marks/income, evaluate their eligibility clearly.
5. Provide official application tips and document checklists when asked.`,
  };

  const messages = [systemMessage];

  // Include recent conversation history (up to last 4 messages)
  if (Array.isArray(conversation) && conversation.length > 0) {
    const recent = conversation.slice(-4);
    for (const msg of recent) {
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  // Current prompt
  messages.push({ role: 'user', content: prompt });

  const payload = JSON.stringify({
    model: 'qwen/qwen3.8-27b',
    messages,
    temperature: 0.3,
    max_tokens: 800,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 10000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const data = JSON.parse(body);
              const text = data.choices?.[0]?.message?.content;
              if (text) {
                resolve({
                  message: text.trim(),
                  sourceLinks: scholarship
                    ? [{ title: scholarship.shortName, url: scholarship.officialWebsite }]
                    : [],
                  scholarshipIds: scholarship ? [scholarship.id] : [],
                });
                return;
              }
            }
            console.warn('[GroqService] Non-OK status:', res.statusCode, body);
            resolve(null);
          } catch (err) {
            console.warn('[GroqService] JSON parse error:', err);
            resolve(null);
          }
        });
      }
    );

    req.on('error', (err) => {
      console.warn('[GroqService] Request error:', err);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = {
  callGroqChat,
  getGroqApiKey,
};
