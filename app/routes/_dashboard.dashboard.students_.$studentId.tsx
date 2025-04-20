import { ArrowLeft, Calendar, Edit, Mail, Phone, User } from "lucide-react";
import React, { Suspense } from "react";
import { data, Link, redirect, useLoaderData } from "react-router";
import { ActivateStudent } from "~/components/features/students/activate-student";
import { DeactivateStudent } from "~/components/features/students/deactivate-student";
import { StatusBadge } from "~/components/features/students/status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { Course } from "~/db/schema";
import { getCoursesStudentEnrolledIn, GetStudentById } from "~/lib/admin/data-access/students.server";
import { isAdminLoggedIn } from "~/lib/auth.server";
import { formatDateToString } from "~/lib/utils";
import type { Route } from "./+types/_dashboard.dashboard.students_.$studentId";
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
    const studentCoursesEnrolledIn = getCoursesStudentEnrolledIn(request,studentId);
    const { success, student } = await GetStudentById(request, studentId as string)
    if (!success || !student) {
        throw redirect("/dashboard/students")
    }
    // non critical data
    
    return data({ success: true, student, courses:studentCoursesEnrolledIn }, { status: 200 })
}


export default function StudentProfilePage({}: Route.ComponentProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StudentInfoMainCard/>
                <StudentStatusCard/>
                <Suspense fallback={<p>loading...</p>}>
                <CoursesStudentAssignedTo/>
                </Suspense>
            </div>
        </div>
    )
}

function StudentInfoMainCard() {
    const { student} = useLoaderData<typeof loader>()
    return (
        <Card className="col-span-3 md:col-span-2">
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <p className="text-base">{formatDateToString(new Date(student.createdAt))}</p>
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
    )
}

function StudentStatusCard() {
    const { student} = useLoaderData<typeof loader>()
    return (
        <Card className="col-span-3 md:col-span-1">
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
                        {formatDateToString(new Date(student.createdAt))}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
    )
}

function CoursesStudentAssignedTo() {
    const data = useLoaderData<typeof loader>();
    const { courses} = React.use(data.courses)
    const columns: {
        header: string;
        accessorKey: keyof Course;
        cell?: (course: Course) => React.ReactNode;
      }[] = [
        { header: 'Name', accessorKey: 'name' },
        { header: 'Description', accessorKey: 'description' },
        { header: 'Published', accessorKey: 'isPublic',   cell: (course) => (
            <StatusBadge status={course.isPublic} />
          ), },
      
      ];
    return (
<div className="col-span-3 flex flex-col gap-4 md:gap-6">

        
     <h3 className="text-xl md:text-23xl font-medium">
        Courses student is assigned to:
     </h3>
        <Table>
<TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className={`h-9 py-2 ${
                    column.accessorKey === 'name'
                      ? 'sticky left-0 bg-muted font-medium xl:static xl:bg-inherit'
                      : ''
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
              </TableRow>
              </TableHeader>
              <TableBody>
            {courses.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.accessorKey)}
                    className={`py-2 ${
                      column.accessorKey === 'name'
                        ? 'sticky left-0 z-10 bg-muted font-medium xl:static xl:bg-inherit'
                        : ''
                    }`}
                  >
                    {
  column.cell ? (
    column.cell(item)
  ) : (
    <>{String(item[column.accessorKey])}</>
  )
                    }
                 
                  </TableCell>
                ))}

              </TableRow>
            ))}
          </TableBody>
        </Table>
        
</div>
    )
}