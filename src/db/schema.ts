
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";


export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});


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
    role: varchar("role",{length:50}).default("customer"),
  })
  
  export const todos = pgTable("todos", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull().references(()=>users.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  })