import { db } from "@/db";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import ModerationList from "@/components/ModerationList";

export default async function ModerationPage() {
  const pendingEvents = await db
    .select({
      id: eventsTable.id,
      location: eventsTable.location,
      date: eventsTable.date,
      imageUrl: eventsTable.imageUrl,
      status: eventsTable.status,
      name: eventTranslationsTable.name,
      description: eventTranslationsTable.description,
    })
    .from(eventsTable)
    .leftJoin(
      eventTranslationsTable,
      eq(eventsTable.id, eventTranslationsTable.eventId)
    )
    .where(and(eq(eventsTable.status, "pending"), eq(eventTranslationsTable.locale, "en")));

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Модерация событий</h1>
      <ModerationList events={pendingEvents} />
    </main>
  );
}