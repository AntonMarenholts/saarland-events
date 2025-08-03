import Image from "next/image";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import Link from "next/link";

type EventProps = typeof eventsTable.$inferSelect & {
    translations: (typeof eventTranslationsTable.$inferSelect)[];
};

export default function EventCard({ event }: { event: EventProps }) {
  const translation = event.translations.find(t => t.locale === 'de');

  return (
    <Link href={`/events/${event.id}`} className="block hover:scale-105 transition-transform duration-200">
      <div className="bg-card-background border border-card-border rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
        {event.imageUrl && (
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
          <h3 className="text-xl font-bold mb-2">{translation?.name}</h3>
          <p className="text-gray-500 mb-2">{event.location}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
            {new Date(event.date).toLocaleDateString("de-DE", {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })} Uhr
          </p>
          <p className="text-foreground text-base mt-auto">{translation?.description}</p>
        </div>
      </div>
    </Link>
  );
}