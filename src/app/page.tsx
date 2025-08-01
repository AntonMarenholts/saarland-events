import { db } from "@/db";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{getNestedTranslation(translations[locale] as Translations, "pageTitle")}</h1>
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div className="space-y-6">
        {events.length === 0 ? (
          <p className="text-gray-500">Нет одобренных событий для отображения.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow-sm"
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
    </main>
  );
}
