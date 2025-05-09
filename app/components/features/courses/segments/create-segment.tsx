import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { redirect, useFetcher, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PrimaryButton from "~/components/global/brand/primary-button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { FetcherResponse } from "~/lib/types";
import {
	createSegmentSchema,
	type CreateSegmentSchema,
} from "~/lib/zod-schemas/segment";

type CreateSegmentFetcherResponse = FetcherResponse & {
	segmentSlug: string;
};
export function CreateSegment() {
	const { slug: courseSlug } = useParams();
	if (!courseSlug) throw redirect("/dashboard/courses");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const fetcher = useFetcher<CreateSegmentFetcherResponse>();
	const isSubmitting = fetcher.state === "submitting";
	const navigate = useNavigate();
	const form = useForm<CreateSegmentSchema>({
		resolver: zodResolver(createSegmentSchema),
		defaultValues: {
			name: "",
			description: "",
			videoUrl: "",
		},
	});

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.success) {
				toast.success(fetcher.data.message);
				if (fetcher.data.segmentSlug) {
					navigate(
						`/dashboard/courses/${courseSlug}/${fetcher.data.segmentSlug}`
					);
				}
			}
			if (!fetcher.data.success) {
				toast.error(fetcher.data.message);
			}
		}
	}, [fetcher.data, courseSlug, navigate]);
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<PrimaryButton>Add Segment</PrimaryButton>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-8">
				<DialogHeader>
					<DialogTitle>Create Video</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<fetcher.Form
						method="POST"
						action="/resource/segment"
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit((data) => {
							fetcher.submit(
								{ ...data, intent: "create-segment" },
								{
									action: "/resource/segment",
									method: "POST",
								}
							);
						})}
					>
						<FormField
							control={form.control}
							name="name"
							disabled={isSubmitting}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Name <span className="text-xs text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter lesson name"
											type="text"
											className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
											{...field}
										/>
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
									<FormLabel>
										Description <span className="text-xs text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter segment description"
											className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="videoUrl"
							disabled={isSubmitting}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Video URL <span className="text-xs text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter video URL"
											type="text"
											className="bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="courseSlug"
							defaultValue={courseSlug}
							disabled={isSubmitting}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input hidden {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<PrimaryButton type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating Lesson..." : "Create Lesson"}
						</PrimaryButton>
					</fetcher.Form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
