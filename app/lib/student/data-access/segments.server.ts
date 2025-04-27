import { and, asc, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { isStudentLoggedIn } from "~/lib/auth/auth.server";

export async function getSegmentsByCourseId(
	request: Request,
	courseId: string,
) {
	const { isLoggedIn } = await isStudentLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/login");
	}

	try {
		const segments = await db
			.select()
			.from(segmentsTable)
			.where(
				and(
					eq(segmentsTable.courseId, courseId),
					eq(segmentsTable.isPublic, true),
				),
			)
			.orderBy(asc(segmentsTable.created_at));
		return { success: true, segments };
	} catch (error) {
		console.error("Error fetching segments from database:", error);
		return { success: false, segments: [] };
	}
}

export async function getSegmentBySlug(
	request: Request,
	segmentSlug: string,
	courseId: string,
) {
	const { isLoggedIn } = await isStudentLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/login");
	}

	try {
		const [segment] = await db
			.select()
			.from(segmentsTable)
			.where(
				and(
					eq(segmentsTable.slug, segmentSlug),
					eq(segmentsTable.courseId, courseId),
				),
			)
			.limit(1);

		return { success: true, segment };
	} catch (error) {
		console.error("Error fetching segment from database:", error);
		return { success: false, segment: null };
	}
}
