import { data } from "react-router";
import { isAuthenticated } from "~/lib/auth/auth.server";
import type { Route } from "./+types/resource.students-all";
import db from "~/db/index.server";
import { studentsTable } from "~/db/schema";
import { desc } from "drizzle-orm";

export async function loader({ request }: Route.LoaderArgs) {
	const { session } = await isAuthenticated(request);
	if (!session) {
		return data("Not Allowed", { status: 405 });
	}
	try {
		const students = await db
			.select()
			.from(studentsTable)
			.orderBy(desc(studentsTable.createdAt));
		return data({ students }, { status: 200 });
	} catch (error) {
		console.error("🔴Error fetching all the students", error);
		return data(
			error instanceof Error ? error.message : "Something went wrong",
			{ status: 500 },
		);
	}
}
