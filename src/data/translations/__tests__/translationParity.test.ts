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
    'auth',
    'matchScore',
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

  it('auth section contains all login, signup, migration, and dropdown strings across EN, HI, and GU', () => {
    const authKeys = [
      'tagline',
      'slogan',
      'welcomeBack',
      'signInSubtitle',
      'createAccountTitle',
      'createAccountSubtitle',
      'nameLabel',
      'namePlaceholder',
      'emailLabel',
      'emailPlaceholder',
      'passwordLabel',
      'passwordPlaceholder',
      'confirmPasswordLabel',
      'confirmPasswordPlaceholder',
      'forgotPasswordLink',
      'signInBtn',
      'signingIn',
      'createAccountBtn',
      'creatingAccount',
      'continueWithGoogle',
      'connectingToGoogle',
      'orDivider',
      'dontHaveAccount',
      'alreadyHaveAccount',
      'continueAsGuest',
      'resetPasswordTitle',
      'resetPasswordSubtitle',
      'sendResetLink',
      'sendingResetLink',
      'backToSignIn',
      'resetSentTitle',
      'resetSentSubtitle',
      'configNoticeTitle',
      'configNoticeDesc',
      'accountConnectedBadge',
      'guestModeBadge',
    ];

    for (const key of authKeys) {
      expect((en as any).auth[key]).toBeTruthy();
      expect((hi as any).auth[key]).toBeTruthy();
      expect((gu as any).auth[key]).toBeTruthy();
    }

    const dropdownKeys = ['myProfile', 'savedScholarships', 'compare', 'account', 'settings', 'logOut', 'signIn', 'createAccount', 'continueAsGuest'];
    for (const key of dropdownKeys) {
      expect((en as any).auth.profileDropdown[key]).toBeTruthy();
      expect((hi as any).auth.profileDropdown[key]).toBeTruthy();
      expect((gu as any).auth.profileDropdown[key]).toBeTruthy();
    }

    const migrationKeys = ['title', 'subtitle', 'transferBtn', 'startFreshBtn', 'savedScholarshipsNotice'];
    for (const key of migrationKeys) {
      expect((en as any).auth.migration[key]).toBeTruthy();
      expect((hi as any).auth.migration[key]).toBeTruthy();
      expect((gu as any).auth.migration[key]).toBeTruthy();
    }
  });

  it('matchScore section contains all required score, table, and disclaimer strings across EN, HI, and GU', () => {
    const matchScoreKeys = [
      'title',
      'subtitle',
      'disclaimer',
      'howCalculatedTitle',
      'howCalculatedDesc',
      'eligibleBadge',
      'possibleBadge',
      'notEligibleBadge',
      'unavailableBadge',
      'criteriaHeading',
      'tableCriterion',
      'tableYourInfo',
      'tableRequirement',
      'tableStatus',
      'statusSatisfied',
      'statusNotSatisfied',
      'statusCannotDetermine',
      'statusNotProvided',
      'updateProfileBtn',
      'updateMissingTitle',
      'saveAndRecalculate',
      'unknownCountNotice',
    ];

    for (const key of matchScoreKeys) {
      expect((en as any).matchScore[key]).toBeTruthy();
      expect((hi as any).matchScore[key]).toBeTruthy();
      expect((gu as any).matchScore[key]).toBeTruthy();
    }
  });

  it('accountPage section contains all required identity, journey, and security strings across EN, HI, and GU', () => {
    const accountPageKeys = [
      'pageTitle',
      'welcomeBack',
      'subtitle',
      'accountInfoHeading',
      'fullNameLabel',
      'emailLabel',
      'accountStatusLabel',
      'statusConnected',
      'memberSince',
      'editNameBtn',
      'saveChangesBtn',
      'cancelBtn',
      'nameUpdatedSuccess',
      'journeyHeading',
      'profileCompletionLabel',
      'profileReadyNotice',
      'profileNeedsInfoNotice',
      'viewEditProfileBtn',
      'savedScholarshipsLabel',
      'viewSavedBtn',
      'comparedScholarshipsLabel',
      'viewCompareBtn',
      'securityHeading',
      'changePasswordBtn',
      'newPasswordLabel',
      'confirmNewPasswordLabel',
      'updatePasswordBtn',
      'passwordUpdatedSuccess',
      'passwordTooShort',
      'passwordsDoNotMatch',
      'signOutBtn',
      'browseScholarshipsBtn',
      'guestTitle',
      'guestDesc',
      'signInBtn',
      'continueAsGuestBtn',
    ];

    for (const key of accountPageKeys) {
      expect((en as any).accountPage[key]).toBeTruthy();
      expect((hi as any).accountPage[key]).toBeTruthy();
      expect((gu as any).accountPage[key]).toBeTruthy();
    }
  });
});


