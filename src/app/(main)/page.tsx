// src/app/page.tsx
import { db } from "@/db";
import EventCard from "@/components/EventCard/EventCard";
import { and, eq } from "drizzle-orm";
import { eventsTable, eventsToCategoriesTable } from "@/db/schema";
import { getServerSession } from "next-auth"; // <-- Импортируем
import { authOptions } from "@/lib/auth/authOptions"; // <-- Импортируем
import { redirect } from "next/navigation"; // <-- Импортируем

export default async function Home({
  searchParams,
}: {
  searchParams?: { city?: string; category?: string };
}) {
  // --- НАЧАЛО НОВОГО КОДА ---
  const session = await getServerSession(authOptions);

  // Если пользователь — админ, перенаправляем его в админ-панель
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }
  // --- КОНЕЦ НОВОГО КОДА ---

  const city = searchParams?.city;
  const categoryId = searchParams?.category ? Number(searchParams.category) : undefined;

  const conditions = [eq(eventsTable.status, "approved")];
  if (city && city !== "Ganzes Saarland") {
    conditions.push(eq(eventsTable.location, city));
  }

  const eventsQuery = db.selectDistinct({ event: eventsTable })
    .from(eventsTable)
    .leftJoin(eventsToCategoriesTable, eq(eventsTable.id, eventsToCategoriesTable.eventId))
    .where(and(...conditions, categoryId ? eq(eventsToCategoriesTable.categoryId, categoryId) : undefined))
    .orderBy(eventsTable.date);

  const filteredEventIds = (await eventsQuery).map(item => item.event.id);

  const allEvents = filteredEventIds.length > 0
    ? await db.query.eventsTable.findMany({
        where: (events, { inArray }) => inArray(events.id, filteredEventIds),
        with: {
          translations: true,
        },
        orderBy: (events, { asc }) => [asc(events.date)],
      })
    : [];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Ближайшие события в Саарланде
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {allEvents.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          К сожалению, по вашим критериям событий не найдено.
        </p>
      )}
    </div>
  );
}