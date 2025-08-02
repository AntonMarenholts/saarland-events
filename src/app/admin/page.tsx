// src/app/admin/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { createEvent } from "./actions";
import { db } from "@/db"; // Импортируем доступ к базе

// Список городов для нашего селекта
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

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Получаем категории прямо из базы данных на сервере
  const categories = await db.query.categoriesTable.findMany();

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

      <div className="bg-card-background border border-card-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Добро пожаловать, {session?.user?.name}!
        </h2>
      </div>

      <div className="bg-card-background border border-card-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Добавить новое событие</h2>
        <form action={createEvent} className="space-y-4">
          {/* Название */}
          <div>
            <label htmlFor="name_de" className="block text-sm font-medium">
              Название (DE)
            </label>
            <input
              type="text"
              id="name_de"
              name="name_de"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
            />
          </div>
          {/* Описание */}
          <div>
            <label
              htmlFor="description_de"
              className="block text-sm font-medium"
            >
              Описание (DE)
            </label>
            <textarea
              id="description_de"
              name="description_de"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
            ></textarea>
          </div>

          {/* НОВЫЙ БЛОК: Выбор города */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Город / Регион
            </label>
            <select
              id="location"
              name="location"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
            >
              {saarlandCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* НОВЫЙ БЛОК: Выбор категории */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium">
              Категория
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Дата */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Дата и время
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Создать событие
          </button>
        </form>
      </div>
    </section>
  );
}
