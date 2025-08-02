// src/app/api/translate/route.ts
import { NextResponse } from "next/server";

// ВАЖНО: Мы пока не будем подключать настоящий сервис перевода,
// чтобы не усложнять настройку API-ключей.
// Вместо этого мы создадим "заглушку", которая имитирует перевод.
// Позже мы заменим ее на реальный вызов Google Translate API.

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Отсутствует текст или целевой язык." }, { status: 400 });
    }

    // --- Имитация перевода ---
    const translatedText = `[${targetLang.toUpperCase()}] ${text}`;
    // -------------------------

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("Ошибка перевода:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера." }, { status: 500 });
  }
}