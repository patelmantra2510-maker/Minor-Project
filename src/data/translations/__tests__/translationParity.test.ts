import { describe, it, expect } from 'vitest';
import { en } from '../en';
import { hi } from '../hi';
import { gu } from '../gu';

describe('Translation Parity & Completeness', () => {
  const sections = [
    'nav',
    'common',
    'homePage',
    'categories',
    'questionnaire',
    'results',
    'directory',
    'savedPage',
    'aboutPage',
    'detail',
    'compare',
    'footer',
    'ai',
    'aiPage',
    'profile',
  ];

  it('all three languages have all required top-level sections', () => {
    for (const section of sections) {
      expect(en).toHaveProperty(section);
      expect(hi).toHaveProperty(section);
      expect(gu).toHaveProperty(section);
    }
  });

  it('ai section contains all key interactive prompt strings across EN, HI, and GU', () => {
    const aiKeys = [
      'floatingBtn',
      'askEdvoraAI',
      'panelTitleGlobal',
      'welcomeTitle',
      'suggestedFindForMe',
      'suggestedDiploma',
      'suggestedGujarat',
      'suggestedHowToApply',
      'suggestedCompare',
      'chipEligibility',
      'chipDocuments',
      'chipHowToApply',
      'chipDeadline',
      'chipBenefits',
      'chipOfficialSource',
    ];

    for (const key of aiKeys) {
      expect((en as any).ai[key]).toBeTruthy();
      expect((hi as any).ai[key]).toBeTruthy();
      expect((gu as any).ai[key]).toBeTruthy();
    }
  });

  it('aiPage section contains all key strings across EN, HI, and GU', () => {
    const aiPageKeys = [
      'badge',
      'title',
      'subtitle',
      'tabGeneral',
      'tabGuide',
      'tabPersonalized',
      'selectScholarship',
      'copyGuide',
      'backToBrowse',
      'noAnswerProfile',
      'startQuestionnaire',
    ];

    for (const key of aiPageKeys) {
      expect((en as any).aiPage[key]).toBeTruthy();
      expect((hi as any).aiPage[key]).toBeTruthy();
      expect((gu as any).aiPage[key]).toBeTruthy();
    }
  });

  it('profile section and matching strings have complete parity across EN, HI, and GU', () => {
    const profileMatchingKeys = [
      'findScholarshipsTitle',
      'findScholarshipsSubtitle',
      'profileSummaryTitle',
      'eligibleMatchesTitle',
      'possibleMatchesTitle',
      'notEligibleMatchesTitle',
      'moreInfoNeeded',
      'moreInfoNeededDesc',
      'updateProfileBtn',
      'completeInformationBtn',
      'whyThisMatches',
      'whyNotEligible',
    ];

    for (const key of profileMatchingKeys) {
      expect((en as any).profile.matching[key]).toBeTruthy();
      expect((hi as any).profile.matching[key]).toBeTruthy();
      expect((gu as any).profile.matching[key]).toBeTruthy();
    }
  });
});
