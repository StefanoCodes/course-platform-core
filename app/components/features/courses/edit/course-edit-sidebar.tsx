import { Users } from "lucide-react";
import { Link } from "react-router";
import { CreateSegment } from "./create-segment";

export function CourseEditSidebar() {
    return (
        <aside className="w-full md:w-64 h-full overflow-hidden bg-gray-50 md:border-r border-r-0 border-b md:border-b-0 border-gray-200 p-2 flex flex-col">
            <div className="h-full flex flex-col gap-4">
                {/* Scrollable Content (Segments) */}
                <div className="flex-1 relative overflow-y-auto [scrollbar-width:thin]">
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/dashboard/students"
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Segment 3</span>
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
                            <li>
                                <Link
                                    to="/dashboard/students"
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Segment 3</span>
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
                        {/* Gradient mask to indicate scrollable content */}

                        <div className="sticky bottom-0 left-0 right-0 h-16 pointer-events-none" style={{
                            background: 'linear-gradient(to bottom, transparent, rgb(249 250 251) 100%)'
                        }} />
                    </nav>
                </div>
                {/* Add Segment Button */}
                <CreateSegment />
            </div>
        </aside>
    );
}