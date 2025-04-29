import { redirect } from "react-router";
import { CoursesAnalytics } from "~/components/features/courses/courses/courses-analytics";
import { StudentAnalytics } from "~/components/features/students/student-analytics";
import type { Route } from "./+types/_dashboard.dashboard";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	return null;
}
export default function Page() {
	return (
		<div className="flex flex-col gap-8 divide-y divide-border py-4">
			<StudentAnalytics />
			<CoursesAnalytics />
		</div>
	);
}
