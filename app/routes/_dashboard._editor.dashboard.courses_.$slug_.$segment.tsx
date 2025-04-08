import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug_.$segment";
export async function loader({ request, params }: Route.LoaderArgs) {
    const { slug: courseSlug, segment } = params;
    // load data related to that segment
    return {
        courseSlug,
        segment
    }
}

export default function CourseSegment({ loaderData }: Route.ComponentProps) {
    const { courseSlug, segment } = loaderData;
    return <div>Course: {courseSlug} Segment: {segment}</div>;
}
