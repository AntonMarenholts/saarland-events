// src/components/DeleteEventButton.tsx
"use client";

import { deleteEvent } from "@/app/actions";

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить это событие?")) {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
      Удалить
    </button>
  );
}
