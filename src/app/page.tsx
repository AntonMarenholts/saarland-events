"use client";

import { db } from "@/db";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { eq } from "drizzle-orm";

// Определяем тип для результата запроса, чтобы убрать ошибку 'any'
type EventWithTranslation = {
  events: typeof eventsTable.$inferSelect;
  event_translations: typeof eventTranslationsTable.$inferSelect | null;
};

export default function Home() {
  const { locale, t } = useLanguage();
  const [events, setEvents] = useState<EventWithTranslation[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      // Важное замечание: Эта логика получения данных должна быть перенесена
      // в API-маршрут или Server Component для продакшена.
      // Здесь она оставлена для простоты демонстрации работы переключения языков.
      const fetchedEvents = await db
        .select()
        .from(eventsTable)
        .leftJoin(
          eventTranslationsTable,
          eq(eventsTable.id, eventTranslationsTable.eventId) // <-- Исправленная строка
        )
        .where(eq(eventTranslationsTable.locale, locale)); // <-- Исправленная строка
      setEvents(fetchedEvents);
    }
    fetchEvents();
  }, [locale]);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
        <LanguageSwitcher />
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.events.id}
            className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow-sm"
          >
            {event.events.imageUrl && (
              <div className="flex-shrink-0 h-[150px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.events.imageUrl}
                  alt={event.event_translations?.name || ""}
                  className="h-full w-auto object-contain rounded-md bg-gray-100"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-1">
                {event.event_translations?.name}
              </h2>
              <p className="text-gray-600">
                <strong>{t("where")}</strong> {event.events.location}
              </p>
              <p className="text-gray-600">
                <strong>{t("when")}</strong>{" "}
                {new Date(event.events.date).toLocaleString(locale)}
              </p>
              {event.event_translations?.description && (
                <p className="mt-2 text-gray-700">
                  {event.event_translations.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}