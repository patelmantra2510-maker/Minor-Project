import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SupportedLanguage } from '../data/translations/index';
import { TRANSLATIONS_CATALOG, en } from '../data/translations/index';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>, defaultVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to resolve dot-notation path on an object or direct flat key
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;

  // 1. Direct flat key check (e.g. 'home', 'findScholarships')
  if (path in obj && typeof obj[path] === 'string') {
    return obj[path];
  }

  // 2. Dot path traversal (e.g. 'nav.home', 'homePage.heroTitle')
  const segments = path.split('.');
  let current: any = obj;
  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in current) {
      current = current[seg];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = (localStorage.getItem('edvora_lang') || localStorage.getItem('vidyasetu_lang')) as SupportedLanguage;
      if (saved === 'en' || saved === 'gu' || saved === 'hi') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('edvora_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = useCallback(
    (key: string, params?: Record<string, string | number>, defaultVal?: string): string => {
      const activeCatalog = TRANSLATIONS_CATALOG[language] || en;
      let text = getNestedValue(activeCatalog, key);

      // Fallback to English if not found in active language
      if (!text && language !== 'en') {
        text = getNestedValue(en, key);
      }

      // Fallback to defaultVal or key
      if (!text) {
        text = defaultVal || key;
      }

      // Replace {param} placeholders if provided
      if (params && typeof text === 'string') {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = (text as string).replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

