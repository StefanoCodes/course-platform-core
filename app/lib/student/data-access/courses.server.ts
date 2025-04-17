import { and, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable } from "~/db/schema";
import { isStudentLoggedIn } from "~/lib/auth.server";
export async function getCourseBySlug(request: Request, slug: string) {

    const { isLoggedIn } = await isStudentLoggedIn(request)
    if (!isLoggedIn) {
        throw redirect("/login")
    }

    try {
        const [course] = await db.select().from(coursesTable).where(and(eq(coursesTable.slug, slug), eq(coursesTable.isPublic, true))).limit(1);
        return { success: true, course };
    } catch (error) {
        console.error("🔴Error fetching course from database:", error);
        return { success: false, course: null };
    }
}