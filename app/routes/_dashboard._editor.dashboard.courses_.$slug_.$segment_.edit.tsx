import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, href, redirect, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getSegmentBySlug } from "~/lib/data-access/segments.sever";
import type { FetcherResponse } from "~/lib/types";
import type { EditSegmentSchema } from "~/lib/zod-schemas/segment";
import { editSegmentSchema } from "~/lib/zod-schemas/segment";
import type { Route } from "./+types/_dashboard._editor.dashboard.courses_.$slug_.$segment_.edit";
import { DeleteSegment } from "~/components/features/courses/edit/delete-segment";
import { MarkSegmentAsPrivate } from "~/components/features/courses/edit/mark-segment-as-private";
import { MarkSegmentAsPublic } from "~/components/features/courses/edit/mark-segment-as-public";


export async function loader({ request, params }: Route.LoaderArgs) {
    const { slug: courseSlug, segment } = params;

    // get segment information
    const { success, segment: segmentData } = await getSegmentBySlug(request, segment, courseSlug);
    if (!success || !segmentData) {
        throw redirect("/dashboard/courses")
    }

    return {
        courseSlug,
        segmentData
    }
}

export default function EditSegmentPage({ loaderData }: Route.ComponentProps) {
    const { courseSlug, segmentData } = loaderData;
    const fetcher = useFetcher<FetcherResponse>();
    const navigate = useNavigate();
    const isSubmitting = fetcher.state === "submitting";
    const form = useForm<EditSegmentSchema>({
        resolver: zodResolver(editSegmentSchema),
        defaultValues: {
            name: segmentData.name,
            description: segmentData.description ?? "",
            videoUrl: segmentData.videoUrl,
            courseSlug: courseSlug,
            segmentSlug: segmentData.slug,
        },
    });

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                toast.success(fetcher.data.message);
                navigate(href("/dashboard/courses/:slug/:segment", { segment: segmentData.slug, slug: courseSlug }));
            }
            if (!fetcher.data.success) {
                toast.error(fetcher.data.message);
                form.reset();
            }
        }
    }, [fetcher.data]);

    return (
        <div className="p-4 flex flex-col gap-4">
            {/* Go back to course segment */}
            <Button variant={"link"} asChild>
                <Link to={href("/dashboard/courses/:slug/:segment", { segment: segmentData.slug, slug: courseSlug })}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to segment
                </Link>
            </Button>
            {/* Editing Information */}

            <Card className="max-w-2xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Edit Segment</CardTitle>
                    <CardDescription>Update the segment's information</CardDescription>
                </CardHeader>
                <CardContent className="border-b border-t py-4">
                    <Form {...form}>
                        <fetcher.Form
                            method="POST"
                            action="/resource/segment"
                            className="flex flex-col gap-4"
                            onSubmit={form.handleSubmit((data) => {
                                // if the data is the same just return
                                if (JSON.stringify(data) === JSON.stringify({ name: segmentData.name, description: segmentData.description, videoUrl: segmentData.videoUrl })) {
                                    return;
                                }
                                fetcher.submit({
                                    ...data,
                                    segmentSlug: segmentData.slug,
                                    intent: "edit-segment"
                                }, {
                                    action: "/resource/segment",
                                    method: "POST"
                                });
                            })}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                defaultValue={segmentData.name}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-xs text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter segment name" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                defaultValue={segmentData.description ?? ""}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className="text-xs text-gray-500">(optional)</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter segment description" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                defaultValue={segmentData.videoUrl}
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL <span className="text-xs text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter segment video url" type="text" {...field} />
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
                                    <Link to={href("/dashboard/courses/:slug/:segment", { segment: segmentData.slug, slug: courseSlug })}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-brand-primary text-white cursor-pointer hover:bg-blue-600 hover:text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                                </Button>
                            </div>
                        </fetcher.Form>
                    </Form>
                </CardContent>
                <div className="flex flex-col gap-4 px-4">
                    <h4 className="text-lg">Additional Actions</h4>

                    <div className="flex gap-2 md:flex-row flex-col items-center justify-between">
                        {segmentData.isPublic ? (
                            <MarkSegmentAsPrivate segmentId={segmentData.id} courseSlug={courseSlug} />
                        ) : (
                            <MarkSegmentAsPublic segmentId={segmentData.id} courseSlug={courseSlug} />
                        )}

                        <DeleteSegment segmentId={segmentData.id} courseSlug={courseSlug} />
                    </div>
                </div>
            </Card>
        </div>
    )
}