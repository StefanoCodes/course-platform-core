import { Outlet, redirect, useRouteLoaderData } from "react-router";
import { CourseEditSidebar } from "~/components/features/courses/editor/course-edit-sidebar";
import { getAllSegmentsForCourse } from "~/lib/admin/data-access/segments.sever";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";
import type { Route } from "./+types/_dashboard._editor";

export async function loader({ request, params }: Route.LoaderArgs) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const { slug: courseSlug } = params;
	if (!courseSlug) {
		throw redirect("/dashboard/courses");
	}
	// get all segments for that course
	const { segments } = await getAllSegmentsForCourse(request, courseSlug);
	return { courseSlug, segments };
}

export function useEditorLoaderData() {
	const data = useRouteLoaderData<typeof loader>("routes/_dashboard._editor");
	if (!data) {
		throw new Error(
			"Editor Loader needs to be used within a EditorLoader context, the route needs to be a child of the Editor route"
		);
	}
	return data;
}

export default function CourseEditorLayout() {
	return (
		<div className="flex flex-col-reverse gap-8 md:flex-row h-full overflow-hidden">
			<CourseEditSidebar />
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
