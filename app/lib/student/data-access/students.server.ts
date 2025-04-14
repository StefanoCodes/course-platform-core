// get active status for a student based on their id

import { eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable, studentsTable } from "~/db/schema";
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
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }
    //TODO: get all courses that are public and the student is assigned to
    try {
        const courses = await db.select().from(coursesTable).where(eq(coursesTable.isPublic, true));
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
