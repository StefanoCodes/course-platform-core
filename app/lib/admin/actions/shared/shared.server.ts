import { and, eq } from "drizzle-orm";
import db from "~/db/index.server";
import { coursesTable, segmentsTable } from "~/db/schema";


export async function checkCourseSlugUnique(slug: string) {
	const [course] = await db
		.select()
		.from(coursesTable)
		.where(eq(coursesTable.slug, slug));
	return course ? false : true;
}

// For checking segment slug uniqueness within a course
export async function checkSegmentSlugUnique(slug: string, courseId: string) {
	const [segment] = await db
		.select()
		.from(segmentsTable)
		.where(
			and(
				eq(segmentsTable.slug, slug),
				eq(segmentsTable.courseId, courseId)
			)
		);
	return segment ? false : true;
}