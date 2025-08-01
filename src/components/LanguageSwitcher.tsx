"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const locales: ("en" | "de" | "ukr" | "ru")[] = ["en", "de", "ukr", "ru"];

  return (
    <div className="flex gap-2">
      {locales.map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={`px-3 py-1 rounded-md ${
            locale === lang ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {t(`languages.${lang}`)}
        </button>
      ))}
    </div>
  );
}