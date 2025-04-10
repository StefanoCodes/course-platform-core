import { redirect } from "react-router";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { and, eq } from "drizzle-orm";
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
            throw redirect("/dashboard/courses");
        }
        const segments = await db.select().from(segmentsTable).where(eq(segmentsTable.courseId, course.id));
        return { success: true, segments };
    } catch (error) {
        console.error("🔴Error fetching segments from database:", error);
        return { success: false, segments: [] };
    }
}

// get segment information based on the segment slug 
export async function getSegmentBySlug(request: Request, segmentSlug: string, courseSlug: string) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }

    try {
        // get course id from course slug
        const { course } = await getCourseBySlug(request, courseSlug);
        if (!course) {
            throw redirect("/dashboard/courses");
        }
        // its important to have and here because potentially a user may name a segment the same for multiple videos such as video 1 => course 1 video 1 course 2 this would cause a problem so now we are chcking for both meaning only one will be returned
        const [segment] = await db.select().from(segmentsTable).where(and(eq(segmentsTable.slug, segmentSlug), eq(segmentsTable.courseId, course.id))).limit(1);
        return { success: true, segment };
    } catch (error) {
        console.error("🔴Error fetching segment from database:", error);
        return { success: false, segment: null };
    }
}

