"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    imageUrl: "",
    organizerName: "",
    organizerEmail: "",
    
    name_en: "",
    description_en: "",
    name_de: "",
    description_de: "",
    name_ukr: "",
    description_ukr: "",
    name_ru: "",
    description_ru: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка при создании события.");
      }

      setSuccess("Событие успешно отправлено на модерацию!");
      setFormData({
        location: "",
        date: "",
        imageUrl: "",
        organizerName: "",
        organizerEmail: "",
        name_en: "",
        description_en: "",
        name_de: "",
        description_de: "",
        name_ukr: "",
        description_ukr: "",
        name_ru: "",
        description_ru: "",
      });
      
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Место проведения:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Дата и время:
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL изображения:
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <h3 className="text-xl font-semibold mt-6">Переводы</h3>
      <p className="text-sm text-gray-500">
        Укажите название и описание на всех поддерживаемых языках.
      </p>

      {/* English */}
      <div>
        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">
          Название (EN):
        </label>
        <input type="text" id="name_en" name="name_en" value={formData.name_en} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
          Описание (EN):
        </label>
        <textarea id="description_en" name="description_en" value={formData.description_en} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* German */}
      <div>
        <label htmlFor="name_de" className="block text-sm font-medium text-gray-700">
          Название (DE):
        </label>
        <input type="text" id="name_de" name="name_de" value={formData.name_de} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_de" className="block text-sm font-medium text-gray-700">
          Описание (DE):
        </label>
        <textarea id="description_de" name="description_de" value={formData.description_de} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Ukrainian */}
      <div>
        <label htmlFor="name_ukr" className="block text-sm font-medium text-gray-700">
          Название (UKR):
        </label>
        <input type="text" id="name_ukr" name="name_ukr" value={formData.name_ukr} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_ukr" className="block text-sm font-medium text-gray-700">
          Описание (UKR):
        </label>
        <textarea id="description_ukr" name="description_ukr" value={formData.description_ukr} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Russian */}
      <div>
        <label htmlFor="name_ru" className="block text-sm font-medium text-gray-700">
          Название (RU):
        </label>
        <input type="text" id="name_ru" name="name_ru" value={formData.name_ru} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700">
          Описание (RU):
        </label>
        <textarea id="description_ru" name="description_ru" value={formData.description_ru} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Organizer info */}
      <h3 className="text-xl font-semibold mt-6">Контакты организатора</h3>
      <div>
        <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700">
          Имя:
        </label>
        <input type="text" id="organizerName" name="organizerName" value={formData.organizerName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input type="email" id="organizerEmail" name="organizerEmail" value={formData.organizerEmail} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isSubmitting ? "Отправка..." : "Добавить событие"}
      </button>
    </form>
  );
}