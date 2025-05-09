import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { getCourseBySlug } from "~/lib/student/data-access/courses.server";
import { getSegmentBySlug } from "~/lib/student/data-access/segments.server";
import { isStudentLoggedIn } from "~/lib/auth/auth.server";
import type { Route } from "./+types/_student.student.courses_.$slug_.$segment";
import { VideoPlayer } from "~/components/features/video-players/video-player";
import { dashboardConfig } from "~/config/dashboard";

export async function loader({ request, params }: Route.LoaderArgs) {
	const { isLoggedIn } = await isStudentLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/login");
	}

	const { slug: courseSlug, segment } = params;
	if (!courseSlug || !segment) {
		throw redirect("/student/courses");
	}

	// Get course details
	const { success: courseSuccess, course } = await getCourseBySlug(
		request,
		courseSlug,
	);
	if (!courseSuccess || !course) {
		throw redirect("/student/courses");
	}

	// Get segment details
	const { success: segmentSuccess, segment: segmentData } =
		await getSegmentBySlug(request, segment, course.id);
	if (!segmentSuccess || !segmentData) {
		throw redirect(`/student/courses/${courseSlug}`);
	}

	return { course, segmentData };
}

export default function SegmentDetails({ loaderData }: Route.ComponentProps) {
	const { course, segmentData } = loaderData;
	const { name, description, videoUrl } = segmentData;

	return (
		<div className="max-w-7xl mx-auto pt-8 md:pt-12 lg:pt-20 pb-8 px-4 xl:px-0">
			<Button variant="secondary" asChild className="mb-8">
				<Link to={`/student/courses/${course.slug}`}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Videos
				</Link>
			</Button>

			{/* VIDEO PLAYER */}
			<div className="mb-6">
				<VideoPlayer type={dashboardConfig.videoPlayer} url={videoUrl} />
			</div>
			{/* VIDEO INFO */}
			<div className="mb-8 flex justify-center items-center flex-col">
				<div className="flex items-center gap-3 mb-4">
					<div className="bg-brand-primary/10 p-3 rounded-full">
						<BookOpen className="h-6 w-6 text-brand-primary" />
					</div>
					<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{name}</h1>
				</div>
				<p className="text-gray-600 text-lg max-w-3xl">{description}</p>
			</div>
		</div>
	);
}
