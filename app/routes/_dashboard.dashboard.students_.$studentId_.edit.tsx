import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { data, Link, redirect, useFetcher, useNavigation } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { GetStudentById } from "~/lib/data-access/students.server";
import type { FetcherResponse } from "~/lib/types";
import { updateStudentSchema, type UpdateStudentSchema } from "~/lib/zod-schemas/student";
import type { Route } from "./+types/_dashboard.dashboard.students_.$studentId_.edit";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";

export async function loader({ request, params }: Route.LoaderArgs) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) throw redirect("/admin/login")
    const { studentId } = params;
    if (!studentId) throw redirect("/dashboard/students")
    const { success, student } = await GetStudentById(request, studentId)
    if (!success || !student) throw redirect("/dashboard/students")
    return data({ success: true, student }, { status: 200 })
}

export default function EditStudentPage({ loaderData }: Route.ComponentProps) {
    const { student } = loaderData;
    const fetcher = useFetcher<FetcherResponse>();
    const isSubmitting = fetcher.state === "submitting";
    const form = useForm<UpdateStudentSchema>({
        resolver: zodResolver(updateStudentSchema),
        defaultValues: {
            name: student.name,
            email: student.email,
            phoneNumber: student.phone ?? "",
        },
    });

    const isThereAnyChanges = form.formState.isDirty;

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success("Student updated successfully");
            }
            if (!fetcher.data.success) {
                toast.error(fetcher.data.message);
                form.reset();
            }
        }
    }, [fetcher.data]);


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/students/${student.studentId}`}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Student Profile
                    </Link>
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Edit Student</CardTitle>
                    <CardDescription>Update the student's information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <fetcher.Form
                            method="POST"
                            action="/resource/student"
                            className="flex flex-col gap-4"
                            onSubmit={form.handleSubmit((data) => {
                                // if the data is the same just return
                                if (JSON.stringify(data) === JSON.stringify({ name: student.name, email: student.email, phoneNumber: student.phone ?? "" })) {
                                    return;
                                }
                                fetcher.submit({
                                    ...data,
                                    studentId: student.studentId,
                                    intent: "update-student"
                                }, {
                                    action: "/resource/student",
                                    method: "POST"
                                });
                            })}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                defaultValue={student.name}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-xs text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter student name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                defaultValue={student.phone ?? ""}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number <span className="text-xs text-gray-500">(optional)</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter student phone number" type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                defaultValue={student.email}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email <span className="text-xs text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter student email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    disabled={isSubmitting}
                                    asChild
                                >
                                    <Link to={`/dashboard/students/${student.id}`}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:text-white"
                                    disabled={isSubmitting || !isThereAnyChanges}
                                >
                                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                                </Button>
                            </div>
                        </fetcher.Form>
                    </Form>
                    <Link to={`/dashboard/students/${student.studentId}/edit/password`}>
                        <Button variant="link" size="sm">
                            Edit Password
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
