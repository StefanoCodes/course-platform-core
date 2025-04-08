import { redirect } from "react-router";
import { getSegmentBySlug } from "~/lib/data-access/segments.sever";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug_.$segment_.edit";
import { Button } from "~/components/ui/button";
import { Link, href } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
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

export default function EditSegmentPage({ loaderData }: Route.ComponentProps) {
    const { courseSlug, segmentData } = loaderData;
    return (
        <div className="p-4 flex flex-col gap-4">
            {/* Go back to course segment */}
            <Button variant={"link"} asChild>
                <Link to={href("/dashboard/courses/:slug/:segment", { segment: segmentData.slug, slug: courseSlug })}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to segment
                </Link>
            </Button>
            {/* Editing Information */}
        </div>
    )
}