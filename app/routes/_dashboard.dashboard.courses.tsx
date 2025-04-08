import { redirect, useRouteLoaderData, type LoaderFunctionArgs } from "react-router";
import { CreateCourse } from "~/components/features/courses/create-course";
import { getAllCourses } from "~/lib/data-access/courses.server";
import type { Route } from "./+types/_dashboard.dashboard.courses";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { CoursesList } from "~/components/features/courses/courses-list";
export async function loader({ request }: Route.LoaderArgs) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login");
    }
    const courses = await getAllCourses(request);
    if (!courses.success || !courses.courses) {
        return { courses: [] }
    }
    return { courses: courses.courses }
}

export function useCoursesLoaderData() {
    const data = useRouteLoaderData<typeof loader>("routes/_dashboard.dashboard.courses")
    if (!data) {
        throw new Error('Courses Loader needs to be used within a CoursesLoader context, the route needs to be a child of the Courses route')
    }
    return data;
}
export default function Page() {
    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className="flex flex-row justify-between w-full ">
                <h1>Courses</h1>
                <CreateCourse />
            </div>
            <CoursesList />
        </div>
    )
}
