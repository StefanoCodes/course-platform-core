import { CircleCheck, Lock, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useCoursesLoaderData } from "~/routes/_dashboard.dashboard.courses";
import { MarkAsPublic } from "./mark-as-public";
import { MarkAsPrivate } from "./mark-as-private";
import type { Course } from "~/db/schema";
import { DeleteCourse } from "./delete-course";

export function CoursesList() {
    const { courses } = useCoursesLoaderData();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            )
            )}
        </div>
    )
}
function CourseCard({ course }: { course: Course }) {
    const { id, name, description, isPublic, slug } = course;
    return (
        <Card className="relative">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>
                    <h3>
                        {name}
                    </h3>
                </CardTitle>

                {isPublic ? <IsPublicBadge /> : <IsPrivateBadge />}

            </CardHeader>
            <CardContent>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-row justify-between items-center">
                <Button variant="outline" asChild>
                    <Link to={`/dashboard/courses/${slug}`}>
                        <Pencil />
                        Edit Course
                    </Link>
                </Button>
                {!isPublic ? <MarkAsPublic courseId={id} /> : <MarkAsPrivate courseId={id} />}
            </CardFooter>
            <div className="absolute -top-4 -right-4">
                <DeleteCourse courseId={id} />
            </div>
        </Card>
    )
}
function IsPublicBadge() {
    return (
        <Badge className="flex bg-brand-primary flex-row items-center gap-1">
            <CircleCheck className="w-4 h-4" />
            Published
        </Badge>
    )
}
function IsPrivateBadge() {
    return (
        <Badge variant="default" className="flex flex-row items-center gap-1">
            <Lock className="w-4 h-4" />
            Private
        </Badge>
    )
}
