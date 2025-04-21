import { eq, inArray } from "drizzle-orm";
import { data } from "react-router";
import db from "~/db/index.server";
import { coursesTable, studentCoursesTable, studentsTable } from "~/db/schema";
import { isAuthenticated } from "~/lib/auth.server";
import type { Route } from "./+types/resource.student-list.$slug";

export async function loader({ request,params }: Route.LoaderArgs) {
    // load all the courses in the database
    const { session } = await isAuthenticated(request)
    if (!session) {
        return data('Not Allowed', { status: 405 })
    }
    const {slug} = params;
    if(!slug || typeof slug !== "string") {
        return data('Not Allowed', { status: 405 })
    }
    try {
        const [selectedCourse] = await db.select().from(coursesTable).where(eq(coursesTable.slug, slug)).limit(1)
        console.log(selectedCourse)
        const studentsInCourse = await db.select().from(studentCoursesTable).where(eq(studentCoursesTable.courseId, selectedCourse.id))
        const studentIds = studentsInCourse.map((student) => student.studentId)
        const studentsList = await db.select().from(studentsTable).where(inArray(studentsTable.studentId,studentIds ))
    return {  students:studentsList}
    } catch(error){
        console.error(`Error fetching students list:`,error)
        return data('Something went wrong', { status: 500 })
    }
}
