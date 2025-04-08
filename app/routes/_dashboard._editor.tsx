import { Outlet, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/_dashboard._editor";
import { CourseEditSidebar } from "~/components/features/courses/edit/course-edit-sidebar";

// load all the segments of a course
export async function loader({ params }: Route.LoaderArgs) {
    const { slug } = params;
    return { slug };
}

export function useEditorLoaderData() {
    const data = useRouteLoaderData<typeof loader>("routes/_dashboard._editor");
    if (!data) {
        throw new Error('Editor Loader needs to be used within a EditorLoader context, the route needs to be a child of the Editor route')
    }
    return data;
}

export default function CourseEditorLayout() {
    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
                <CourseEditSidebar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}