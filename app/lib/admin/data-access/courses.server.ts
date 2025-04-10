import db from "~/db/index.server";
import { coursesTable, studentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { data, redirect } from "react-router";
import { desc, eq } from "drizzle-orm";
import { count } from "drizzle-orm";

// get all courses
export async function getAllCourses(request: Request) {
    // auth check 
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }
    try {
        const courses = await db.select().from(coursesTable).orderBy(desc(coursesTable.created_at));
        return { success: true, courses };
    } catch (error) {
        console.error("🔴Error fetching courses from database:", error);
        return { success: false, courses: null };
    }
}

// get course by slug
export async function getCourseBySlug(request: Request, slug: string) {
    // auth check 
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }
    try {
        const [course] = await db.select().from(coursesTable).where(eq(coursesTable.slug, slug)).limit(1);
        return { success: true, course };
    } catch (error) {
        console.error("🔴Error fetching course from database:", error);
        return { success: false, course: null };
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
