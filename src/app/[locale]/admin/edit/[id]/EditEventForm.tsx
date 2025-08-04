"use client";

import { useActionState, useState } from "react";
import { Link } from "@/navigation";
import Image from "next/image";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import type { OutputCollectionState } from "@uploadcare/react-uploader";

import { updateEvent } from "@/app/actions";
import type {
  categoriesTable,
  eventsTable,
  eventTranslationsTable,
  eventsToCategoriesTable,
} from "@/db/schema";

type Category = typeof categoriesTable.$inferSelect;
type EventData = typeof eventsTable.$inferSelect & {
  translations: (typeof eventTranslationsTable.$inferSelect)[];
  eventsToCategories: (typeof eventsToCategoriesTable.$inferSelect)[];
};

interface EditEventFormProps {
  eventData: EventData;
  allCategories: Category[];
}
const initialState = { message: "", success: false };
const saarlandCities = [
  "Ganzes Saarland",
  "Saarbrücken",
  "Neunkirchen",
  "Homburg",
  "Völklingen",
  "St. Ingbert",
  "Saarlouis",
  "Merzig",
  "St. Wendel",
  "Püttlingen",
];

export default function EditEventForm({
  eventData,
  allCategories,
}: EditEventFormProps) {
  const [state, formAction] = useActionState(updateEvent, initialState);
  const [nameDe, setNameDe] = useState(
    eventData.translations.find((t) => t.locale === "de")?.name || ""
  );
  const [descDe, setDescDe] = useState(
    eventData.translations.find((t) => t.locale === "de")?.description || ""
  );
  const [nameEn, setNameEn] = useState(
    eventData.translations.find((t) => t.locale === "en")?.name || ""
  );
  const [descEn, setDescEn] = useState(
    eventData.translations.find((t) => t.locale === "en")?.description || ""
  );
  const [nameRu, setNameRu] = useState(
    eventData.translations.find((t) => t.locale === "ru")?.name || ""
  );
  const [descRu, setDescRu] = useState(
    eventData.translations.find((t) => t.locale === "ru")?.description || ""
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [imageUrl, setImageUrl] = useState(eventData.imageUrl || "");

  const handleUpload = (event: OutputCollectionState) => {
    if (event.successEntries.length > 0) {
      const file = event.successEntries[0];
      if (file.cdnUrl) {
        setImageUrl(file.cdnUrl);
      }
    }
  };

  const handleTranslate = async () => {
    /* ...эта функция без изменений... */
    setIsTranslating(true);
    try {
      const textsToTranslate = [
        { text: nameDe, lang: "en-US", setter: setNameEn },
        { text: descDe, lang: "en-US", setter: setDescEn },
        { text: nameDe, lang: "ru", setter: setNameRu },
        { text: descDe, lang: "ru", setter: setDescRu },
      ];

      for (const item of textsToTranslate) {
        if (!item.text) continue;
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: item.text, targetLang: item.lang }),
        });

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(
            `Ошибка перевода для языка '${item.lang}': ${
              errorBody.error || res.statusText
            }`
          );
        }

        const { translatedText } = await res.json();
        item.setter(translatedText);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Произошла неизвестная ошибка при переводе.";
      alert(message);
    }
    setIsTranslating(false);
  };

  const formatDateForInput = (date: Date) => {
    /* ...эта функция без изменений... */
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6 gap-4">
        <Link
          href="/admin"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Редактировать событие</h1>
      </div>

      <div className="bg-card-background border border-card-border rounded-lg p-6">
        <form action={formAction} className="space-y-4">
          {/* ...остальные поля формы... */}
          <input type="hidden" name="eventId" value={eventData.id} />

          <div className="border p-4 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="name_de" className="font-medium">
                Немецкий (DE)
              </label>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating}
                className="text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                {isTranslating ? "Перевод..." : "Перевести всё с DE"}
              </button>
            </div>
            <input
              placeholder="Название"
              type="text"
              name="name_de"
              value={nameDe}
              onChange={(e) => setNameDe(e.target.value)}
              required
              className="w-full rounded-md bg-background"
            />
            <textarea
              placeholder="Описание"
              name="description_de"
              value={descDe}
              onChange={(e) => setDescDe(e.target.value)}
              rows={3}
              required
              className="w-full rounded-md bg-background"
            ></textarea>
          </div>

          <div className="border p-4 rounded-md space-y-2">
            <label htmlFor="name_en" className="font-medium">
              Английский (EN)
            </label>
            <input
              placeholder="Название"
              type="text"
              name="name_en"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full rounded-md bg-background"
            />
            <textarea
              placeholder="Описание"
              name="description_en"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-background"
            ></textarea>
          </div>

          <div className="border p-4 rounded-md space-y-2">
            <label htmlFor="name_ru" className="font-medium">
              Русский (RU)
            </label>
            <input
              placeholder="Название"
              type="text"
              name="name_ru"
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              className="w-full rounded-md bg-background"
            />
            <textarea
              placeholder="Описание"
              name="description_ru"
              value={descRu}
              onChange={(e) => setDescRu(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-background"
            ></textarea>
          </div>

          <div>
            <label htmlFor="location">Город / Регион</label>
            <select
              name="location"
              defaultValue={eventData.location}
              required
              className="mt-1 block w-full rounded-md bg-background"
            >
              {saarlandCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoryId">Категория</label>
            <select
              name="categoryId"
              defaultValue={eventData.eventsToCategories[0]?.categoryId}
              required
              className="mt-1 block w-full rounded-md bg-background"
            >
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Изображение</label>
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <div className="mt-2 p-4 border-2 border-dashed rounded-md">
              {/* --- ИСПРАВЛЕНИЕ --- */}
              <FileUploaderRegular
                pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
                onChange={handleUpload}
                localeName="ru" // <-- Правильное имя свойства
              />
              {/* -------------------- */}
            </div>
            {imageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium">Предпросмотр:</p>
                <Image
                  src={imageUrl}
                  alt="Превью"
                  width={400}
                  height={200}
                  className="mt-2 w-full max-w-sm h-auto rounded-md border object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="date">Дата и время</label>
            <input
              type="datetime-local"
              name="date"
              defaultValue={formatDateForInput(eventData.date)}
              required
              className="mt-1 block w-full rounded-md bg-background"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Сохранить изменения
          </button>
          {state?.message && (
            <p
              className={`mt-2 text-sm ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
