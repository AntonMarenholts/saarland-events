import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Страница не найдена</h2>
      <p className="text-gray-500 mt-2">К сожалению, мы не смогли найти эту страницу.</p>
      <Link href="/" className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        Вернуться на главную
      </Link>
    </div>
  );
}
