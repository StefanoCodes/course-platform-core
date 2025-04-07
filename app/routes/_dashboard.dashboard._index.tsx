import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { redirect } from "react-router";
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
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}
