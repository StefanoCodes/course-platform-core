// here we will show the course details and the segments

import type { Route } from "./+types/_dashboard.dashboard.courses_.$slug";

export async function loader({ params }: Route.LoaderArgs) {
    const { slug } = params;
    return { slug };
}
export default function CourseDetails({ loaderData }: Route.ComponentProps) {
    const { slug } = loaderData;
    return <div>{slug}</div>;
}

