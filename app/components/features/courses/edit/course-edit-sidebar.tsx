import { useEditorLoaderData } from "~/routes/_dashboard._editor";
import { CreateSegment } from "./create-segment";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function CourseEditSidebar() {
    const { segments, courseSlug } = useEditorLoaderData();
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <aside className="w-full md:w-64 h-full overflow-hidden bg-gray-50 md:border-r border-r-0 border-b md:border-b-0 border-gray-200 p-2 flex flex-col">
            <div className="h-full flex flex-col gap-4">
                {/* Scrollable Content (Segments) */}
                <div className="flex-1 relative h-full overflow-y-auto [scrollbar-width:thin]">
                    <nav className="h-full w-full">
                        <ul className="space-y-2 w-full">
                            {segments.map((segment) => {
                                const isActive = pathname.includes(segment.slug);
                                return (
                                    <li key={segment.id} className="w-full">
                                        <Link className={cn("text-sm capitalize block bg-gray-100 hover:bg-gray-200 transition-all duration-300 w-full p-2 rounded-md text-gray-500 hover:text-gray-700", isActive && "bg-brand-primary text-white hover:text-gray-300")} to={`/dashboard/courses/${courseSlug}/${segment.slug}`}>
                                            {segment.name}
                                        </Link>
                                    </li>
                                )
                            })}
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