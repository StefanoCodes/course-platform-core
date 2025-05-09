import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
}
export default function CourseDetails() {
	return <Outlet />;
}
