import React from "react";
import { Link, useLocation } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb";

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
    return (
        <BreadcrumbList>
         {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
                <React.Fragment key={name}>
                <BreadcrumbItem key={name}>
                    <BreadcrumbLink asChild>
                    <Link to={routeTo} className="capitalize">{name}</Link>
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