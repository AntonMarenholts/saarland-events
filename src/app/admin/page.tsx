import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// Убедимся, что путь к файлу authOptions правильный. 
// Если вы создавали его по нашей старой структуре, он должен быть здесь:


export default async function AdminDashboard() {
  // Теперь этот код активен
  const session = await getServerSession(authOptions);

  // Если пользователя нет ИЛИ его роль не 'admin', перенаправляем на главную страницу
  // ВАЖНО: Мы скоро сделаем вас админом.
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <section className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      
      <div className="bg-card-background border border-card-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Добро пожаловать, {session?.user?.name}!</h2>
        <p>Здесь вы сможете добавлять, редактировать и управлять событиями.</p>
        {/* Скоро здесь появится форма для добавления событий */}
      </div>
    </section>
  );
}