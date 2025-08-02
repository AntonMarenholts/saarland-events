// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { createEvent } from "./actions";
import { db } from "@/db";
import DeleteEventButton from "@/components/DeleteEventButton";
import AuthButton from "@/components/AuthButton/AuthButton"; // <-- 1. ДОБАВЛЯЕМ ИМПОРТ

const saarlandCities = [
    "Ganzes Saarland", "Saarbrücken", "Neunkirchen", "Homburg",
    "Völklingen", "St. Ingbert", "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        redirect("/");
    }

    const categories = await db.query.categoriesTable.findMany();
    const allEvents = await db.query.eventsTable.findMany({
        with: {
            translations: { where: (translations, { eq }) => eq(translations.locale, 'de') },
        },
        orderBy: (events, { desc }) => [desc(events.date)],
    });

    return (
        <section className="container mx-auto py-8 px-4">
            {/* --- НАЧАЛО ИЗМЕНЕНИЙ --- */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Панель администратора</h1>
              <AuthButton /> {/* <-- 2. ДОБАВЛЯЕМ КНОПКУ СЮДА */}
            </div>
            {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
            
            <div className="bg-card-background border border-card-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Добавить новое событие</h2>
                <form action={createEvent} className="space-y-4">
                    {/* ... все поля формы остаются здесь ... */}
                    <div><label htmlFor="name_de" className="block text-sm font-medium">Название (DE)</label><input type="text" id="name_de" name="name_de" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background" /></div>
                    <div><label htmlFor="description_de" className="block text-sm font-medium">Описание (DE)</label><textarea id="description_de" name="description_de" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"></textarea></div>
                    <div><label htmlFor="location" className="block text-sm font-medium">Город / Регион</label><select id="location" name="location" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background">{saarlandCities.map((city) => (<option key={city} value={city}>{city}</option>))}</select></div>
                    <div><label htmlFor="categoryId" className="block text-sm font-medium">Категория</label><select id="categoryId" name="categoryId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background">{categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}</select></div>
                    <div><label htmlFor="date" className="block text-sm font-medium">Дата и время</label><input type="datetime-local" id="date" name="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background" /></div>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Создать событие</button>
                </form>
            </div>

            <div className="bg-card-background border border-card-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Все события</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Город</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Действия</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                            {allEvents.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{event.translations[0]?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{event.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(event.date).toLocaleDateString('de-DE')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href={`/admin/edit/${event.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Редактировать</a>
                                        <DeleteEventButton eventId={event.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}