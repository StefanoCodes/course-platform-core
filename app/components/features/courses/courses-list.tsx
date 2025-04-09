import { CircleCheck, Lock, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useCoursesLoaderData } from "~/routes/_dashboard.dashboard.courses";
import { MarkAsPublic } from "./mark-as-public";
import { MarkAsPrivate } from "./mark-as-private";

export function CoursesList() {
    const { courses } = useCoursesLoaderData();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(({ id, name, description, isPublic, slug }) => {
                return (
                    <Card key={id}>
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
                    </Card>
                )
            })}

        </div>
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
