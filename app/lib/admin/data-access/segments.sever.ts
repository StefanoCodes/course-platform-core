import { and, asc, desc, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { getCourseBySlug } from "./courses.server";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";

export async function getAllSegmentsForCourse(
	request: Request,
	courseSlug: string,
) {
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
		const segments = await db
			.select()
			.from(segmentsTable)
			.where(eq(segmentsTable.courseId, course.id))
			.orderBy(asc(segmentsTable.created_at));
		return { success: true, segments };
	} catch (error) {
		console.error("🔴Error fetching segments from database:", error);
		return { success: false, segments: [] };
	}
}
export async function getSegmentBySlug(
	request: Request,
	segmentSlug: string,
	courseSlug: string,
) {
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
		const [segment] = await db
			.select()
			.from(segmentsTable)
			.where(
				and(
					eq(segmentsTable.slug, segmentSlug),
					eq(segmentsTable.courseId, course.id),
				),
			)
			.limit(1);
		return { success: true, segment };
	} catch (error) {
		console.error("🔴Error fetching segment from database:", error);
		return { success: false, segment: null };
	}
}
