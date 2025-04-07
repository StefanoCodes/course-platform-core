import { Outlet, redirect, useRouteLoaderData } from "react-router";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard.dashboard";
import { GetStudentsAnalytics } from "~/lib/data-access/students.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { isLoggedIn } = await isAdminLoggedIn(request);

  if (!isLoggedIn) {
    throw redirect('/admin/login');
  }

  // get analytics data
  const { success, totalStudentsCount, activeStudentsCount, inactiveStudentsCount } = await GetStudentsAnalytics(request)

  if (!success) {
    return { totalStudentsCount: 0, activeStudentsCount: 0, inactiveStudentsCount: 0 }
  }
  return { totalStudentsCount, activeStudentsCount, inactiveStudentsCount }
}


export function useDashboardLoaderData() {
  const data = useRouteLoaderData<typeof loader>("routes/_dashboard.dashboard")
  if (!data) {
    throw new Error('Dashboard Loader needs to be used within a DashboardLoader context, the route needs to be a child of the Dashboard route')
  }
  return data
}
export default function Page() {
  return <Outlet />
}

