import EventForm from "@/components/EventForm";
import enTranslations from "@/locale/en.json";
import ruTranslations from "@/locale/ru.json";
import deTranslations from "@/locale/de.json";
import ukrTranslations from "@/locale/ukr.json";


const translations = {
  en: enTranslations,
  ru: ruTranslations,
  de: deTranslations,
  ukr: ukrTranslations,
};

type Locale = "en" | "de" | "ukr" | "ru";
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = Record<string, TranslationValue>;


const getNestedTranslation = (obj: Translations, path: string): string => {
  const keys = path.split('.');
  let result: TranslationValue = obj;
  for (const key of keys) {
    if (typeof result === 'object' && result !== null && key in result) {
      result = result[key];
    } else {
      return path; 
    }
  }
  return typeof result === 'string' ? result : path;
};

export default function AdminPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;

  
  const t = (key: string) => {
    return getNestedTranslation(translations[locale] as Translations, key);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("addEventTitle")}</h1>
      <EventForm t={t} locale={locale} />
    </main>
  );
}
