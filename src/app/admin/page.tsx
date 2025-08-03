// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/db";
import DeleteEventButton from "@/components/DeleteEventButton";
import AuthButton from "@/components/AuthButton/AuthButton";
import CreateEventForm from "./CreateEventForm"; // <-- Импортируем нашу новую форму

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        redirect("/");
    }

    // Снова загружаем данные на сервере, как и должно быть
    const categories = await db.query.categoriesTable.findMany();
    const allEvents = await db.query.eventsTable.findMany({
        with: {
            translations: { where: (translations, { eq }) => eq(translations.locale, 'de') },
        },
        orderBy: (events, { desc }) => [desc(events.date)],
    });

    return (
        <section className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Панель администратора</h1>
              <AuthButton />
            </div>
            
            {/* Используем наш новый клиентский компонент и передаем ему категории */}
            <CreateEventForm categories={categories} />

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