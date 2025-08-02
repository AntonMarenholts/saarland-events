CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "event_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"locale" varchar(2) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "events_to_categories" (
	"event_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "sports" CASCADE;--> statement-breakpoint
DROP TABLE "todos" CASCADE;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "organizer_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "organizer_email" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "latitude" numeric;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "longitude" numeric;--> statement-breakpoint
ALTER TABLE "event_translations" ADD CONSTRAINT "event_translations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "description";