import { data, Outlet, redirect, useLoaderData, useNavigation, useRouteLoaderData } from "react-router";
import { AppSidebar } from "~/components/global/admin/app-sidebar";
import { Breadcrumbs } from "~/components/global/admin/breadcrumbs";
import { DashboardSkeleton } from "~/components/features/loading/dashboard-skeleton";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

import type { Route } from "./+types/_dashboard.dashboard";
import { isAdminLoggedIn } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
 const { isLoggedIn, admin } = await isAdminLoggedIn(request);
 if (!isLoggedIn || !admin) {
  return redirect("/admin/login")
 }
 return {
  admin
 }
}

export function useDashboardLayoutLoaderData() {
  const data = useRouteLoaderData<typeof loader>("routes/_dashboard")
  if (!data) {
    throw new Error('Dashboard Loader needs to be used within a DashboardLoader context, the route needs to be a child of the Dashboard route')
  }
  return data
}

export default function Page() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '12rem',
        } as React.CSSProperties
      }
      className="h-dvh"
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-hidden">
        <div className="flex flex-1 flex-col p-4 h-full">
          {/* BreadCrumbs Component */}
          <div className="flex items-center gap-2 pb-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-2" />
            <Breadcrumbs />
          </div>

          {isLoading ? <DashboardSkeleton /> : <div className="overflow-y-auto h-full"><Outlet /></div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

