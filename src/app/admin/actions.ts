// src/app/admin/actions.ts
"use server";

import { db } from "@/db";
import { eventsTable, eventTranslationsTable, eventsToCategoriesTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm"; // <-- ВОТ ИСПРАВЛЕНИЕ

// ... ваша функция createEvent ...
export async function createEvent(formData: FormData) {
  const name_de = formData.get("name_de") as string;
  const description_de = formData.get("description_de") as string;
  const location = formData.get("location") as string;
  const date = new Date(formData.get("date") as string);
  const categoryId = Number(formData.get("categoryId"));

  if (!name_de || !location || !date || !categoryId) {
    console.error("Все поля должны быть заполнены!");
    return;
  }

  try {
    const [newEvent] = await db
      .insert(eventsTable)
      .values({ location, date, status: "approved" })
      .returning();

    await db.insert(eventTranslationsTable).values({
      eventId: newEvent.id,
      locale: "de",
      name: name_de,
      description: description_de,
    });

    await db.insert(eventsToCategoriesTable).values({
      eventId: newEvent.id,
      categoryId: categoryId,
    });
    
    revalidatePath("/admin");
    
  } catch (error) {
    console.error("Ошибка при создании события:", error);
  }
}


export async function deleteEvent(eventId: number) {
  try {
    await db.delete(eventTranslationsTable).where(eq(eventTranslationsTable.eventId, eventId));
    await db.delete(eventsToCategoriesTable).where(eq(eventsToCategoriesTable.eventId, eventId));
    await db.delete(eventsTable).where(eq(eventsTable.id, eventId));

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true, message: "Событие успешно удалено." };
  } catch (error) {
    console.error("Ошибка при удалении события:", error);
    return { success: false, message: "Не удалось удалить событие." };
  }
}