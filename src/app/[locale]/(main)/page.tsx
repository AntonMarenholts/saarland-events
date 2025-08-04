import { db } from "@/db";
import EventCard from "@/components/EventCard/EventCard";
import { and, eq, gte, lt } from "drizzle-orm";
import { eventsTable, eventsToCategoriesTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export default async function Home({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: {
    city?: string;
    category?: string;
    year?: string;
    month?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    redirect(`/${params.locale}/admin`);
  }

  const city = searchParams?.city;
  const categoryId = searchParams?.category
    ? Number(searchParams.category)
    : undefined;
  const year = searchParams?.year ? Number(searchParams.year) : undefined;
  const month = searchParams?.month ? Number(searchParams.month) : undefined;

  const conditions = [eq(eventsTable.status, "approved")];

  if (city && city !== "Ganzes Saarland") {
    conditions.push(eq(eventsTable.location, city));
  }

  if (year && month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    conditions.push(gte(eventsTable.date, startDate));
    conditions.push(lt(eventsTable.date, endDate));
  } else if (year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    conditions.push(gte(eventsTable.date, startDate));
    conditions.push(lt(eventsTable.date, endDate));
  }

  const eventsQuery = db
    .selectDistinct({ event: eventsTable })
    .from(eventsTable)
    .leftJoin(
      eventsToCategoriesTable,
      eq(eventsTable.id, eventsToCategoriesTable.eventId)
    )
    .where(
      and(
        ...conditions,
        categoryId
          ? eq(eventsToCategoriesTable.categoryId, categoryId)
          : undefined
      )
    )
    .orderBy(eventsTable.date);

  const filteredEventIds = (await eventsQuery).map((item) => item.event.id);

  const allEvents =
    filteredEventIds.length > 0
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


