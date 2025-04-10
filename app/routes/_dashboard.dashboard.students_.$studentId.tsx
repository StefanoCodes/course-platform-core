import { ArrowLeft, Calendar, Edit, Mail, Phone, User } from "lucide-react";
import { data, Link, redirect } from "react-router";
import { ActivateStudent } from "~/components/features/students/activate-student";
import { DeactivateStudent } from "~/components/features/students/deactivate-student";
import { StatusBadge } from "~/components/features/students/status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { GetStudentById } from "~/lib/admin/data-access/students.server";
import { formatDateToString } from "~/lib/utils";
import type { Route } from "./+types/_dashboard.dashboard.students_.$studentId";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
export async function loader({ request, params }: Route.LoaderArgs) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }

    const { studentId } = params;
    if (!studentId) {
        throw redirect("/dashboard/students")
    }
    const { success, student } = await GetStudentById(request, studentId as string)
    if (!success || !student) {
        throw redirect("/dashboard/students")
    }
    return data({ success: true, student }, { status: 200 })
}

// display data
export default function StudentProfilePage({ loaderData }: Route.ComponentProps) {
    const { student } = loaderData
    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/students">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Students
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle className="text-2xl">{student.name}</CardTitle>
                                <CardDescription className="text-base">{student.email}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={student.isActivated} />
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/dashboard/students/${student.studentId}/edit`}>
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-base">{student.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-base">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p className="text-base">{student.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                                    <p className="text-base">{formatDateToString(new Date(student.created_at))}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        {student.isActivated ? (
                            <DeactivateStudent studentId={student.studentId} />
                        ) : (
                            <ActivateStudent studentId={student.studentId} />
                        )}
                    </CardFooter>
                </Card>

                {/* Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Manage student account access</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Account Status</span>
                                <StatusBadge status={student.isActivated} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Updated</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatDateToString(new Date(student.updated_at))}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


