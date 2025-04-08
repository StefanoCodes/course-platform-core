import { redirect } from "react-router";
import { isAdminLoggedIn } from "../supabase-utils.server";
import { eq } from "drizzle-orm";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { getCourseBySlug } from "./courses.server";

export async function getAllSegmentsForCourse(request: Request, courseSlug: string) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }

    try {
        // get course id from course slug
        const { course } = await getCourseBySlug(request, courseSlug);
        if (!course) {
            throw redirect("/admin/courses");
        }
        const segments = await db.select().from(segmentsTable).where(eq(segmentsTable.courseId, course.id));
        return { success: true, segments };
    } catch (error) {
        console.error("🔴Error fetching segments from database:", error);
        return { success: false, segments: [] };
    }
}

