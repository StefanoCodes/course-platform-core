import { Outlet, redirect } from "react-router";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug";

export async function loader({ request }: Route.LoaderArgs) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }
}
export default function CourseDetails() {
    return <Outlet />
}

