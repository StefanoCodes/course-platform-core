import db from "~/db/index.server";
import { coursesTable } from "~/db/schema";
import { isAdminLoggedIn } from "../supabase-utils.server";
import { data, redirect } from "react-router";

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
