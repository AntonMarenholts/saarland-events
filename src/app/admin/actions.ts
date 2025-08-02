// src/app/admin/actions.ts

"use server";

import { db } from "@/db";
import { eventsTable, eventTranslationsTable, eventsToCategoriesTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

// Убираем лишний параметр prevState
export async function createEvent(formData: FormData) {
  const name_de = formData.get("name_de") as string;
  const description_de = formData.get("description_de") as string;
  const location = formData.get("location") as string;
  const date = new Date(formData.get("date") as string);
  const categoryId = Number(formData.get("categoryId"));

  // Простая проверка на наличие данных
  if (!name_de || !location || !date || !categoryId) {
    // В этой простой версии мы не можем легко вернуть сообщение об ошибке,
    // но мы можем прервать выполнение, если поля пустые.
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

    // Этот вызов обновит данные на странице после создания события
    revalidatePath("/admin"); 
    
  } catch (error) {
    console.error("Ошибка при создании события:", error);
  }
}