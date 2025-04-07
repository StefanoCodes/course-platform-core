import { data, Outlet, redirect, useLoaderData, useRouteLoaderData } from "react-router";
import { AppSidebar } from "~/components/global/admin/app-sidebar";
import { Breadcrumbs } from "~/components/global/admin/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { getAdminById } from "~/lib/data-access/admin.server";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import type { Route } from "./+types/_dashboard.dashboard";
export async function loader({ request }: Route.LoaderArgs) {
  const { isLoggedIn, adminId } = await isAdminLoggedIn(request);
  if (!isLoggedIn || !adminId) {
    return redirect('/admin/login')
  }
  // load data about the admin
  const admin = await getAdminById(request);
  if (!admin.success || !admin.admin) {
    return redirect('/admin/login')
  }
  return data({
    admin: admin.admin,
  })
}

export function useDashboardLoaderData() {
  const data = useRouteLoaderData<typeof loader>("routes/_dashboard")
  if (!data) {
    throw new Error('Dashboard Loader needs to be used within a DashboardLoader context, the route needs to be a child of the Dashboard route')
  }
  return data
}

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '19rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col p-4">
          {/* BreadCrumbs Component */}
          <div className="flex items-center gap-2 pb-4 md:pb-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-2" />
            <Breadcrumbs />
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}

