import { useState, useEffect, useCallback } from 'react';
import { translations } from '../lib/translations';

type Language = keyof typeof translations;
type AvailableLanguages = { [key: string]: string };

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('badmusic-lang') as Language;
        if (storedLang && translations[storedLang]) {
            return storedLang;
        }
        const browserLang = navigator.language.split('-')[0] as Language;
        if (translations[browserLang]) {
            return browserLang;
        }
    }
    return 'en';
};

export const useTranslations = () => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('badmusic-lang', language);
  }, [language]);
  
  const setLanguage = useCallback((lang: string) => {
    if (translations[lang as Language]) {
      setLanguageState(lang as Language);
    }
  }, []);

  const t = (key: string, options?: { [key: string]: string | number }): any => {
    let text = translations[language][key] || translations['en'][key];
    
    if (!text) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    
    if (typeof text !== 'string') {
        return text;
    }

    if (options) {
      Object.keys(options).forEach(placeholder => {
        text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(options[placeholder]));
      });
    }

    return text;
  };
  
  const availableLanguages: AvailableLanguages = t('languages');

  return { t, language, setLanguage, availableLanguages };
};
