import { BookOpen, User, type LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    description?: string;
}

export const mainNavItems: NavItem[] = [
    {
        label: "Features",
        href: "/features",
    },
    {
        label: "How it works",
        href: "/how-it-works",
    },
    {
        label: "Pricing",
        href: "/pricing",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];

export const authNavItems: NavItem[] = [
    {
        label: "Book a Demo",
        href: "/demo",
    },
];
export const studentNavItems: NavItem[] = [
    {
        label: "Courses",
        href: "/student/courses",
        icon: BookOpen
    },
    {
        label: "Profile",
        href: "/student/profile",
        icon: User
    },

];

