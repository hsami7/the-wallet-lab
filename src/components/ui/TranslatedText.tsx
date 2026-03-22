"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/utils/translations";

export function TranslatedText({ tKey }: { tKey: string }) {
  const { language } = useLanguage();
  
  const keys = tKey.split('.');
  let value: any = translations[language as keyof typeof translations];
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      value = null;
      break;
    }
  }

  return <>{value || tKey}</>;
}
