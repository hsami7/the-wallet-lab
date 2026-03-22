"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site_language') as Language;
    if (saved && ['en', 'fr', 'ar'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('site_language', lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Apply right-to-left automatically on mount
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir }}>
      <div dir={dir} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
