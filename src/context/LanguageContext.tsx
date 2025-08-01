"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import enTranslations from "@/locale/en.json";
import ruTranslations from "@/locale/ru.json";
import deTranslations from "@/locale/de.json";
import ukrTranslations from "@/locale/ukr.json";

type Locale = "en" | "ru" | "de" | "ukr";

// Рекурсивный тип для глубоких переводов
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = Record<string, TranslationValue>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Helper function to get nested keys with a specific type
const getNestedTranslation = (obj: Translations, path: string): string => {
  const keys = path.split('.');
  let result: TranslationValue = obj;
  for (const key of keys) {
    if (typeof result === 'object' && result !== null && key in result) {
      result = result[key];
    } else {
      return path; // Return the key itself if not found
    }
  }
  return typeof result === 'string' ? result : path;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const translations: Record<Locale, Translations> = {
    en: enTranslations,
    ru: ruTranslations,
    de: deTranslations,
    ukr: ukrTranslations,
  };

  const t = (key: string) => {
    return getNestedTranslation(translations[locale], key);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};