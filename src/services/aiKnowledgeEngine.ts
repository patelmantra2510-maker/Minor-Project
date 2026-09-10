import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import type { Scholarship, StudentAnswers, MatchResult } from '../types/scholarship';
import { evaluateAllScholarships } from '../engine/eligibilityEngine';
import { formatDate } from '../utils/dateUtils';

export interface AIAction {
  type: 'view_scholarship' | 'explore' | 'find' | 'compare';
  label: string;
  payload?: string;
}

export interface AISourceLink {
  title: string;
  url: string;
}

export interface AIResponsePayload {
  message: string;
  scholarshipIds?: string[];
  actions?: AIAction[];
  sourceLinks?: AISourceLink[];
}

export interface ScholarshipAIContext {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  location: string;
  educationLevel: string;
  stream: string;
  category: string;
  incomeCriteria: string;
  academicCriteria: string;
  genderCriteria: string;
  specialConditions: string;
  benefits: string;
  documents: string[];
  applicationProcess: string[];
  openingDate: string;
  deadline: string;
  status: string;
  description: string;
  officialUrl: string;
  studentContext?: string;
  eligibilityResult?: {
    status: 'strong_match' | 'possible_match' | 'not_eligible';
    summaryMessage: string;
    checks: Array<{ label: string; status: string; detail: string }>;
  };
}

/**
 * Reusable context builder for EVERY current and future scholarship in Edvora.
 */
export function buildScholarshipAIContext(
  scholarship: Scholarship,
  studentAnswers?: StudentAnswers | null,
  eligibilityResult?: MatchResult | null
): ScholarshipAIContext {
  let studentContextStr: string | undefined = undefined;
  if (studentAnswers) {
    studentContextStr = [
      `Location: ${studentAnswers.location}`,
      `Education: ${studentAnswers.educationLevel} (${studentAnswers.stream || 'General'}, Year: ${studentAnswers.currentYear})`,
      `Category: ${studentAnswers.category}`,
      `Gender: ${studentAnswers.gender}`,
      `Family Annual Income: ₹${studentAnswers.annualIncome.toLocaleString('en-IN')}`,
      `Academic Score: ${studentAnswers.academicPercentage}%`,
      studentAnswers.isDisability ? `Disability: Yes (${studentAnswers.disabilityPercentage || 40}%)` : null,
      studentAnswers.isOrphan ? 'Orphan / COVID-19 Ward: Yes' : null,
      studentAnswers.isDefenceWard ? 'Defence/Police Ward: Yes' : null,
      studentAnswers.isMinority ? 'Minority Community: Yes' : null,
    ].filter(Boolean).join(' | ');
  }

  return {
    id: scholarship.id,
    name: scholarship.name,
    shortName: scholarship.shortName,
    provider: scholarship.provider,
    location: scholarship.state === 'Gujarat' ? 'Gujarat State' : 'All India',
    educationLevel: scholarship.educationLevels.join(', '),
    stream: scholarship.courses.join(', '),
    category: scholarship.categories.join(', '),
    incomeCriteria: scholarship.incomeLimit
      ? `Family annual income up to ₹${scholarship.incomeLimit.toLocaleString('en-IN')}`
      : 'No family income limit (Merit-based)',
    academicCriteria: scholarship.minimumPercentage
      ? `Minimum ${scholarship.minimumPercentage}% marks in prerequisite examination`
      : 'Passing marks required in qualifying examination',
    genderCriteria:
      scholarship.genderEligibility === 'All'
        ? 'All genders eligible (Male, Female, Transgender)'
        : `${scholarship.genderEligibility} candidates only`,
    specialConditions: scholarship.specialConditions
      ? [
          scholarship.specialConditions.disabilityRequired ? 'Divyangjan / PwD benchmark certificate required' : null,
          scholarship.specialConditions.orphanRequired ? 'Orphan / COVID ward certificate required' : null,
          scholarship.specialConditions.defenceWardRequired ? 'Defence / Police personnel ward document required' : null,
          scholarship.specialConditions.minorityRequired ? 'Religious minority declaration required' : null,
          scholarship.specialConditions.verificationNote || null,
        ].filter(Boolean).join('; ') || 'Standard state/central norms apply'
      : 'None',
    benefits: `${scholarship.benefits.amountDescription}${
      scholarship.benefits.tuitionFeeCoverage ? ` (Tuition: ${scholarship.benefits.tuitionFeeCoverage})` : ''
    }${scholarship.benefits.hostelAllowance ? ` (Hostel: ${scholarship.benefits.hostelAllowance})` : ''}`,
    documents: scholarship.documents,
    applicationProcess: scholarship.howToApplySteps || [],
    openingDate: formatDate(scholarship.applicationStart),
    deadline: formatDate(scholarship.applicationDeadline),
    status: scholarship.status,
    description: scholarship.description,
    officialUrl: scholarship.applicationWebsite || scholarship.officialWebsite,
    studentContext: studentContextStr,
    eligibilityResult: eligibilityResult
      ? {
          status: eligibilityResult.status,
          summaryMessage: eligibilityResult.summaryMessage,
          checks: eligibilityResult.checks.map((c) => ({
            label: c.label,
            status: c.status,
            detail: c.detail,
          })),
        }
      : undefined,
  };
}

/**
 * Generates the automatic 10-section scholarship guide for Mode 2.
 */
export function generateScholarshipGuide(
  scholarship: Scholarship,
  studentAnswers?: StudentAnswers | null,
  eligibilityResult?: MatchResult | null,
  language: 'en' | 'hi' | 'gu' = 'en'
): AIResponsePayload {
  const ctx = buildScholarshipAIContext(scholarship, studentAnswers, eligibilityResult);

  // Section 8: Match evaluation explanation
  let matchSection = '';
  if (ctx.eligibilityResult) {
    const status = ctx.eligibilityResult.status;
    const checks = ctx.eligibilityResult.checks;

    if (language === 'hi') {
      if (status === 'strong_match') {
        matchSection = `**मजबूत मिलान (Strong Match)**\n\nआपके द्वारा दी गई जानकारी के आधार पर, आप एडवोरा द्वारा मूल्यांकित मुख्य मानदंडों को पूरा करते प्रतीत होते हैं।\n\n- ${checks.map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      } else if (status === 'possible_match') {
        matchSection = `**संभावित मिलान (Possible Match)**\n\nआपकी जानकारी कई मानदंडों से मेल खाती है, लेकिन एक या अधिक शर्तों का सत्यापन आवश्यक है।\n\n- ${checks.map((c) => `${c.label} (${c.status === 'warning' ? 'सत्यापन आवश्यक' : 'सत्यापित'}): ${c.detail}`).join('\n- ')}`;
      } else {
        matchSection = `**वर्तमान में अपात्र (Not Eligible)**\n\nवर्तमान में दी गई जानकारी के आधार पर, यह छात्रवृत्ति सूचीबद्ध मानदंडों से मेल नहीं खाती क्योंकि:\n\n- ${checks.filter((c) => c.status === 'unmatched').map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      }
    } else if (language === 'gu') {
      if (status === 'strong_match') {
        matchSection = `**મજબૂત મેળ (Strong Match)**\n\nતમે આપેલી માહિતીના આધારે, તમે એડવોરા દ્વારા મૂલ્યાંકન કરાયેલ મુખ્ય માપદંડોને પૂર્ણ કરતા જણાય છે.\n\n- ${checks.map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      } else if (status === 'possible_match') {
        matchSection = `**સંભવિત મેળ (Possible Match)**\n\nતમારી માહિતી ઘણા માપદંડો સાથે મેળ ખાય છે, પરંતુ એક અથવા વધુ શરતોની ચકાસણી જરૂરી છે.\n\n- ${checks.map((c) => `${c.label} (${c.status === 'warning' ? 'ચકાસણી જરૂરી' : 'પૂર્ણ'}): ${c.detail}`).join('\n- ')}`;
      } else {
        matchSection = `**હાલમાં મેળ ખાતી નથી (Not Eligible)**\n\nહાલમાં આપેલ માહિતીના આધારે, આ શિષ્યવૃત્તિ નીચેના કારણોસર માપદંડો સાથે મેળ ખાતી નથી:\n\n- ${checks.filter((c) => c.status === 'unmatched').map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      }
    } else {
      if (status === 'strong_match') {
        matchSection = `**Strong Match**\n\nBased on the information you provided, you appear to meet the main criteria evaluated by Edvora.\n\n- ${checks.map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      } else if (status === 'possible_match') {
        matchSection = `**Possible Match**\n\nYour information appears to match several criteria, but one or more conditions need verification.\n\n- ${checks.map((c) => `${c.label} (${c.status === 'warning' ? 'Verification Required' : 'Matched'}): ${c.detail}`).join('\n- ')}`;
      } else {
        matchSection = `**Not Eligible**\n\nBased on the information currently provided, this scholarship does not appear to match the listed criteria because:\n\n- ${checks.filter((c) => c.status === 'unmatched').map((c) => `${c.label}: ${c.detail}`).join('\n- ')}`;
      }
    }
  } else {
    if (language === 'hi') {
      matchSection = `आपने अभी तक प्रश्नावली पूरी नहीं की है। अपनी पात्रता का व्यक्तिगत विश्लेषण देखने के लिए 'मेरी छात्रवृत्तियां खोजें' प्रश्नावली लें।`;
    } else if (language === 'gu') {
      matchSection = `તમે હજી સુધી પ્રશ્નાવલી પૂર્ણ કરી નથી. તમારી પાત્રતાનું વ્યક્તિગત મૂલ્યાંકન જોવા માટે 7-પ્રશ્નોની પ્રશ્નાવલી લો.`;
    } else {
      matchSection = `You have not completed the session questionnaire yet. Take the 7-question questionnaire to view your personalized eligibility analysis.`;
    }
  }

  // Section 6: Steps
  let stepsSection = '';
  if (ctx.applicationProcess && ctx.applicationProcess.length > 0) {
    stepsSection = ctx.applicationProcess
      .map((step, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return `**${num}**\n${step}`;
      })
      .join('\n\n');
  } else {
    if (language === 'hi') {
      stepsSection = `एडवोरा की सत्यापित जानकारी में चरण-दर-चरण आवेदन प्रक्रिया उपलब्ध नहीं है। कृपया आधिकारिक छात्रवृत्ति पोर्टल पर दिए गए निर्देशों का पालन करें।`;
    } else if (language === 'gu') {
      stepsSection = `એડવોરાની ચકાસાયેલ માહિતીમાં વિગતવાર અરજી પ્રક્રિયા ઉપલબ્ધ નથી. કૃપા કરીને સત્તાવાર શિષ્યવૃત્તિ પોર્ટલ પર આપેલી સૂચનાઓનું પાલન કરો.`;
    } else {
      stepsSection = `The detailed application process is not available in Edvora's verified information. Please follow the instructions on the official scholarship portal.`;
    }
  }

  // Multilingual template strings
  let message = '';
  if (language === 'hi') {
    message = `# ${ctx.name}

यहाँ ${ctx.name} के लिए संपूर्ण गाइड दी गई है।

## 1. यह छात्रवृत्ति क्या है?
${ctx.description}

## 2. कौन आवेदन कर सकता है?
${scholarship.whoCanApply.map((item) => `- ${item}`).join('\n')}

## 3. पात्रता आवश्यकताएं
- **शिक्षा स्तर:** ${ctx.educationLevel}
- **स्वीकृत पाठ्यक्रम:** ${ctx.stream}
- **पारिवारिक आय सीमा:** ${ctx.incomeCriteria}
- **न्यूनतम शैक्षणिक अंक:** ${ctx.academicCriteria}
- **श्रेणी:** ${ctx.category}
- **लिंग:** ${ctx.genderCriteria}
- **विशेष शर्तें:** ${ctx.specialConditions}

## 4. क्या लाभ प्रदान किए जाते हैं?
- **सहायता राशि:** ${ctx.benefits}

## 5. आवश्यक दस्तावेज
${ctx.documents.map((doc) => `- ${doc}`).join('\n')}

## 6. आवेदन कैसे करें — चरण-दर-चरण
${stepsSection}

## 7. महत्वपूर्ण तिथियां
- **आवेदन प्रारंभ:** ${ctx.openingDate}
- **अंतिम तिथि:** ${ctx.deadline}
- **वर्तमान स्थिति:** ${ctx.status}

## 8. क्या यह आपके अनुकूल है?
${matchSection}

## 9. सत्यापन हेतु महत्वपूर्ण बातें
- सुनिश्चित करें कि सभी दस्तावेज सक्षम प्राधिकारी द्वारा सत्यापित हों।
- आय प्रमाण पत्र एवं जाति प्रमाण पत्र नवीनतम वित्तीय वर्ष के होने चाहिए।
- एक ही शैक्षणिक वर्ष में समान सरकारी योजना का दोहरा लाभ न लें।

## 10. आधिकारिक स्रोत
- [आधिकारिक पोर्टल पर जाएं](${ctx.officialUrl})

## अंतिम स्मरण
एडवोरा एक स्वतंत्र खोज मंच है। अंतिम पात्रता, दस्तावेज सत्यापन और चयन का निर्णय संबंधित छात्रवृत्ति प्राधिकरण द्वारा ही लिया जाता है।`;
  } else if (language === 'gu') {
    message = `# ${ctx.name}

અહીં ${ctx.name} માટે સંપૂર્ણ માર્ગદર્શિકા આપેલી છે.

## 1. આ શિષ્યવૃત્તિ શું છે?
${ctx.description}

## 2. કોણ અરજી કરી શકે છે?
${scholarship.whoCanApply.map((item) => `- ${item}`).join('\n')}

## 3. પાત્રતા જરૂરીયાતો
- **શિક્ષણ સ્તર:** ${ctx.educationLevel}
- **અભ્યાસક્રમ:** ${ctx.stream}
- **કૌટુંબિક આવક મર્યાદા:** ${ctx.incomeCriteria}
- **શૈક્ષણિક ટકાવારી:** ${ctx.academicCriteria}
- **કેટેગરી:** ${ctx.category}
- **જાતિ:** ${ctx.genderCriteria}
- **ખાસ શરતો:** ${ctx.specialConditions}

## 4. શું લાભો આપવામાં આવે છે?
- **સહાય રકમ:** ${ctx.benefits}

## 5. જરૂરી દસ્તાવેજો
${ctx.documents.map((doc) => `- ${doc}`).join('\n')}

## 6. કેવી રીતે અરજી કરવી — સ્ટેપ બાય સ્ટેપ
${stepsSection}

## 7. મહત્વપૂર્ણ તારીખો
- **અરજી શરૂ થવાની તારીખ:** ${ctx.openingDate}
- **છેલ્લી તારીખ:** ${ctx.deadline}
- **હાલની સ્થિતિ:** ${ctx.status}

## 8. શું આ તમારા માટે યોગ્ય છે?
${matchSection}

## 9. ચકાસણી માટેની મહત્વપૂર્ણ બાબતો
- તમામ દસ્તાવેજો યોગ્ય સરકારી અધિકારી દ્વારા પ્રમાણિત હોવા જોઈએ.
- આવકનો દાખલો અને જાતિનો દાખલો માન્ય સમયગાળાનો હોવો જરૂરી છે.
- એક જ વર્ષમાં સમાન પ્રકારની બીજી સરકારી શિષ્યવૃત્તિનો લાભ ન લેવો.

## 10. સત્તાવાર સ્ત્રોત
- [સત્તાવાર પોર્ટલ પર જાઓ](${ctx.officialUrl})

## 11. અંતિમ યાદ અપાવણી
એડવોરા એક સ્વતંત્ર શોધ મંચ છે. અંતિમ પાત્રતા, દસ્તાવેજ ચકાસણી અને પસંદગીનો અધિકાર માત્ર સંબંધિત સત્તાવાર ઓથોરિટી પાસે જ રહે છે.`;
  } else {
    message = `# ${ctx.name}

Here is a complete guide to ${ctx.name}.

## 1. What is this scholarship?
${ctx.description}

## 2. Who can apply?
${scholarship.whoCanApply.map((item) => `- ${item}`).join('\n')}

## 3. Eligibility requirements
- **Education Level:** ${ctx.educationLevel}
- **Eligible Streams:** ${ctx.stream}
- **Income Criteria:** ${ctx.incomeCriteria}
- **Academic Criteria:** ${ctx.academicCriteria}
- **Social Category:** ${ctx.category}
- **Gender:** ${ctx.genderCriteria}
- **Special Conditions:** ${ctx.specialConditions}

## 4. What benefits are provided?
- **Assistance / Amount:** ${ctx.benefits}

## 5. Required documents
${ctx.documents.map((doc) => `- ${doc}`).join('\n')}

## 6. How to apply — Step by Step
${stepsSection}

## 7. Important dates
- **Applications Open:** ${ctx.openingDate}
- **Application Deadline:** ${ctx.deadline}
- **Current Status:** ${ctx.status}

## 8. Does it match you?
${matchSection}

## 9. Important things to verify
- Ensure all uploaded certificates are self-attested and clearly legible.
- Family income certificate must be valid for the ongoing academic year.
- Verify whether your institution is recognized under the official authority's portal.

## 10. Official source
- [Apply on Official Portal](${ctx.officialUrl})

## 11. Final reminder
Edvora is an independent discovery platform. Final eligibility, document verification, and selection are determined exclusively by the respective scholarship authority.`;
  }

  return {
    message,
    scholarshipIds: [scholarship.id],
    sourceLinks: [
      {
        title: `${scholarship.shortName} Official Portal`,
        url: ctx.officialUrl,
      },
    ],
    actions: [
      {
        type: 'view_scholarship',
        label: language === 'hi' ? 'विवरण देखें' : language === 'gu' ? 'વિગત જુઓ' : 'View Details',
        payload: scholarship.slug,
      },
    ],
  };
}

/**
 * Answers quick question chips in Mode 2 (Scholarship-Specific).
 */
export function processScholarshipQuickQuestion(
  questionKey: string,
  scholarship: Scholarship,
  studentAnswers?: StudentAnswers | null,
  eligibilityResult?: MatchResult | null,
  _language: 'en' | 'hi' | 'gu' = 'en'
): AIResponsePayload {
  const ctx = buildScholarshipAIContext(scholarship, studentAnswers, eligibilityResult);

  if (questionKey === 'eligibility') {
    let text = '';
    if (ctx.eligibilityResult) {
      const { status, summaryMessage, checks } = ctx.eligibilityResult;
      const statusTitle =
        status === 'strong_match' ? 'Strong Match' : status === 'possible_match' ? 'Possible Match' : 'Not Eligible';
      text = `### Eligibility Assessment for ${scholarship.name}\n\n**Status: ${statusTitle}**\n${summaryMessage}\n\n**Detailed Rule Checks:**\n${checks
        .map((c) => `- **${c.label}**: ${c.detail} (${c.status})`)
        .join('\n')}`;
    } else {
      text = `### Eligibility Requirements for ${scholarship.name}\n\n- **Education Level:** ${ctx.educationLevel}\n- **Courses:** ${ctx.stream}\n- **Income Limit:** ${ctx.incomeCriteria}\n- **Minimum Percentage:** ${ctx.academicCriteria}\n- **Gender:** ${ctx.genderCriteria}\n- **Social Category:** ${ctx.category}\n\n*Take our 7-step questionnaire to evaluate your personal profile against this scheme.*`;
    }
    return {
      message: text,
      scholarshipIds: [scholarship.id],
      sourceLinks: [{ title: 'Official Portal', url: ctx.officialUrl }],
    };
  }

  if (questionKey === 'documents') {
    const text = `### Required Documents for ${scholarship.name}\n\nPlease prepare verified, self-attested soft copies:\n\n${scholarship.documents
      .map((d, i) => `${i + 1}. **${d}**`)
      .join('\n')}\n\n> **Tip:** Keep scanned PDFs under 200KB-500KB as required by the official portal upload guidelines.`;
    return {
      message: text,
      scholarshipIds: [scholarship.id],
      sourceLinks: [{ title: 'Official Portal', url: ctx.officialUrl }],
    };
  }

  if (questionKey === 'howToApply') {
    let steps = '';
    if (scholarship.howToApplySteps && scholarship.howToApplySteps.length > 0) {
      steps = scholarship.howToApplySteps.map((s, i) => `**Step ${i + 1}:** ${s}`).join('\n\n');
    } else {
      steps = `The detailed step-by-step application procedure is governed directly by the official authority. Please access the verified portal link below.`;
    }
    return {
      message: `### How to Apply for ${scholarship.name}\n\n${steps}\n\nDirect Portal: [${ctx.officialUrl}](${ctx.officialUrl})`,
      scholarshipIds: [scholarship.id],
      sourceLinks: [{ title: 'Official Portal', url: ctx.officialUrl }],
    };
  }

  if (questionKey === 'deadline') {
    return {
      message: `### Application Dates for ${scholarship.name}\n\n- **Applications Open:** ${ctx.openingDate}\n- **Application Deadline:** ${ctx.deadline}\n- **Current Status:** **${ctx.status}**\n\nAlways submit your application and verify institutional endorsement at least 5 days before the deadline.`,
      scholarshipIds: [scholarship.id],
      sourceLinks: [{ title: 'Official Portal', url: ctx.officialUrl }],
    };
  }

  if (questionKey === 'benefits') {
    return {
      message: `### Financial Assistance & Benefits for ${scholarship.name}\n\n**Coverage:** ${scholarship.benefits.amountDescription}\n\n${
        scholarship.benefits.tuitionFeeCoverage ? `- **Tuition Fee:** ${scholarship.benefits.tuitionFeeCoverage}\n` : ''
      }${scholarship.benefits.hostelAllowance ? `- **Hostel Allowance:** ${scholarship.benefits.hostelAllowance}\n` : ''}${
        scholarship.benefits.bookAllowance ? `- **Book Allowance:** ${scholarship.benefits.bookAllowance}\n` : ''
      }\n*Benefits are credited directly via Direct Benefit Transfer (DBT) into the student's Aadhaar-seeded bank account.*`,
      scholarshipIds: [scholarship.id],
      sourceLinks: [{ title: 'Official Portal', url: ctx.officialUrl }],
    };
  }

  // officialSource
  return {
    message: `### Official Portal for ${scholarship.name}\n\nYou can apply, check official merit lists, and review guidelines directly at:\n\n🔗 **[${ctx.officialUrl}](${ctx.officialUrl})**\n\n*Edvora does not charge fees or process forms. Never pay money for scholarship registration.*`,
    scholarshipIds: [scholarship.id],
    sourceLinks: [{ title: `${scholarship.shortName} Official Portal`, url: ctx.officialUrl }],
  };
}

/**
 * Handles general discovery and questions in Mode 1 (Global Assistant).
 */
export function processGlobalQuery(
  rawQuery: string,
  options: {
    studentAnswers?: StudentAnswers | null;
    currentPage?: string;
    language?: 'en' | 'hi' | 'gu';
  } = {}
): AIResponsePayload {
  const query = rawQuery.toLowerCase().trim();
  const lang = options.language || 'en';
  const studentAnswers = options.studentAnswers;

  // 1. Personalized recommendation request ("find for me", "which scholarships should I apply for", "suggest for me")
  if (
    query.includes('for me') ||
    query.includes('should i apply') ||
    query.includes('my scholarship') ||
    query.includes('eligible for me') ||
    query.includes('find scholarships for me')
  ) {
    if (studentAnswers) {
      const results = evaluateAllScholarships(SCHOLARSHIPS_DATA, studentAnswers);
      const strong = results.filter((r) => r.status === 'strong_match');
      const possible = results.filter((r) => r.status === 'possible_match');

      if (strong.length > 0 || possible.length > 0) {
        const topIds = [...strong.map((s) => s.scholarshipId), ...possible.map((p) => p.scholarshipId)].slice(0, 3);
        const topScholarships = SCHOLARSHIPS_DATA.filter((s) => topIds.includes(s.id));

        return {
          message:
            lang === 'hi'
              ? `आपकी वर्तमान प्रश्नावली के उत्तरों के आधार पर, यहाँ आपके सबसे मजबूत मिलान दिए गए हैं:\n\n${topScholarships
                  .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
                  .join('\n')}\n\nविवरण देखने या सहेजने के लिए नीचे दिए गए कार्ड का उपयोग करें।`
              : lang === 'gu'
              ? `તમારા પ્રશ્નાવલીના જવાબોના આધારે, અહીં તમારા સૌથી શ્રેષ્ઠ મેળ આપેલા છે:\n\n${topScholarships
                  .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
                  .join('\n')}\n\nવિગત જોવા અથવા સાચવવા નીચેના કાર્ડનો ઉપયોગ કરો.`
              : `Based on the information you provided in this session, here are your strongest scholarship matches:\n\n${topScholarships
                  .map((s) => `• **${s.name}** (${s.provider}) — ${s.benefits.amountDescription}`)
                  .join('\n')}\n\nReview the recommendations below to view details or bookmark them for later.`,
          scholarshipIds: topIds,
          actions: [
            { type: 'find', label: lang === 'hi' ? 'सभी परिणाम देखें' : lang === 'gu' ? 'બધા પરિણામો જુઓ' : 'View Match Results' },
            { type: 'explore', label: lang === 'hi' ? 'डेटाबेस देखें' : lang === 'gu' ? 'ડેટાબેઝ જુઓ' : 'Explore All' },
          ],
        };
      }
    }

    return {
      message:
        lang === 'hi'
          ? `आपने अभी तक अपनी प्रोफ़ाइल की जानकारी नहीं भरी है। अपनी शिक्षा, श्रेणी और अंकों के अनुसार सटीक छात्रवृत्तियां खोजने के लिए हमारा 7-प्रश्नों का फ़ाइंडर शुरू करें!`
          : lang === 'gu'
          ? `તમે હજુ સુધી તમારી પ્રોફાઇલ વિગતો ભરેલી નથી. તમારા શિક્ષણ અને કેટેગરી અનુસાર યોગ્ય શિષ્યવૃત્તિ શોધવા માટે અમારું 7-પ્રશ્નોનું ફાઇન્ડર શરૂ કરો!`
          : `You haven't completed the questionnaire in this session yet. Take our simple 7-question finder to discover scholarships tailored to your exact education, category, and state!`,
      actions: [
        { type: 'find', label: lang === 'hi' ? 'प्रश्नावली शुरू करें' : lang === 'gu' ? 'પ્રશ્નાવલી શરૂ કરો' : 'Start 7-Step Finder' },
        { type: 'explore', label: lang === 'hi' ? 'सभी छात्रवृत्तियां देखें' : lang === 'gu' ? 'બધી શિષ્યવૃત્તિઓ જુઓ' : 'Explore Scholarships' },
      ],
    };
  }

  // 2. Diploma queries
  if (query.includes('diploma') || query.includes('polytechnic')) {
    const diplomaScholarships = SCHOLARSHIPS_DATA.filter((s) => s.educationLevels.includes('Diploma'));
    return {
      message:
        lang === 'hi'
          ? `एडवोरा के पास डिप्लोमा / पॉलिटेक्निक छात्रों के लिए **${diplomaScholarships.length} सत्यापित छात्रवृत्तियां** उपलब्ध हैं:\n\n${diplomaScholarships
              .map((s) => `• **${s.name}** (${s.provider}) — ${s.benefits.amountDescription}`)
              .join('\n')}\n\nआप नीचे दिए गए कार्ड से सीधे विवरण देख सकते हैं।`
          : lang === 'gu'
          ? `એડવોરા પાસે ડિપ્લોમા / પોલિટેકનિક વિદ્યાર્થીઓ માટે **${diplomaScholarships.length} ચકાસાયેલી શિષ્યવૃત્તિઓ** ઉપલબ્ધ છે:\n\n${diplomaScholarships
              .map((s) => `• **${s.name}** (${s.provider}) — ${s.benefits.amountDescription}`)
              .join('\n')}\n\nતમે નીચેના કાર્ડ દ્વારા વિગત જોઈ શકો છો.`
          : `We found **${diplomaScholarships.length} verified scholarships** for Polytechnic and Diploma students:\n\n${diplomaScholarships
              .map((s) => `• **${s.name}** (${s.provider}) — ${s.benefits.amountDescription}`)
              .join('\n')}\n\nClick any card below to view requirements or save for later.`,
      scholarshipIds: diplomaScholarships.map((s) => s.id),
      actions: [{ type: 'explore', label: 'Explore Directory' }],
    };
  }

  // 3. Comparison query ("Compare MYSY and CSSS", "compare mysy and aicte")
  if (query.includes('compare')) {
    const s1 = SCHOLARSHIPS_DATA.find((s) => s.id.includes('mysy') || s.name.toLowerCase().includes('mysy')) || SCHOLARSHIPS_DATA[0];
    const s2 = SCHOLARSHIPS_DATA.find((s) => s.id.includes('csss') || s.shortName.toLowerCase().includes('csss')) || SCHOLARSHIPS_DATA[1];

    return {
      message: `### Comparison: ${s1.shortName} vs ${s2.shortName}\n\n| Criteria | ${s1.shortName} | ${s2.shortName} |\n| :--- | :--- | :--- |\n| **Authority** | ${s1.provider} | ${s2.provider} |\n| **Region** | ${s1.state} | ${s2.state} |\n| **Education** | ${s1.educationLevels.join(', ')} | ${s2.educationLevels.join(', ')} |\n| **Income Limit** | ${s1.incomeLimit ? `≤ ₹${s1.incomeLimit.toLocaleString('en-IN')}` : 'None (Merit)'} | ${s2.incomeLimit ? `≤ ₹${s2.incomeLimit.toLocaleString('en-IN')}` : 'None (Merit)'} |\n| **Min. %** | ${s1.minimumPercentage ? `≥ ${s1.minimumPercentage}%` : 'Passing'} | ${s2.minimumPercentage ? `≥ ${s2.minimumPercentage}%` : 'Passing'} |\n| **Benefit** | ${s1.benefits.amountDescription} | ${s2.benefits.amountDescription} |\n| **Deadline** | ${formatDate(s1.applicationDeadline)} | ${formatDate(s2.applicationDeadline)} |\n\n*Use Edvora's built-in side-by-side Compare Tray to compare up to 3 scholarships directly.*`,
      scholarshipIds: [s1.id, s2.id],
      actions: [{ type: 'compare', label: 'Open Compare Tool' }],
    };
  }

  // 4. Gujarat queries
  if (query.includes('gujarat') || query.includes('mysy') || query.includes('cmss')) {
    if (query.includes('mysy')) {
      const mysy = SCHOLARSHIPS_DATA.find((s) => s.id === 'mysy-gujarat');
      if (mysy) {
        return {
          message:
            lang === 'hi'
              ? `**${mysy.name} (MYSY)** गुजरात सरकार की एक प्रमुख योजना है।\n\n• **पात्रता:** 12वीं/डिप्लोमा में ≥80 पर्सेंटाइल और पारिवारिक वार्षिक आय ≤ ₹6,00,000।\n• **लाभ:** ${mysy.benefits.amountDescription}\n• **अंतिम तिथि:** ${formatDate(mysy.applicationDeadline)}`
              : lang === 'gu'
              ? `**${mysy.name} (MYSY)** ગુજરાત સરકારની મુખ્ય સહાય યોજના છે.\n\n• **પાત્રતા:** ધોરણ ૧૨/ડિપ્લોમામાં ≥૮૦ પર્સન્ટાઇલ અને વાર્ષિક આવક ≤ ₹૬,૦૦,૦૦૦.\n• **લાભ:** ${mysy.benefits.amountDescription}\n• **છેલ્લી તારીખ:** ${formatDate(mysy.applicationDeadline)}`
              : `**${mysy.name} (MYSY)** is a premier Gujarat State Government scheme.\n\n• **Eligibility:** ≥80th percentile in 12th/Diploma and family annual income ≤ ₹6,00,000.\n• **Benefits:** ${mysy.benefits.amountDescription}\n• **Deadline:** ${formatDate(mysy.applicationDeadline)}\n• **Application Portal:** [mysy.guj.nic.in](${mysy.applicationWebsite})`,
          scholarshipIds: [mysy.id],
          sourceLinks: [{ title: 'MYSY Official Portal', url: mysy.applicationWebsite }],
          actions: [{ type: 'view_scholarship', label: 'View MYSY Details', payload: mysy.slug }],
        };
      }
    }

    const gujScholarships = SCHOLARSHIPS_DATA.filter((s) => s.state === 'Gujarat');
    return {
      message:
        lang === 'hi'
          ? `गुजरात के छात्रों के लिए **${gujScholarships.length} सत्यापित सरकारी योजनाएं** उपलब्ध हैं:\n\n${gujScholarships
              .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
              .join('\n')}`
          : lang === 'gu'
          ? `ગુજરાતના વિદ્યાર્થીઓ માટે **${gujScholarships.length} ચકાસાયેલી સરકારી યોજનાઓ** ઉપલબ્ધ છે:\n\n${gujScholarships
              .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
              .join('\n')}`
          : `There are **${gujScholarships.length} verified Gujarat State Government scholarships** in the Edvora catalog:\n\n${gujScholarships
              .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
              .join('\n')}\n\nExplore below:`,
      scholarshipIds: gujScholarships.map((s) => s.id),
      actions: [{ type: 'explore', label: 'Explore Gujarat Scholarships' }],
    };
  }

  // 5. Income limit queries (e.g. "income limits below 2.5 lakh", "below 2 lakh")
  if (query.includes('income') || query.includes('lakh')) {
    let limit = 250000;
    if (query.includes('6 lakh') || query.includes('6,00,000')) limit = 600000;
    else if (query.includes('8 lakh') || query.includes('8,00,000')) limit = 800000;
    else if (query.includes('4.5 lakh') || query.includes('4,50,000')) limit = 450000;

    const matched = SCHOLARSHIPS_DATA.filter((s) => s.incomeLimit !== null && s.incomeLimit <= limit);
    return {
      message: `Here are the scholarships with family income limits up to **₹${limit.toLocaleString('en-IN')}**:\n\n${matched
        .map((s) => `• **${s.name}**: Max annual family income ₹${s.incomeLimit?.toLocaleString('en-IN')} (${s.provider})`)
        .join('\n')}`,
      scholarshipIds: matched.map((s) => s.id),
      actions: [{ type: 'explore', label: 'Filter in Directory' }],
    };
  }

  // 6. Documents query
  if (query.includes('document') || query.includes('certificate')) {
    return {
      message: `### Standard Documents Commonly Required for Scholarships\n\n1. **Aadhaar Card** (Linked with bank account)\n2. **Income Certificate** (Issued by Competent Authority / Mamlatdar / Tehsildar)\n3. **Caste / Social Category Certificate** (For SC / ST / SEBC / EWS)\n4. **Previous Academic Marksheets** (10th, 12th, or Degree semester transcripts)\n5. **Admission Fee Receipt & Bonafide Certificate** from Current College/School\n6. **Bank Account Passbook / Cancelled Cheque** (With IFSC and Account Holder Name)\n7. **Domicile Certificate** (For State specific grants like Gujarat MYSY)\n8. **Disability Certificate / UDID** (Only if applying under PwD category)\n\n*Always keep self-attested PDF copies ready.*`,
      actions: [{ type: 'explore', label: 'Browse Scholarships' }],
    };
  }

  // 7. Undergraduate queries
  if (query.includes('undergraduate') || query.includes('ug') || query.includes('b.tech') || query.includes('degree')) {
    const ugList = SCHOLARSHIPS_DATA.filter((s) => s.educationLevels.includes('Undergraduate'));
    return {
      message: `Found **${ugList.length} verified undergraduate scholarships** (B.E., B.Tech, MBBS, B.Sc, B.Com, B.A.):\n\n${ugList
        .map((s) => `• **${s.name}** — ${s.benefits.amountDescription}`)
        .join('\n')}`,
      scholarshipIds: ugList.map((s) => s.id),
      actions: [{ type: 'explore', label: 'Explore Undergraduate Schemes' }],
    };
  }

  // 8. Girls / Women queries
  if (query.includes('girl') || query.includes('women') || query.includes('female')) {
    const girlsList = SCHOLARSHIPS_DATA.filter((s) => s.genderEligibility === 'Female');
    return {
      message: `Here are scholarships exclusively dedicated to female students:\n\n${girlsList
        .map((s) => `• **${s.name}** (${s.provider}) — ${s.benefits.amountDescription}`)
        .join('\n')}`,
      scholarshipIds: girlsList.map((s) => s.id),
      actions: [{ type: 'explore', label: 'Explore Female Grants' }],
    };
  }

  // 9. How to apply / How to find
  if (query.includes('how to apply') || query.includes('how do i apply') || query.includes('how to find')) {
    return {
      message: `### How to Find and Apply for Scholarships on Edvora\n\n1. **Take the 7-Step Finder:** Click [Find My Scholarships](#/find) and answer basic questions (education, category, state, income).\n2. **Review Your Matches:** Edvora's rule-based engine categorizes schemes into **Strong Matches**, **Possible Matches**, and non-matching schemes with clear reasons.\n3. **Compare Options:** Add up to 3 scholarships to your side-by-side comparison tray.\n4. **Apply on Official Portal:** Click through to verified government websites (e.g. Digital Gujarat, NSP, MYSY) to submit your documents.\n\n*Edvora is 100% free and never requires student registration or passwords.*`,
      actions: [
        { type: 'find', label: 'Start 7-Step Finder' },
        { type: 'explore', label: 'Browse Catalog' },
      ],
    };
  }

  // Default Fallback
  const featured = SCHOLARSHIPS_DATA.slice(0, 3);
  return {
    message:
      lang === 'hi'
        ? `मैं आपकी छात्रवृत्तियां खोजने, पात्रता नियमों को समझने और योजनाओं की तुलना करने में सहायता कर सकता हूँ। आप मुझसे विशिष्ट पाठ्यक्रमों (जैसे डिप्लोमा, स्नातक), राज्यों (जैसे गुजरात) या योजनाओं (जैसे MYSY, CSSS) के बारे में पूछ सकते हैं!`
        : lang === 'gu'
        ? `હું તમને શિષ્યવૃત્તિઓ શોધવામાં, પાત્રતાના નિયમો સમજવામાં અને યોજનાઓની સરખામણી કરવામાં મદદ કરી શકું છું. તમે ચોક્કસ અભ્યાસક્રમો (જેમ કે ડિપ્લોમા, ગ્રેજ્યુએશન), રાજ્યો અથવા ચોક્કસ યોજનાઓ (જેમ કે MYSY, CSSS) વિશે પૂછી શકો છો!`
        : `I'm Edvora's AI Assistant. I can help you discover scholarships, explain eligibility requirements, check required documents, and compare schemes.\n\nTry asking:\n• *"Which scholarships are available for diploma students?"*\n• *"What scholarships can I apply for in Gujarat?"*\n• *"Compare MYSY and CSSS"*\n• *"What documents are commonly required?"*`,
    scholarshipIds: featured.map((s) => s.id),
    actions: [
      { type: 'find', label: 'Take 7-Step Finder' },
      { type: 'explore', label: 'Explore All Scholarships' },
    ],
  };
}
