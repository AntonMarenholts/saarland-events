"use client";

import { useLocale } from "next-intl";
// --- ИСПРАВЛЕНИЕ ---
import { usePathname, useRouter } from "@/navigation";
// --------------------
import { ChangeEvent } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    // Удаляем текущий язык из пути, чтобы заменить его на новый
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.replace(newPath);
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="bg-background border border-card-border rounded-md p-2"
    >
      <option value="de">Deutsch</option>
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  );
}