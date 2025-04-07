import { count, desc, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { studentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";

export async function GetAllStudents(request: Request) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) throw redirect("/admin/login")
    try {
        const students = await db.select().from(studentsTable).orderBy(desc(studentsTable.created_at))
        return { success: true, students }
    } catch (e) {
        console.error("🔴Error fetching students from database:", e)
        return { success: false, students: [] }
    }
}
export async function GetStudentsAnalytics(request: Request) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) throw redirect("/admin/login")
    try {
        const [totalStudentsCount] = await db.select({ count: count() }).from(studentsTable)
        const [activeStudentsCount] = await db.select({ count: count() }).from(studentsTable).where(eq(studentsTable.isActivated, true))
        return { success: true, totalStudentsCount: totalStudentsCount.count, activeStudentsCount: activeStudentsCount.count, inactiveStudentsCount: totalStudentsCount.count - activeStudentsCount.count }
    } catch (e) {
        console.error("🔴Error fetching students from database:", e)
        return { success: false, totalStudentsCount: 0, activeStudentsCount: 0 }
    }
}
export async function GetStudentById(request: Request, studentId: string) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) throw redirect("/admin/login")
    try {
        const [student] = await db.select().from(studentsTable).where(eq(studentsTable.studentId, studentId)).limit(1)
        return { success: true, student }
    } catch (e) {
        console.error("🔴Error fetching student from database:", e)
        return { success: false, student: null }
    }
}



