// import {notFound} from 'next/navigation';
// import {getRequestConfig} from 'next-intl/server';

// const locales = ['en', 'de', 'ru'] as const;
// type Locale = typeof locales[number];

// function isValidLocale(locale: unknown): locale is Locale {
//   return locales.some((l) => l === locale);
// }

// export default getRequestConfig(async ({locale}) => {
  
//   if (!isValidLocale(locale)) {
//     notFound();
//   }

//   return {
//     locale,
//     messages: (await import(`./messages/${locale}.json`)).default
//   };
// });

import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 1. Определяем локали как константу для строгой типизации
const locales = ['en', 'de', 'ru'] as const;

// 2. Создаем конкретный тип на основе массива локалей
type Locale = typeof locales[number];

// 3. Создаем "проверку типа" (type guard). 
// ИСПРАВЛЕНИЕ: Заменяем `any` на более конкретный тип `string | undefined`
function isValidLocale(locale: string | undefined): locale is Locale {
  // `locale` может быть undefined, поэтому `includes` может выдать ошибку.
  // Проверяем, что locale существует, прежде чем использовать includes.
  if (!locale) return false;
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({locale}) => {
  // 4. Используем нашу проверку.
  if (!isValidLocale(locale)) {
    notFound();
  }

  // 5. Теперь TypeScript на 100% уверен, что `locale` имеет тип
  // 'en' | 'de' | 'ru', а не `string | undefined`. Ошибка исчезнет.
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
