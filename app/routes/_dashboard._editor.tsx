import { Outlet } from "react-router";
import type { Route } from "./+types/_dashboard._editor";
import { CourseEditSidebar } from "~/components/features/courses/edit/course-edit-sidebar";

// load all the segments of a course
// export async function loader({ params }: Route.LoaderArgs) {
//     const { slug } = params;
//     return { slug };
// }

export default function CourseEditorLayout() {
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-row h-full">
                <CourseEditSidebar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}