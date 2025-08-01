"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  id: number;
  location: string;
  date: Date;
  imageUrl: string | null;
  status: string;
  name: string | null;
  description: string | null;
};

export default function ModerationList({ events: initialEvents }: { events: Event[] }) {
  const [events, setEvents] = useState(initialEvents);
  const router = useRouter();

  const handleModerate = async (eventId: number, newStatus: "approved" | "rejected") => {
    const res = await fetch(`/api/moderate-event/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      // Обновляем состояние, чтобы удалить событие из списка
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      router.refresh(); // Обновляем страницу для синхронизации
    } else {
      alert("Ошибка при модерации события.");
    }
  };

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <p className="text-gray-500">Нет событий, ожидающих модерации.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-600 mt-1">{event.location}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleString()}
            </p>
            {event.description && <p className="mt-2">{event.description}</p>}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleModerate(event.id, "approved")}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Одобрить
              </button>
              <button
                onClick={() => handleModerate(event.id, "rejected")}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Отклонить
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}