// src/components/DeleteCategoryButton.tsx
"use client";

import { deleteCategory } from "@/app/actions";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: number;
}) {
  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      const result = await deleteCategory(categoryId);
      if (!result.success) {
        alert(result.message); // Показываем сообщение об ошибке, если оно есть
      }
      // Если удаление успешно, страница перезагрузится автоматически благодаря revalidatePath
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
      Удалить
    </button>
  );
}
