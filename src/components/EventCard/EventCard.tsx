"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
// --- ИСПРАВЛЕНИЕ ---
import { Link } from "@/navigation";

type EventProps = typeof eventsTable.$inferSelect & {
    translations: (typeof eventTranslationsTable.$inferSelect)[];
};

export default function EventCard({ event }: { event: EventProps }) {
  const locale = useLocale(); // <-- Получаем текущую локаль ('de', 'en' или 'ru')

  // Ищем перевод для текущего языка. Если его нет, используем немецкий как запасной.
  const translation = event.translations.find(t => t.locale === locale) 
                   || event.translations.find(t => t.locale === 'de');

  return (
    <Link href={`/events/${event.id}`} className="block hover:scale-105 transition-transform duration-200">
      <div className="bg-card-background border border-card-border rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
        {event.imageUrl && (
          // ... (код для Image без изменений)
          <div className="relative w-full h-48">
              <Image 
                src={event.imageUrl} 
                alt={translation?.name || 'Event image'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
          </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
          {/* Теперь здесь будет название на выбранном языке */}
          <h3 className="text-xl font-bold mb-2">{translation?.name}</h3>
          <p className="text-gray-500 mb-2">{event.location}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
            {new Date(event.date).toLocaleDateString(locale, { // Используем locale для форматирования даты
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          {/* И описание на выбранном языке */}
          <p className="text-foreground text-base mt-auto">{translation?.description}</p>
        </div>
      </div>
    </Link>
  );
}
