import React, { createContext, useContext, useMemo } from 'react';
import { Language, Translations } from './types';
import { ar } from './ar';
import { en } from './en';

export type { Language, Translations };
export { ar, en };

export const dictionaries: Record<Language, Translations> = {
  ar,
  en
};

export function getTranslations(lang: Language): Translations {
  return dictionaries[lang] || dictionaries.ar;
}

export function t(key: keyof Translations, lang: Language): string {
  const dict = getTranslations(lang);
  return dict[key] || dictionaries.ar[key] || (key as string);
}

interface TranslationContextType {
  language: Language;
  t: (key: keyof Translations) => string;
  translations: Translations;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'ar',
  t: (key: keyof Translations) => dictionaries.ar[key] || (key as string),
  translations: dictionaries.ar,
  isRTL: true
});

export const TranslationProvider: React.FC<{
  language: Language;
  children: React.ReactNode;
}> = ({ language, children }) => {
  const value = useMemo(() => {
    const translations = getTranslations(language);
    return {
      language,
      t: (key: keyof Translations) => translations[key] || dictionaries.ar[key] || (key as string),
      translations,
      isRTL: language === 'ar'
    };
  }, [language]);

  return React.createElement(TranslationContext.Provider, { value }, children);
};

export function useTranslation(): TranslationContextType {
  return useContext(TranslationContext);
}
