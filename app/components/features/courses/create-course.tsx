import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { FetcherResponse } from "~/lib/types";
import { createCourseSchema, type CreateCourseSchema } from "~/lib/zod-schemas/course";
type CreateCourseFetcherResponse = FetcherResponse & {
    courseSlug: string;
}
export function CreateCourse() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fetcher = useFetcher<CreateCourseFetcherResponse>();
    const isSubmitting = fetcher.state === "submitting";
    const navigate = useNavigate();
    const form = useForm<CreateCourseSchema>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success(fetcher.data.message)
                if (fetcher.data.courseSlug) {
                    navigate(`/dashboard/courses/${fetcher.data.courseSlug}`)
                }
            } if (!fetcher.data.success) {
                toast.error(fetcher.data.message)
            }
        }
    }, [fetcher.data])
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:text-white">Add Course</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-8">
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <fetcher.Form method="POST" action="/resource/student" className="flex flex-col gap-4" onSubmit={form.handleSubmit((data) => {
                        fetcher.submit({ ...data, intent: "create-course" }, {
                            action: "/resource/course",
                            method: "POST"
                        })
                    })}>
                        <FormField
                            control={form.control}
                            name="name"
                            disabled={isSubmitting}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-xs text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter course name" type="text" className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            disabled={isSubmitting}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description <span className="text-xs text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter course description" className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
                        <Button type="submit" className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:text-white" disabled={isSubmitting}>{isSubmitting ? "Creating Course..." : "Create Course"}</Button>
                    </fetcher.Form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
