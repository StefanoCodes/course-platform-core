import { isAdminLoggedIn } from "~/lib/supabase-utils.server";

import { data, Link, redirect, useFetcher } from "react-router";
import { GetStudentById } from "~/lib/data-access/students.server";
import type { Route } from "./+types/_dashboard.dashboard.students_.$studentId_.edit_.password";
import type { FetcherResponse } from "~/lib/types";
import { updateStudentPasswordSchema, type UpdateStudentPasswordSchema } from "~/lib/zod-schemas/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FormField, FormItem, FormLabel, Form, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { DialogContent, DialogDescription, DialogHeader } from "~/components/ui/dialog";
import { Dialog } from "~/components/ui/dialog";
import { generateRandomPassword } from "~/lib/utils";

export async function loader({ request, params }: Route.LoaderArgs) {
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



export default function EditPasswordPage({ loaderData }: Route.ComponentProps) {
    const { student } = loaderData;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);
    const fetcher = useFetcher<FetcherResponse>();
    const isSubmitting = fetcher.state === "submitting";
    const form = useForm<UpdateStudentPasswordSchema>({
        resolver: zodResolver(updateStudentPasswordSchema),
        defaultValues: {
            password: "",
        },
    });
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success("Password updated successfully");
                setIsDialogOpen(true);
            }
            if (!fetcher.data.success) {
                toast.error(fetcher.data.message);
                form.reset();
            }
        }
    }, [fetcher.data]);
    useEffect(() => {
        if (hasCopied) {
            toast.success("Copied to clipboard");
            setHasCopied(false);
        }
    }, [hasCopied]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/students/${student.studentId}/edit`}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Student Profile
                    </Link>
                </Button>
            </div>
            <div className="max-w-2xl w-full mx-auto flex flex-col gap-4">
                <Form {...form}>
                    <fetcher.Form className="flex flex-col gap-4" action={`/resource/student`} method="POST" onSubmit={form.handleSubmit((data) => {
                        fetcher.submit({ ...data, intent: "update-student-password", studentId: student.studentId }, {
                            method: "POST",
                            action: `/resource/student`,
                        })
                    })}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col items-start gap-2">
                            <Button type="button" variant="link" onClick={() => {
                                const randomPassword = generateRandomPassword();
                                form.setValue("password", randomPassword);
                            }}>
                                Generate Random Password
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </fetcher.Form>
                    {/* generate random password */}
                </Form>

            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="fle flex-col gap-8">
                    <DialogHeader>
                        New Password
                    </DialogHeader>
                    <DialogDescription className="flex flex-col gap-8">
                        <p className="text-sm text-gray-500">Password: {form.getValues("password")}</p>
                        <Button variant={"outline"} className="cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText(`Password: ${form.getValues("password")}`);
                            setHasCopied(true);
                            setIsDialogOpen(false);
                        }}>Copy to Clipboard</Button>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}
