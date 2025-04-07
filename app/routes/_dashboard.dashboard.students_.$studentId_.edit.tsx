import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { data, Link, redirect, useFetcher, useNavigation } from "react-router";
import { toast } from "sonner";
import { ProfileSkeleton } from "~/components/features/loading/dashboard-skeleton";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { GetStudentById } from "~/lib/data-access/students.server";
import type { FetcherResponse } from "~/lib/types";
import { updateStudentSchema, type UpdateStudentSchema } from "~/lib/zod-schemas/student";
import type { Route } from "./+types/_dashboard.dashboard.students_.$studentId_.edit";

export async function loader({ request, params }: Route.LoaderArgs) {
    const { studentId } = params;
    if (!studentId) throw redirect("/dashboard/students")
    const { success, student } = await GetStudentById(request, studentId)
    if (!success || !student) throw redirect("/dashboard/students")
    return data({ success: true, student }, { status: 200 })
}

export default function EditStudentPage() {
    const fetcher = useFetcher<{ student: any }>();
    const updateFetcher = useFetcher<FetcherResponse>();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading' || fetcher.state === 'loading';
    const isSubmitting = updateFetcher.state === "submitting";

    useEffect(() => {
        if (fetcher.state === 'idle' && !fetcher.data) {
            fetcher.load(`/dashboard/students/${location.pathname.split('/')[3]}`);
        }
    }, [fetcher]);

    const student = fetcher.data?.student;

    const form = useForm<UpdateStudentSchema>({
        resolver: zodResolver(updateStudentSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        if (student) {
            form.reset({
                name: student.name,
                email: student.email,
                phoneNumber: student.phone || "",
            });
        }
    }, [student, form]);

    useEffect(() => {
        if (updateFetcher.data) {
            if (updateFetcher.data.success) {
                toast.success(updateFetcher.data.message);
                // Redirect back to student profile after successful update
                setTimeout(() => {
                    window.location.href = `/dashboard/students/${student.id}`;
                }, 1500);
            } if (!updateFetcher.data.success) {
                toast.error(updateFetcher.data.message);
            }
        }
    }, [updateFetcher.data, student]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/students/${student.id}`}>
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
                        <updateFetcher.Form
                            method="POST"
                            action="/resource/student"
                            className="flex flex-col gap-4"
                            onSubmit={form.handleSubmit((data) => {
                                updateFetcher.submit({
                                    ...data,
                                    studentId: student.id,
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                                </Button>
                            </div>
                        </updateFetcher.Form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
