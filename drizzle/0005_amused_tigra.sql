ALTER TABLE "courses" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "segments" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX "course_slug_index" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "segment_slug_index" ON "segments" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_slug_unique" UNIQUE("slug");