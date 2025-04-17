ALTER TABLE "student_courses" DROP CONSTRAINT "student_courses_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "student_courses" ALTER COLUMN "student_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;