ALTER TABLE "event_translations" DROP CONSTRAINT "event_translations_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "events_to_categories" DROP CONSTRAINT "events_to_categories_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "events_to_categories" DROP CONSTRAINT "events_to_categories_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_event_id_category_id_pk" PRIMARY KEY("event_id","category_id");--> statement-breakpoint
ALTER TABLE "event_translations" ADD CONSTRAINT "event_translations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_to_categories" ADD CONSTRAINT "events_to_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_translation_idx" ON "event_translations" USING btree ("event_id","locale");