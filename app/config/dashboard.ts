import { Book, Home, Users, type LucideProps } from "lucide-react";

type DahsboardConfig = {
	sidebar: {
		logo: {
			src: string;
			alt: string;
		};

		items: {
			title: string;
			icon: React.ForwardRefExoticComponent<
				Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
			>;
			url: string;
		}[];
	};
	videoPlayer: "Youtube" | "Vimeo";
};

export const dashboardConfig: DahsboardConfig = {
	sidebar: {
		logo: {
			src: "/assets/LOGO.png",
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
			// {
			//   title: "Admins",
			//   icon: Users,
			//   url: "/dashboard/admins",
			// },
			// {
			//   title: "Messages",
			//   icon: MessageCircle,
			//   url: "/dashboard/messages",
			// },
			// {
			//   title: "Settings",
			//   icon: Settings,
			//   url: "/dashboard/settings",
			// },
		],
	},
	videoPlayer: "Youtube",
};
