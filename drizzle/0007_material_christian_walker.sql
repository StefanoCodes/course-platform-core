ALTER TABLE "students" DROP CONSTRAINT "students_student_id_unique";--> statement-breakpoint
ALTER TABLE "student_courses" DROP CONSTRAINT "student_courses_student_id_students_student_id_fk";
--> statement-breakpoint
ALTER TABLE "student_courses" ADD CONSTRAINT "student_courses_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;