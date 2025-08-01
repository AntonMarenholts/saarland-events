import { db } from "@/db";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
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

type Event = {
  id: number;
  location: string;
  date: Date;
  imageUrl: string | null;
  name: string | null;
  description: string | null;
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

export default async function Home({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;

  const events: Event[] = await db
    .select({
      id: eventsTable.id,
      location: eventsTable.location,
      date: eventsTable.date,
      imageUrl: eventsTable.imageUrl,
      name: eventTranslationsTable.name,
      description: eventTranslationsTable.description,
    })
    .from(eventsTable)
    .leftJoin(
      eventTranslationsTable,
      eq(eventsTable.id, eventTranslationsTable.eventId)
    )
    .where(
      and(
        eq(eventsTable.status, "approved"),
        eq(eventTranslationsTable.locale, locale)
      )
    );
  
  const t = (key: keyof typeof enTranslations) => {
    return getNestedTranslation(translations[locale] as Translations, key);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section with Saar River loop image */}
      <div className="relative h-96 w-full overflow-hidden">
        {/* Placeholder for Saar River loop image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{ backgroundImage: `url('https://placehold.co/1200x400/1e293b/FFFFFF?text=Saarschleife')` }}
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <div className="absolute top-4 right-4 flex gap-4 items-center">
            <ThemeSwitcher />
            <LanguageSwitcher currentLocale={locale} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg text-center">
            {getNestedTranslation(translations[locale] as Translations, "pageTitle")}
          </h1>
        </div>
      </div>
      
      <div className="p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {events.length === 0 ? (
            <p className="text-gray-500">Нет одобренных событий для отображения.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg shadow-sm"
                style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--card-border)' }}
              >
                {event.imageUrl && (
                  <div className="flex-shrink-0 h-[150px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.imageUrl}
                      alt={event.name || ""}
                      className="h-full w-auto object-contain rounded-md bg-gray-100"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-1">
                    {event.name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>{getNestedTranslation(translations[locale] as Translations, "where")}</strong> {event.location}
                  </p>
                  <p className="text-gray-600">
                    <strong>{getNestedTranslation(translations[locale] as Translations, "when")}</strong>{" "}
                    {new Date(event.date).toLocaleString(locale)}
                  </p>
                  {event.description && (
                    <p className="mt-2 text-gray-700">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
