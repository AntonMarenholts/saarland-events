// src/app/page.tsx
import { db } from "@/db";
import EventCard from "@/components/EventCard/EventCard";
import { eq } from "drizzle-orm";
import { eventsTable } from "@/db/schema";

export default async function Home() {
  // Получаем все события со статусом 'approved' вместе с их переводами
  const allEvents = await db.query.eventsTable.findMany({
    where: eq(eventsTable.status, "approved"),
    with: {
      translations: true, // Включаем связанные переводы
    },
    orderBy: (events, { asc }) => [asc(events.date)], // Сортируем по дате
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Ближайшие события в Саарланде
      </h1>

      {/* Сетка для отображения карточек событий */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Сообщение, если событий нет */}
      {allEvents.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          К сожалению, пока нет предстоящих событий. Загляните позже!
        </p>
      )}
    </div>
  );
}