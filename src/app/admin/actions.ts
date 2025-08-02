"use server";

import { db } from "@/db";
import {
  eventsTable,
  eventTranslationsTable,
  eventsToCategoriesTable,
} from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

/**
 * Создает новое событие в базе данных.
 */
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

/**
 * Удаляет событие и все связанные с ним данные.
 */
export async function deleteEvent(eventId: number) {
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Событие успешно удалено." };
  } catch (error) {
    console.error("Ошибка при удалении события:", error);
    return { success: false, message: "Не удалось удалить событие." };
  }
}

/**
 * Обновляет существующее событие с более надежной логикой.
 */
export async function updateEvent(
  prevState: { message: string; success: boolean },
  formData: FormData
) {
  const eventId = Number(formData.get("eventId"));
  const name_de = formData.get("name_de") as string;
  const description_de = formData.get("description_de") as string;
  const location = formData.get("location") as string;
  const date = new Date(formData.get("date") as string);
  const categoryId = Number(formData.get("categoryId"));

  const name_en = formData.get("name_en") as string;
  const description_en = formData.get("description_en") as string;
  const name_ru = formData.get("name_ru") as string;
  const description_ru = formData.get("description_ru") as string;

  try {
    // 1. Обновляем основную информацию о событии
    await db
      .update(eventsTable)
      .set({ location, date })
      .where(eq(eventsTable.id, eventId));

    // 2. Обновляем или создаем переводы
    const translations = [
      { locale: "de", name: name_de, description: description_de },
      { locale: "en", name: name_en, description: description_en },
      { locale: "ru", name: name_ru, description: description_ru },
    ];

    for (const t of translations) {
      if (t.name) {
        // Обрабатываем только если есть название
        const existing = await db.query.eventTranslationsTable.findFirst({
          where: and(
            eq(eventTranslationsTable.eventId, eventId),
            eq(eventTranslationsTable.locale, t.locale)
          ),
        });

        if (existing) {
          // Если перевод существует, обновляем его
          await db
            .update(eventTranslationsTable)
            .set({ name: t.name, description: t.description })
            .where(eq(eventTranslationsTable.id, existing.id));
        } else {
          // Если перевода нет, создаем его
          await db.insert(eventTranslationsTable).values({
            eventId,
            locale: t.locale,
            name: t.name,
            description: t.description,
          });
        }
      }
    }

    // 3. Обновляем категорию
    await db
      .update(eventsToCategoriesTable)
      .set({ categoryId })
      .where(eq(eventsToCategoriesTable.eventId, eventId));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/admin/edit/${eventId}`);

    return { success: true, message: "Событие успешно обновлено!" };
  } catch (error) {
    console.error("Ошибка при обновлении события:", error);
    return {
      success: false,
      message: "Не удалось обновить событие. Попробуйте еще раз.",
    };
  }
}

/**
 * Получает данные о событии для страницы редактирования.
 */
export async function getEventForEdit(eventId: number) {
  const eventData = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, eventId),
    with: {
      translations: true,
      eventsToCategories: true,
    },
  });

  const allCategories = await db.query.categoriesTable.findMany();

  return { eventData, allCategories };
}
