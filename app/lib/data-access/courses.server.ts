import db from "~/db/index.server";
import { coursesTable, studentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "../supabase-utils.server";
import { data, redirect } from "react-router";
import { eq } from "drizzle-orm";
import { count } from "drizzle-orm";

// get all courses
export async function getAllCourses(request: Request) {
    // auth check 
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }
    try {
        const courses = await db.select().from(coursesTable);
        return { success: true, courses };
    } catch (error) {
        console.error("🔴Error fetching courses from database:", error);
        return { success: false, courses: null };
    }
}

// get courses analytics

export async function GetCoursesAnalytics(request: Request) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }
    try {
        const [totalCousesCount] = await db.select({ count: count() }).from(coursesTable)
        const [totalPublicCourses] = await db.select({ count: count() }).from(coursesTable).where(eq(coursesTable.isPublic, true))
        return { success: true, totalCoursesCount: totalCousesCount.count, totalPublicCourses: totalPublicCourses.count, totalPrivateCourses: totalCousesCount.count - totalPublicCourses.count }
    } catch (e) {
        console.error("🔴Error fetching courses from database:", e)
        return { success: false, totalCoursesCount: 0, totalPublicCourses: 0, totalPrivateCourses: 0 }
    }
}
