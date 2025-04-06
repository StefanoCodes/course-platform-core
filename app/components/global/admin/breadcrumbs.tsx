import React from "react";
import { Link, useLocation } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";

export function Breadcrumbs() {
    const location = useLocation();
    const pathname = location.pathname;
    const pathnames = pathname.split("/").filter((item) => item);
    return (
        <Breadcrumb>
          <BreadCrumbsList pathnames={pathnames} />
        </Breadcrumb>
    )
}
function BreadCrumbsList( {pathnames}: {pathnames: string[]}) {
    const location = useLocation();
    return (
        <BreadcrumbList>
         {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const isActive = location.pathname === routeTo;
            const isDashboard = name === "dashboard";
            return (
                <React.Fragment key={name}>
                <BreadcrumbItem key={name}>
                    <BreadcrumbLink asChild>
                    <Link to={routeTo} className={cn("capitalize", isActive && !isDashboard && "text-black font-bold")}>{name}</Link>
                    </BreadcrumbLink>
                    
                </BreadcrumbItem>
                {!isLast && (
                    <BreadcrumbSeparator className="hidden md:block" />
                )}
                </React.Fragment>
            )
        })}
        </BreadcrumbList>
    )
}