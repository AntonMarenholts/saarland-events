import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Link } from "@/navigation";
import BackButton from "@/components/BackButton/BackButton";

// Эта функция будет загружать данные для конкретного события
async function getEventData(eventId: number) {
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, eventId),
    with: {
      translations: true,
      eventsToCategories: {
        with: {
          category: true,
        },
      },
    },
  });
  return event;
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = Number(params.id);
  const event = await getEventData(eventId);

    if (!event) {
    return (
      <div className="container mx-auto text-center py-12">
        <h1 className="text-2xl font-bold">Событие не найдено</h1>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  // Найдем переводы для удобства
  const nameDe = event.translations.find(t => t.locale === 'de')?.name;
  const descDe = event.translations.find(t => t.locale === 'de')?.description;
  const nameEn = event.translations.find(t => t.locale === 'en')?.name;
  const descEn = event.translations.find(t => t.locale === 'en')?.description;
  const nameRu = event.translations.find(t => t.locale === 'ru')?.name;
  const descRu = event.translations.find(t => t.locale === 'ru')?.description;
  
  const categoryName = event.eventsToCategories[0]?.category.name;

  return (
    <div className="container mx-auto py-8 px-4">
      <BackButton />
      <article className="bg-card-background border border-card-border rounded-lg overflow-hidden shadow-lg">
        {event.imageUrl && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={event.imageUrl}
              alt={nameDe || "Event Image"}
              fill
              style={{ objectFit: 'cover' }}
              priority // Говорим Next.js загрузить это изображение в первую очередь
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          {/* Название на немецком */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{nameDe}</h1>
          
          {/* Блок с мета-информацией */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 mb-6">
            <p><strong>Город:</strong> {event.location}</p>
            <p><strong>Дата:</strong> {new Date(event.date).toLocaleString('de-DE')}</p>
            {categoryName && <p><strong>Категория:</strong> {categoryName}</p>}
          </div>

          {/* Полное описание на немецком */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p>{descDe}</p>
          </div>

          {/* Переводы, если они есть */}
          {(nameRu || nameEn) && (
            <div className="border-t border-card-border pt-6">
              <h2 className="text-2xl font-bold mb-4">Übersetzungen / Translations / Переводы</h2>
              {/* Русский перевод */}
              {nameRu && (
                <details className="mb-4">
                  <summary className="font-semibold cursor-pointer">Русский</summary>
                  <div className="prose dark:prose-invert max-w-none mt-2 pl-4 border-l-2">
                      <h3 className="text-xl font-bold">{nameRu}</h3>
                      <p>{descRu}</p>
                  </div>
                </details>
              )}
              {/* Английский перевод */}
              {nameEn && (
                <details>
                  <summary className="font-semibold cursor-pointer">English</summary>
                  <div className="prose dark:prose-invert max-w-none mt-2 pl-4 border-l-2">
                      <h3 className="text-xl font-bold">{nameEn}</h3>
                      <p>{descEn}</p>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}