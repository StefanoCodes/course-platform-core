import { Outlet, redirect } from "react-router";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard.dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  const { isLoggedIn } = await isAdminLoggedIn(request);
  if (!isLoggedIn) {
    return redirect('/admin/login');
  }
  return null;
}
export default function Page() {
  return <Outlet />
}

