"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/utils/translations";

export function HomeNewsletterClient() {
  const { language } = useLanguage();
  const t = translations[language]?.home?.newsletter || translations['en']?.home?.newsletter;

  return (
    <form className="relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <input 
        className="flex-1 bg-white/10 border-white/20 rounded-full px-6 py-4 focus:border-white focus:ring-1 focus:ring-white text-white outline-none placeholder:text-white/60" 
        placeholder={t?.placeholder || "Enter your email"} 
        required 
        type="email" 
      />
      <button 
        className="bg-white hover:bg-slate-50 text-primary font-bold px-8 py-4 rounded-full transition-all" 
        type="submit"
      >
        {t?.button || "Subscribe"}
      </button>
    </form>
  );
}
