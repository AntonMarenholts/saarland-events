import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
  
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  organizerName: varchar("organizer_name", { length: 255 }),
  organizerEmail: varchar("organizer_email", { length: 255 }),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
});

export const eventTranslationsTable = pgTable("event_translations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  locale: varchar("locale", { length: 2 }).notNull(), // 'en', 'ru'
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
});

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const eventsToCategoriesTable = pgTable("events_to_categories", {
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
});


export const eventRelations = relations(eventsTable, ({ many }) => ({
  translations: many(eventTranslationsTable),
  eventsToCategories: many(eventsToCategoriesTable),
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


export const sportsTable = pgTable("sports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("customer"),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});