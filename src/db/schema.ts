import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});
