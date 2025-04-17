import { data } from "react-router";
import { isAuthenticated } from "~/lib/auth.server";
import { eq } from "drizzle-orm";
import type { Route } from "./+types/resource.student-courses";
import db from "~/db/index.server";
import { coursesTable } from "~/db/schema";
export async function loader({ request }: Route.LoaderArgs) {
    // load all the courses in the database
    const { session } = await isAuthenticated(request)
    if (!session) {
        return data('Not Allowed', { status: 405 })
    }
    const courses = await db.select().from(coursesTable).where(eq(coursesTable.isPublic, true))
    if (!courses) {
        return { courses: [] }
    }
    return { courses }
}
