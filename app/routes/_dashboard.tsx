import { Outlet } from "react-router";
import { AppSidebar } from "~/components/global/admin/app-sidebar";
import { Breadcrumbs } from "~/components/global/admin/breadcrumbs";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

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
            <Breadcrumbs/>
          </div>
        <Outlet/>
      </div>
    </SidebarInset>
  </SidebarProvider>
  );
}

