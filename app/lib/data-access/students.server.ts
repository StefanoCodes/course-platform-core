import { redirect } from "react-router";
import db from "~/db/index.server";
import { studentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";

export async function GetAllStudents(request: Request) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) throw redirect("/admin/login")
    try {
        const students = await db.select().from(studentsTable)
        return { success: true, students }
    } catch (e) {
        console.error("🔴Error fetching students from database:", e)
        return { success: false, students: [] }
    }
}