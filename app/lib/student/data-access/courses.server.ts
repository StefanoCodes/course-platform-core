import { and, eq, exists } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable, studentCoursesTable } from "~/db/schema";
import { isStudentLoggedIn } from "~/lib/auth.server";


export async function getCourseBySlug(request: Request, slug: string) {
    const { isLoggedIn, student } = await isStudentLoggedIn(request);
    if (!isLoggedIn || !student) {
        throw redirect("/login");
    }

    try {
        const coursesStudentHasAccessTo = await db
            .select()
            .from(studentCoursesTable)
            .where(eq(studentCoursesTable.studentId, student.id));

        // check if the student has access to the course
        // changed this line of code
        const courseIds = coursesStudentHasAccessTo.map((c) => c.courseId);

        const [course] = await db
            .select()
            .from(coursesTable)
            .where(
                and(
                    eq(coursesTable.slug, slug),
                    eq(coursesTable.isPublic, true),
                    exists(
                        db
                            .select()
                            .from(studentCoursesTable)
                            .where(
                                and(
                                    eq(studentCoursesTable.studentId, student.id),
                                    eq(studentCoursesTable.courseId, coursesTable.id)
                                )
                            )
                    )
                )
            )
            .limit(1);

        return { success: true, course };
    } catch (error) {
        console.error("🔴Error fetching course from database:", error);
        return { success: false, course: null };
    }
}
