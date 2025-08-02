// src/components/EventCard/EventCard.tsx
import { eventsTable, eventTranslationsTable } from "@/db/schema";

// Определяем тип для наших данных о событии
type EventProps = typeof eventsTable.$inferSelect & {
    translations: (typeof eventTranslationsTable.$inferSelect)[];
};

export default function EventCard({ event }: { event: EventProps }) {
  // Ищем перевод на немецкий язык
  const translation = event.translations.find(t => t.locale === 'de');

  return (
    <div className="bg-card-background border border-card-border rounded-lg overflow-hidden shadow-lg">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{translation?.name}</h3>
        <p className="text-gray-500 mb-2">{event.location}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
          {new Date(event.date).toLocaleDateString("de-DE", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })} Uhr
        </p>
        <p className="text-foreground text-base">{translation?.description}</p>
      </div>
    </div>
  );
}