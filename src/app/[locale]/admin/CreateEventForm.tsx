"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import type { OutputCollectionState } from "@uploadcare/react-uploader";

import { createEvent } from "@/app/actions";
import type { categoriesTable } from "@/db/schema";

type Category = typeof categoriesTable.$inferSelect;

interface CreateEventFormProps {
  categories: Category[];
}

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

export default function CreateEventForm({ categories }: CreateEventFormProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = (event: OutputCollectionState) => {
    if (event.successEntries.length > 0) {
      const file = event.successEntries[0];
      if (file.cdnUrl) {
        setImageUrl(file.cdnUrl);
      }
    }
  };

  return (
    <div className="bg-card-background border border-card-border rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Добавить новое событие</h2>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Управлять категориями →
        </Link>
      </div>
      <form action={createEvent} className="space-y-4">
        {/* ...другие поля формы... */}
        <div>
          <label htmlFor="name_de" className="block text-sm font-medium">
            Название (DE)
          </label>
          <input
            type="text"
            id="name_de"
            name="name_de"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-background"
          />
        </div>
        <div>
          <label htmlFor="description_de" className="block text-sm font-medium">
            Описание (DE)
          </label>
          <textarea
            id="description_de"
            name="description_de"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-background"
          ></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Город / Регион
          </label>
          <select
            id="location"
            name="location"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-background"
          >
            {saarlandCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium">
            Категория
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-background"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Дата и время
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-background"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Создать событие
        </button>
      </form>
    </div>
  );
}
