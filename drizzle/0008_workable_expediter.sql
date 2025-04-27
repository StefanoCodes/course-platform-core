ALTER TABLE "segments" DROP CONSTRAINT "segments_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "student_courses" DROP CONSTRAINT "student_courses_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_course_unique" UNIQUE("student_id","course_id");