import { ArrowLeft, BookOpen, PlayCircle } from "lucide-react";
import { Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { Segment } from "~/db/schema";
import { getCourseBySlug } from "~/lib/student/data-access/courses.server";
import { getSegmentsByCourseId } from "~/lib/student/data-access/segments.server";
import { isStudentLoggedIn } from "~/lib/auth.server";
import type { Route } from "./+types/_student.student.courses_.$slug";

export async function loader({ request, params }: Route.LoaderArgs) {
    const { isLoggedIn } = await isStudentLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect('/login');
    }

    const { slug } = params;
    if (!slug) {
        throw redirect('/student/courses');
    }

    // Get course details
    const { success, course } = await getCourseBySlug(request, slug);
    if (!success || !course) {
        throw redirect('/student/courses');
    }

    // Get segments for this course
    const { success: segmentsSuccess, segments } = await getSegmentsByCourseId(request, course.id);
    if (!segmentsSuccess) {
        return { course, segments: [] };
    }

    return { course, segments };
}

export default function CourseDetails({ loaderData }: Route.ComponentProps) {
    const { course, segments } = loaderData;
    const { name, description } = course;

    return (
        <div className="container mx-auto pt-20 px-4">
            <div className="mb-8">
                <Button variant="outline" asChild className="mb-4">
                    <Link to="/student/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Link>
                </Button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-brand-primary/10 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-brand-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">{name}</h1>
                </div>
                <p className="text-gray-600 text-lg max-w-3xl">{description}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Videos</h2>
                {segments.length === 0 ? (
                    <p className="text-gray-500">No segments available for this course yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {segments.map((segment) => (
                            <SegmentCard key={segment.id} segment={segment} courseSlug={course.slug} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SegmentCard({ segment, courseSlug }: { segment: Segment; courseSlug: string }) {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>{segment.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-2">{segment.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                    <Link to={`/student/courses/${courseSlug}/${segment.slug}`}>Watch Video</Link>
                </Button>
                <div className="bg-brand-primary/10 p-2 rounded-full">
                    <PlayCircle className="h-4 w-4 text-brand-primary" />
                </div>
            </CardFooter>
        </Card>
    );
} 