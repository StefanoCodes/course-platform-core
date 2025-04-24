import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable, studentCoursesTable, studentsTable } from "~/db/schema";
import { isStudentLoggedIn } from "~/lib/auth.server";

export async function isStudentAccountActivated(email: string) {
    // get active status for a student based on their id
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.email, email));
    // incase the admin ends up here the student will be undefined so we just return false if thats the case
    if (!student) return {
        isStudentActivated: false,
    }
    return {
        isStudentActivated: student.isActivated,
    }
}

export async function getStudentCourses(request: Request) {
    // auth check
    const { isLoggedIn, student } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }
    if (!student) {
        console.error('Student not found');
        return { courses: [] };
    }
    try {
        const studentCourses = await db.select().from(studentCoursesTable).where(eq(studentCoursesTable.studentId, student.id));
        // find all the courses that the student is assigned to
        const courses = await db.select().from(coursesTable).where(and(eq(coursesTable.isPublic, true), inArray(coursesTable.id, studentCourses.map(course => course.courseId))));

        return { courses };
    } catch (error) {
        console.error(`Error fetching student courses: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { courses: [] };
    }
}

export async function getStudentById(request: Request, studentId: string) {
    // auth check
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }
    // get student by id
    try {
        const [student] = await db.select().from(studentsTable).where(eq(studentsTable.studentId, studentId));
        return { student };
    } catch (error) {
        console.error(`Error fetching student by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { student: null };
    }
}
