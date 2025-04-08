import { redirect } from "react-router";
import { CoursesAnalytics } from "~/components/features/courses/courses-analytics";
import { StudentAnalytics } from "~/components/features/students/student-analytics";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard.dashboard";

export async function loader({ request }: Route.LoaderArgs) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/admin/login')
    }
    return null;
}
export default function Page() {

    return (
        <div className="flex flex-col gap-8 divide-y divide-border">
            <StudentAnalytics />
            <CoursesAnalytics />
        </div>
    )
}
