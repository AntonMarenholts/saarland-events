// src/components/Header/Header.tsx
"use client"; // Превращаем в клиентский компонент

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AuthButton from "@/components/AuthButton/AuthButton";

// Тот же список, что и в админ-панели
const saarlandCities = [
  "Ganzes Saarland", "Saarbrücken", "Neunkirchen", "Homburg",
  "Völklingen", "St. Ingbert", "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];

// Для примера, в будущем будем загружать с сервера
const categories = [
    { id: 1, name: 'Musik' },
    { id: 2, name: 'Festival' },
    { id: 3, name: 'Sport' },
    { id: 4, name: 'Kultur' },
    { id: 5, name: 'Familie' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: 'city' | 'category', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || (type === 'city' && value === 'Ganzes Saarland') || (type === 'category' && value === 'Alle')) {
      current.delete(type);
    } else {
      current.set(type, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <header className="bg-card-background border-b border-card-border p-4">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
        <Link href="/" className="font-bold text-xl">
          Афиша Саарланда
        </Link>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Фильтр по городам */}
          <select 
            onChange={(e) => handleFilterChange('city', e.target.value)}
            defaultValue={searchParams.get('city') || ''}
            className="bg-background border border-card-border rounded-md p-2"
          >
            {saarlandCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Фильтр по категориям */}
          <select 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            defaultValue={searchParams.get('category') || ''}
            className="bg-background border border-card-border rounded-md p-2"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}