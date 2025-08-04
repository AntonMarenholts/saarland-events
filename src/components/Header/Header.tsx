"use client";

// --- ИСПРАВЛЕНИЕ ---
import { Link, usePathname, useRouter } from "@/navigation";
// --------------------

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import AuthButton from "@/components/AuthButton/AuthButton";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";


// ... (константы saarlandCities, categories, years, months остаются без изменений)
const saarlandCities = [
  "Ganzes Saarland", "Saarbrücken", "Neunkirchen", "Homburg",
  "Völklingen", "St. Ingbert", "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];
const categories = [
    { id: 1, name: 'Musik' }, { id: 2, name: 'Festival' },
    { id: 3, name: 'Sport' }, { id: 4, name: 'Kultur' },
    { id: 5, name: 'Familie' },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => currentYear + i);
const months = [
    { value: 1, name: 'Январь' }, { value: 2, name: 'Февраль' }, { value: 3, name: 'Март' },
    { value: 4, name: 'Апрель' }, { value: 5, name: 'Май' }, { value: 6, name: 'Июнь' },
    { value: 7, name: 'Июль' }, { value: 8, name: 'Август' }, { value: 9, name: 'Сентябрь' },
    { value: 10, name: 'Октябрь' }, { value: 11, name: 'Ноябрь' }, { value: 12, name: 'Декабрь' },
];


export default function Header() {
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: 'city' | 'category' | 'year' | 'month', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'all') {
      current.delete(type);
    } else {
      current.set(type, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    // useRouter от next-intl/navigation сам позаботится о сохранении языка
    router.push(`${pathname}${query}`);
  };

  return (
    <header className="bg-card-background border-b border-card-border p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
        <Link href="/" className="font-bold text-xl">
          Афиша Саарланда
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <select 
            onChange={(e) => handleFilterChange('city', e.target.value)}
            value={searchParams.get('city') || 'Ganzes Saarland'}
            className="bg-background border border-card-border rounded-md p-2"
          >
            {saarlandCities.map((city) => (<option key={city} value={city}>{city}</option>))}
          </select>

          <select 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            value={searchParams.get('category') || 'all'}
            className="bg-background border border-card-border rounded-md p-2"
          >
            <option value="all">{t('all_categories')}</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>

          <select 
            onChange={(e) => handleFilterChange('year', e.target.value)}
            value={searchParams.get('year') || 'all'}
            className="bg-background border border-card-border rounded-md p-2"
          >
            <option value="all">{t('all_years')}</option>
            {years.map((year) => (<option key={year} value={year}>{year}</option>))}
          </select>

          <select 
            onChange={(e) => handleFilterChange('month', e.target.value)}
            value={searchParams.get('month') || 'all'}
            className="bg-background border border-card-border rounded-md p-2"
          >
            <option value="all">{t('all_months')}</option>
            {months.map((month) => (<option key={month.value} value={month.value}>{month.name}</option>))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}