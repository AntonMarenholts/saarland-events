// src/db/schema.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  numeric,
  primaryKey,
  uniqueIndex, // <-- Добавляем импорт
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  // ... остальные поля без изменений
  imageUrl: text("image_url"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  organizerName: varchar("organizer_name", { length: 255 }),
  organizerEmail: varchar("organizer_email", { length: 255 }),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
});

export const eventTranslationsTable = pgTable("event_translations", {
  id: serial("id").primaryKey(),
  // Добавляем onDelete: 'cascade', чтобы переводы удалялись вместе с событием
  eventId: integer("event_id").notNull().references(() => eventsTable.id, { onDelete: 'cascade' }),
  locale: varchar("locale", { length: 2 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
}, (table) => {
    return {
        // Это правило говорит, что комбинация eventId и locale должна быть уникальной
        unique_translation: uniqueIndex("unique_translation_idx").on(table.eventId, table.locale),
    };
});

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const eventsToCategoriesTable = pgTable("events_to_categories", {
  // Добавляем onDelete: 'cascade'
  eventId: integer("event_id").notNull().references(() => eventsTable.id, { onDelete: 'cascade' }),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.categoryId] }),
}));

// ... Отношения (relations) остаются без изменений ...
export const eventRelations = relations(eventsTable, ({ many }) => ({
    translations: many(eventTranslationsTable),
    eventsToCategories: many(eventsToCategoriesTable),
}));

export const eventTranslationsRelations = relations(eventTranslationsTable, ({ one }) => ({
    event: one(eventsTable, {
        fields: [eventTranslationsTable.eventId],
        references: [eventsTable.id],
    }),
}));

export const categoryRelations = relations(categoriesTable, ({ many }) => ({
    eventsToCategories: many(eventsToCategoriesTable),
}));

export const eventsToCategoriesRelations = relations(eventsToCategoriesTable, ({ one }) => ({
    event: one(eventsTable, {
        fields: [eventsToCategoriesTable.eventId],
        references: [eventsTable.id],
    }),
    category: one(categoriesTable, {
        fields: [eventsToCategoriesTable.categoryId],
        references: [categoriesTable.id],
    }),
}));

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    image: text("image"),
    role: varchar("role", { length: 50 }).default("customer"),
});