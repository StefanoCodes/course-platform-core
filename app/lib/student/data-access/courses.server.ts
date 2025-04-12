import { isAuthenticated } from "~/lib/supabase-utils.server";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable } from "~/db/schema";
import { eq } from "drizzle-orm";
export async function getCourseBySlug(request: Request, slug: string) {

    const { isLoggedIn } = await isAuthenticated(request)
    if (!isLoggedIn) {
        throw redirect("/login")
    }

    try {
        const [course] = await db.select().from(coursesTable).where(eq(coursesTable.slug, slug)).limit(1);
        return { success: true, course };
    } catch (error) {
        console.error("🔴Error fetching course from database:", error);
        return { success: false, course: null };
    }
}