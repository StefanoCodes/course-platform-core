import { Book, Home, MessageCircle, Settings, Users } from "lucide-react";

export const dashboardConfig = {
  sidebar: {
    logo: {
      src: "/assets/logo.webp",
      alt: "Logo",
    },
    items: [
      {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
      },

      {
        title: "Courses",
        icon: Book,
        url: "/dashboard/courses",
      },
      {
        title: "Students",
        icon: Users,
        url: "/dashboard/students",
      },
      {
        title: "Admins",
        icon: Users,
        url: "/dashboard/admins",
      },
      {
        title: "Messages",
        icon: MessageCircle,
        url: "/dashboard/messages",
      },
      {
        title: "Settings",
        icon: Settings,
        url: "/dashboard/settings",
      },
    ],
    user: {
      name: "Admin",
      email: "admin@gmail.com",
      avatar: "/assets/logo.webp",
    },
  },
}


