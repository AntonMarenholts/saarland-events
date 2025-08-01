"use client";

import { useRouter, usePathname } from "next/navigation";
import enTranslations from "@/locale/en.json";
import ruTranslations from "@/locale/ru.json";
import deTranslations from "@/locale/de.json";
import ukrTranslations from "@/locale/ukr.json";

type Locale = "en" | "de" | "ukr" | "ru";

// Рекурсивный тип для глубоких переводов
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = Record<string, TranslationValue>;

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  ru: ruTranslations,
  de: deTranslations,
  ukr: ukrTranslations,
};

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

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const locales: Locale[] = ["en", "de", "ukr", "ru"];

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
        segments[1] = newLocale;
    } else {
        segments.splice(1, 0, newLocale);
    }
    const newPathname = segments.join('/');

    router.push(newPathname);
  };

  return (
    <div className="flex gap-2">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLocaleChange(lang)}
          className={`px-3 py-1 rounded-md ${
            currentLocale === lang ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {getNestedTranslation(translations[currentLocale], `languages.${lang}`)}
        </button>
      ))}
    </div>
  );
}