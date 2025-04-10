import { Heart } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { studentNavItems } from "~/config/navigation";
import { cn } from "~/lib/utils";
import { useStudentLayoutData } from "~/routes/_student";
import { LogoutProvider } from "../admin/logout";
export function StudentNavbar() {
    const { name} = useStudentLayoutData();
    const location = useLocation();
    const pathname = location.pathname;
    return(
        <nav className="bg-black/90 sticky top-0 z-20 h-[var(--navbar-height)]">
            <div className="flex items-center h-full justify-between px-4">
                <div className="flex items-center gap-2">
                    <p className="text-white">Welcome Back {name}</p>
                    <Heart className="w-4 h-4 text-red-300" />
                </div>
                <div className="flex items-center gap-2">
                   {studentNavItems.map((link) => {
                    const isActive = pathname === link.href;
                    console.log(pathname)
                    return (
                        <Button variant={"outline"} className={cn("hover:bg-brand-primary/80 border-none   text-black",isActive && "bg-brand-primary text-white",)} asChild>
                        <Link className="cursor-pointer" to={link.href} key={link.href}>
                            {link.icon && <link.icon className="w-4 h-4" />}
                            <span>{link.label}</span>
                    </Link>
                        </Button>
                    )
                   })}
                </div>
                <div className="flex items-center gap-2">
                   <LogoutProvider />
                </div>
            </div>
        </nav>
    )
}