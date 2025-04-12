import { and, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { isStudentLoggedIn } from "~/lib/supabase-utils.server";

// Get segments for a specific course
export async function getSegmentsByCourseId(request: Request, courseId: string) {
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }

    try {
        const segments = await db.select().from(segmentsTable).where(eq(segmentsTable.courseId, courseId));
        return { success: true, segments };
    } catch (error) {
        console.error("Error fetching segments from database:", error);
        return { success: false, segments: [] };
    }
}

// Get a specific segment by slug
export async function getSegmentBySlug(request: Request, segmentSlug: string, courseId: string) {
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }

    try {
        const [segment] = await db.select().from(segmentsTable)
            .where(and(
                eq(segmentsTable.slug, segmentSlug),
                eq(segmentsTable.courseId, courseId)
            ))
            .limit(1);

        return { success: true, segment };
    } catch (error) {
        console.error("Error fetching segment from database:", error);
        return { success: false, segment: null };
    }
} 