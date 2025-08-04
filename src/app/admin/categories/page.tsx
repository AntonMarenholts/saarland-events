// src/app/admin/categories/page.tsx
import Link from "next/link";
import { createCategory, getAllCategories } from "../actions";
import DeleteCategoryButton from "@/components/DeleteCategoryButton";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6 gap-4">
        <Link href="/admin" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-3xl font-bold">Управление категориями</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Форма добавления */}
        <div className="md:col-span-1">
          <div className="bg-card-background border border-card-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Добавить категорию</h2>
            <form action={createCategory} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Название</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md bg-background" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium">Описание</label>
                <textarea id="description" name="description" rows={3} className="mt-1 block w-full rounded-md bg-background"></textarea>
              </div>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Создать
              </button>
            </form>
          </div>
        </div>

        {/* Список категорий */}
        <div className="md:col-span-2">
          <div className="bg-card-background border border-card-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Все категории</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Описание</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Действия</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{cat.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Редактирование добавим позже */}
                        {/* <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Редактировать</a> */}
                        <DeleteCategoryButton categoryId={cat.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}