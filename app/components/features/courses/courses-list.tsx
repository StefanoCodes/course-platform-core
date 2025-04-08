import { CircleCheck, Lock, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useCoursesLoaderData } from "~/routes/_dashboard.dashboard.courses";

export function CoursesList() {
    const { courses } = useCoursesLoaderData();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
                return (
                    <Card key={course.id}>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>
                                <h3>
                                    {course.name}
                                </h3>
                            </CardTitle>
                            {/* show if its private or public by icon */}
                            {course.isPublic ? <Badge variant="outline" className="flex flex-row items-center gap-1">
                                <CircleCheck className="w-4 h-4" />
                                Published
                            </Badge> :
                                <Badge variant="outline" className="flex flex-row items-center gap-1">
                                    <Lock className="w-4 h-4" />
                                    Private
                                </Badge>}

                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                {course.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" asChild>
                                <Link to={`/dashboard/courses/${course.slug}`}>
                                    <Pencil />
                                    Edit Course
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}

        </div>
    )
}