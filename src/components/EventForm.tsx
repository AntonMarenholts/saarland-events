"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "en" | "de" | "ukr" | "ru";
type TranslationFunction = (key: string) => string;

export default function EventForm({ t, locale }: { t: TranslationFunction, locale: Locale }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    imageUrl: "",
    organizerName: "",
    organizerEmail: "",
    // Translations for different languages
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    setError(null);

    const languages = ["de", "ukr", "ru"];
    const baseTextName = formData.name_en;
    const baseTextDescription = formData.description_en;

    if (!baseTextName && !baseTextDescription) {
      setError(t("translationError"));
      setIsTranslating(false);
      return;
    }

    try {
      let backoff = 1000;
      for (const lang of languages) {
        // Translate Name
        if (baseTextName && !formData[`name_${lang}` as keyof typeof formData]) {
          const prompt = `Translate the following event name into ${lang} and return only the translated text: ${baseTextName}`;
          let nameTranslation = '';
          while (!nameTranslation) {
            try {
              const payload = {
                  contents: [{ role: "user", parts: [{ text: prompt }] }],
              };
              const apiKey = "";
              const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
              const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
              const result = await response.json();
              if (result.candidates && result.candidates.length > 0) {
                nameTranslation = result.candidates[0].content.parts[0].text;
              }
            } catch (e) {
              await new Promise(resolve => setTimeout(resolve, backoff));
              backoff *= 2;
            }
          }
          setFormData((prevData) => ({
            ...prevData,
            [`name_${lang}`]: nameTranslation,
          }));
        }

        // Translate Description
        if (baseTextDescription && !formData[`description_${lang}` as keyof typeof formData]) {
          const prompt = `Translate the following event description into ${lang} and return only the translated text: ${baseTextDescription}`;
          let descriptionTranslation = '';
          while (!descriptionTranslation) {
            try {
              const payload = {
                  contents: [{ role: "user", parts: [{ text: prompt }] }],
              };
              const apiKey = "";
              const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
              const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
              const result = await response.json();
              if (result.candidates && result.candidates.length > 0) {
                descriptionTranslation = result.candidates[0].content.parts[0].text;
              }
            } catch (e) {
              await new Promise(resolve => setTimeout(resolve, backoff));
              backoff *= 2;
            }
          }
          setFormData((prevData) => ({
            ...prevData,
            [`description_${lang}`]: descriptionTranslation,
          }));
        }
      }
      setSuccess(t("translationSuccess"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("translationErrorGeneric"));
      }
    } finally {
      setIsTranslating(false);
    }
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
        throw new Error(errorData.error || t("submitError"));
      }

      setSuccess(t("submitSuccess"));
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
        setError(t("submitErrorGeneric"));
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
          {t("locationLabel")}
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
          {t("dateLabel")}
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
          {t("imageUrlLabel")}
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

      <h3 className="text-xl font-semibold mt-6">{t("translationsTitle")}</h3>
      <p className="text-sm text-gray-500">
        {t("translationInstruction")}
      </p>

      {/* English */}
      <div>
        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">
          {t("eventNameLabel_en")}
        </label>
        <input type="text" id="name_en" name="name_en" value={formData.name_en} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
          {t("eventDescriptionLabel_en")}
        </label>
        <textarea id="description_en" name="description_en" value={formData.description_en} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      
      <button
        type="button"
        onClick={handleAutoTranslate}
        disabled={isTranslating}
        className={`w-full px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
          isTranslating ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {isTranslating ? t("translatingButton") : t("autoTranslateButton")}
      </button>

      {/* German */}
      <div className="mt-6">
        <label htmlFor="name_de" className="block text-sm font-medium text-gray-700">
          {t("eventNameLabel_de")}
        </label>
        <input type="text" id="name_de" name="name_de" value={formData.name_de} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_de" className="block text-sm font-medium text-gray-700">
          {t("eventDescriptionLabel_de")}
        </label>
        <textarea id="description_de" name="description_de" value={formData.description_de} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Ukrainian */}
      <div>
        <label htmlFor="name_ukr" className="block text-sm font-medium text-gray-700">
          {t("eventNameLabel_ukr")}
        </label>
        <input type="text" id="name_ukr" name="name_ukr" value={formData.name_ukr} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_ukr" className="block text-sm font-medium text-gray-700">
          {t("eventDescriptionLabel_ukr")}
        </label>
        <textarea id="description_ukr" name="description_ukr" value={formData.description_ukr} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Russian */}
      <div>
        <label htmlFor="name_ru" className="block text-sm font-medium text-gray-700">
          {t("eventNameLabel_ru")}
        </label>
        <input type="text" id="name_ru" name="name_ru" value={formData.name_ru} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700">
          {t("eventDescriptionLabel_ru")}
        </label>
        <textarea id="description_ru" name="description_ru" value={formData.description_ru} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>

      {/* Organizer info */}
      <h3 className="text-xl font-semibold mt-6">{t("organizerTitle")}</h3>
      <div>
        <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700">
          {t("organizerNameLabel")}
        </label>
        <input type="text" id="organizerName" name="organizerName" value={formData.organizerName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700">
          {t("organizerEmailLabel")}
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
        {isSubmitting ? t("submittingButton") : t("submitButton")}
      </button>
    </form>
  );
}
