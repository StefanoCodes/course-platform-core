import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { studentNavItems } from "~/config/navigation";
import { cn } from "~/lib/utils";
import { useStudentLayoutData } from "~/routes/_student";
import { LogoutProvider } from "../admin/logout";

export function StudentNavbar() {
    const { student} = useStudentLayoutData();
    const location = useLocation();
    const pathname = location.pathname;
    return(
        <nav className="bg-[#333] sticky top-0 z-20 h-[var(--navbar-height)] [--widest-el:11.375rem]">
            <div className="flex items-center h-full justify-between px-4 container mx-auto">
                <div className="flex items-center gap-2">
                    <p className="text-white">Welcome Back {student?.name}</p>
                    <Heart className="w-4 h-4 text-red-300" />
                </div>
                <div className="hidden md:flex items-center gap-2">
                   {studentNavItems.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Button key={link.href} variant={"outline"} className={cn("hover:bg-brand-primary/80 border-none   text-black",isActive && "bg-brand-primary text-white",)} asChild>
                        <Link className="cursor-pointer" to={link.href} key={link.href}>
                            {link.icon && <link.icon className="w-4 h-4" />}
                            <span>{link.label}</span>
                    </Link>
                        </Button>
                    )
                   })}
                </div>
                <div className="hidden md:flex items-center gap-2 min-w-[var(--widest-el)]">
                   <LogoutProvider type="student" />
                </div>
                <HamburgerMenu pathname={pathname} />
            </div>
        </nav>
    )
}

function HamburgerMenu( {pathname}: {pathname: string}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="md:hidden">
                <Button
                    variant="outline"
                    className="border-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <motion.div
                        animate={isOpen ? "open" : "closed"}
                        className="flex flex-col gap-1"
                    >
                        <motion.span
                            variants={{
                                closed: { rotate: 0, y: 0 },
                                open: { rotate: 45, y: 4 },
                            }}
                            className="h-0.5 w-6 bg-black block origin-center"
                        />
                        <motion.span
                            variants={{
                                closed: { opacity: 1 },
                                open: { opacity: 0 },
                            }}
                            className="h-0.5 w-6 bg-black block"
                        />
                        <motion.span
                            variants={{
                                closed: { rotate: 0, y: 0 },
                                open: { rotate: -45, y: -4 },
                            }}
                            className="h-0.5 w-6 bg-black block origin-center"
                        />
                    </motion.div>
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        opacity: isOpen ? 1 : 0,
                        y: isOpen ? 0 : -20,
                        display: isOpen ? "flex" : "none",
                    }}
                    className="absolute top-[var(--navbar-height)] left-0 right-0 z-30 bg-[#333] flex-col gap-4 p-4"
                >
                    {studentNavItems.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Button
                                key={link.href}
                                variant={"outline"}
                                className={cn(
                                    "w-full hover:bg-brand-primary/80 border-none text-black",
                                    isActive && "bg-brand-primary text-white"
                                )}
                                asChild
                            >
                                <Link className="cursor-pointer" to={link.href}>
                                    {link.icon && <link.icon className="w-4 h-4" />}
                                    <span>{link.label}</span>
                                </Link>
                            </Button>
                        );
                    })}
                    <LogoutProvider className="w-full" type="student" />
                </motion.div>
            </div>
    )
}
