import { eq } from "drizzle-orm";
import db from "~/db/index.server";
import { coursesTable, segmentsTable } from "~/db/schema";

export async function checkSlugUnique(
	slug: string,
	table: typeof coursesTable | typeof segmentsTable,
) {
	const [course] = await db.select().from(table).where(eq(table.slug, slug));
	return course ? false : true;
}
