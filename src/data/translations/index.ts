import { en } from './en';
import { hi } from './hi';
import { gu } from './gu';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

export type TranslationDictionary = typeof en;

export const TRANSLATIONS_CATALOG: Record<SupportedLanguage, any> = {
  en,
  hi,
  gu,
};

export { en, hi, gu };
