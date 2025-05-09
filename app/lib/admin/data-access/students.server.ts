import { and, count, desc, eq, inArray } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable, studentCoursesTable, studentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";

export async function GetAllStudents(request: Request) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	try {
		const students = await db
			.select()
			.from(studentsTable)
			.orderBy(desc(studentsTable.createdAt));
		return { success: true, students };
	} catch (e) {
		console.error("🔴Error fetching students from database:", e);
		return { success: false, students: [] };
	}
}
export async function GetStudentsAnalytics(request: Request) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	try {
		const [totalStudentsCount] = await db
			.select({ count: count() })
			.from(studentsTable);
		const [activeStudentsCount] = await db
			.select({ count: count() })
			.from(studentsTable)
			.where(eq(studentsTable.isActivated, true));
		return {
			success: true,
			totalStudentsCount: totalStudentsCount.count,
			activeStudentsCount: activeStudentsCount.count,
			inactiveStudentsCount:
				totalStudentsCount.count - activeStudentsCount.count,
		};
	} catch (e) {
		console.error("🔴Error fetching students from database:", e);
		return {
			success: false,
			totalStudentsCount: 0,
			activeStudentsCount: 0,
			inactiveStudentsCount: 0,
		};
	}
}
export async function GetStudentById(request: Request, studentId: string) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	try {
		const [student] = await db
			.select()
			.from(studentsTable)
			.where(eq(studentsTable.studentId, studentId))
			.limit(1);
		return { success: true, student };
	} catch (e) {
		console.error("🔴Error fetching student from database:", e);
		return { success: false, student: null };
	}
}
export async function getCoursesStudentEnrolledIn(
	request: Request,
	studentId: string,
) {
	// auth check
	const { isLoggedIn, admin } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/login");
	}
	if (!admin) {
		console.error("Student not found");
		return { courses: [] };
	}
	try {
		const studentCourses = await db
			.select()
			.from(studentCoursesTable)
			.where(eq(studentCoursesTable.studentId, studentId));
		// find all the courses that the student is assigned to
		const courses = await db
			.select()
			.from(coursesTable)
			.where(
				and(
					eq(coursesTable.isPublic, true),
					inArray(
						coursesTable.id,
						studentCourses.map((course) => course.courseId),
					),
				),
			);

		return { courses };
	} catch (error) {
		console.error(
			`Error fetching student courses: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return { courses: [] };
	}
}
