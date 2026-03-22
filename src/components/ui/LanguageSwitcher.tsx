"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mr-2">
      <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>EN</button>
      <span className="text-slate-200 dark:text-slate-800">/</span>
      <button onClick={() => setLanguage('fr')} className={`${language === 'fr' ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>FR</button>
      <span className="text-slate-200 dark:text-slate-800">/</span>
      <button onClick={() => setLanguage('ar')} className={`${language === 'ar' ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'} transition-colors`}>AR</button>
    </div>
  );
}
