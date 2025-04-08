import { Link } from "react-router";
import { Book, Home, Settings, Users } from "lucide-react";

export function CourseEditSidebar() {
    return (
        <div className="w-64 h-full bg-gray-50 border-r border-gray-200 p-2 flex flex-col">
            {/* List of segments */}
            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                            <Home className="w-5 h-5" />
                            <span>Segment 1</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/courses"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                            <Book className="w-5 h-5" />
                            <span>Segment 2</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/students"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                            <Users className="w-5 h-5" />
                            <span>Segment 3</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Add segment btn */}
            {/* <div className="mt-auto pt-4 border-t border-gray-200">
                <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>
            </div> */}
        </div>
    );
}