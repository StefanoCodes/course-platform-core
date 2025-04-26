import { BookOpen, User, type LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    description?: string;
}

export const mainNavItems: NavItem[] = [
    {
        label: "Watch Demo",
        href: "#demo",
    },
    {
        label: "How it works",
        href: "#how-it-works",
    },
    {
        label: "Benefits",
        href: "#benefits",
    },
{
    label: "FAQ's",
    href: "#faqs",
},
{
    label: "Contact Us",
    href: "#contact",
},
];

export const authNavItems: NavItem[] = [
    {
        label: "Book a Demo",
        href: "https://cal.com/seif-platform/15min",
    },
];

export const studentNavItems: NavItem[] = [
    {
        label: "Courses",
        href: "/student/courses",
        icon: BookOpen
    },
    // {
    //     label: "Profile",
    //     href: "/student/profile",
    //     icon: User
    // },
];

