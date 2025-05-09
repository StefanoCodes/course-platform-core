import { redirect, useRouteLoaderData } from "react-router";
import { StudentsList } from "~/components/features/students/students-list";
import { GetAllStudents } from "~/lib/admin/data-access/students.server";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";
import type { Route } from "./+types/_dashboard.dashboard.students";

export async function loader({ request }: Route.LoaderArgs) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const { success, students } = await GetAllStudents(request);
	if (!success) {
		return { students: [] };
	}
	return { students };
}

export function useStudentsLoaderData() {
	const data = useRouteLoaderData<typeof loader>(
		"routes/_dashboard.dashboard.students",
	);
	if (!data)
		throw new Error(
			"Cannot use students loader data if the route is not a child of the students route",
		);
	return data;
}
export default function Page() {
	return (
		<div className="flex flex-col gap-4 h-full overflow-hidden py-4 [scrollbar-width:thin]">
			<StudentsList />
		</div>
	);
}
