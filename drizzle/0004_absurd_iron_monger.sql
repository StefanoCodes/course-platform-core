CREATE TABLE "student_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_course_student_id_index" ON "student_courses" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_course_course_id_index" ON "student_courses" USING btree ("course_id");