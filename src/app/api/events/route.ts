import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eventsTable, eventTranslationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Валидация обязательных полей
    const {
      location,
      date,
      imageUrl,
      organizerName,
      organizerEmail,
      name_en,
      description_en,
      name_de,
      description_de,
      name_ukr,
      description_ukr,
      name_ru,
      description_ru,
    } = body;

    if (!location || !date || !name_en) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Использование транзакции для атомарной операции
    await db.transaction(async (tx) => {
      // 1. Вставка основного события
      const [newEvent] = await tx
        .insert(eventsTable)
        .values({
          location,
          date: new Date(date),
          imageUrl,
          organizerName,
          organizerEmail,
          status: "pending", // Все новые события сначала ожидают модерации
        })
        .returning();

      if (!newEvent) {
        throw new Error("Failed to create new event.");
      }

      const eventId = newEvent.id;

      // 2. Вставка переводов
      if (name_en) {
        await tx.insert(eventTranslationsTable).values({
          eventId,
          locale: "en",
          name: name_en,
          description: description_en,
        });
      }

      if (name_de) {
        await tx.insert(eventTranslationsTable).values({
          eventId,
          locale: "de",
          name: name_de,
          description: description_de,
        });
      }

      if (name_ukr) {
        await tx.insert(eventTranslationsTable).values({
          eventId,
          locale: "ukr",
          name: name_ukr,
          description: description_ukr,
        });
      }

      if (name_ru) {
        await tx.insert(eventTranslationsTable).values({
          eventId,
          locale: "ru",
          name: name_ru,
          description: description_ru,
        });
      }
    });

    return NextResponse.json(
      { message: "Event created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 }
    );
  }
}