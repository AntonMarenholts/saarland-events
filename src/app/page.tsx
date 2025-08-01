import { db } from "@/db";
import { eventsTable } from "@/db/schema";

export default async function Home() {
  const events = await db.select().from(eventsTable);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Upcoming events in Saarland
      </h1>

      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow-sm"
          >
            {event.imageUrl && (
              <div className="flex-shrink-0 h-[150px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="h-full w-auto object-contain rounded-md bg-gray-100"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-1">{event.name}</h2>
              <p className="text-gray-600">
                <strong>Where:</strong> {event.location}
              </p>
              <p className="text-gray-600">
                <strong>When:</strong>{" "}
                {new Date(event.date).toLocaleString("de-DE")}
              </p>
              {event.description && (
                <p className="mt-2 text-gray-700">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
