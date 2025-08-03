// src/app/api/translate/route.ts
import { NextResponse } from "next/server";
import * as deepl from "deepl-node";

// Проверяем, есть ли ключ API в переменных окружения
if (!process.env.DEEPL_AUTH_KEY) {
  throw new Error("DEEPL_AUTH_KEY is not set in environment variables.");
}

// Создаем клиент DeepL
// Указываем сервер для бесплатной версии API
const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY, {
  serverUrl: "https://api-free.deepl.com",
});

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Отсутствует текст или целевой язык." },
        { status: 400 }
      );
    }

    // Выполняем перевод с помощью DeepL API
    const result = await translator.translateText(
      text,
      null, // Исходный язык будет определен автоматически
      targetLang as deepl.TargetLanguageCode
    );

    // В DeepL API может вернуться массив результатов, если текст был разбит на предложения
    // Мы для простоты объединим их, если их несколько.
    const translatedText = Array.isArray(result)
      ? result.map((r) => r.text).join(" ")
      : result.text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Ошибка перевода:", error);
    // Отправляем более информативное сообщение об ошибке клиенту
    return NextResponse.json(
      {
        error: `Внутренняя ошибка сервера при переводе: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
