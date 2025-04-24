import { ArrowRightIcon } from "lucide-react";
import { href, Link, redirect } from "react-router";
import { VideoPlayer } from "~/components/features/video-players/video-player";
import { Button } from "~/components/ui/button";
import { dashboardConfig } from "~/config/dashboard";
import { getSegmentBySlug } from "~/lib/admin/data-access/segments.sever";
import { isAdminLoggedIn } from "~/lib/auth.server";
import { formatDateToString } from "~/lib/utils";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug_.$segment";
export async function loader({ request, params }: Route.LoaderArgs) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }

    const { slug: courseSlug, segment } = params;

    // get segment information
    const { success, segment: segmentData } = await getSegmentBySlug(request, segment, courseSlug);
    if (!success || !segmentData) {
        throw redirect("/dashboard/courses")
    }
    return {
        courseSlug,
        segmentData
    }
}

export default function CourseSegment({ loaderData }: Route.ComponentProps) {
    const { courseSlug, segmentData } = loaderData;
    return <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full [scrollbar-width:thin]">
        {/* display created at */}
        <div className="flex items-center justify-between w-full">
            <Button variant={"link"} asChild>
                <Link to={href("/dashboard/courses/:slug/:segment/edit", { segment: segmentData.slug, slug: courseSlug })}>Edit <ArrowRightIcon className="w-4 h-4" /></Link>
            </Button>
            <p className="text-sm text-gray-500 self-end">Created at: {formatDateToString(segmentData.created_at)}</p>
        </div>
       <VideoPlayer type={dashboardConfig.videoPlayer} url={segmentData.videoUrl} />

        <h2>{segmentData.name}</h2>

        <p>{segmentData.description}</p>

    </div>;
}
