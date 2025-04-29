import { data } from "react-router";
import { and, eq } from "drizzle-orm";
import { redirect } from "react-router";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";
import { titleToSlug } from "~/lib/utils";
import {
	createSegmentSchema,
	editSegmentSchema,
} from "../../../zod-schemas/segment";
import { getCourseBySlug } from "../../data-access/courses.server";
import { checkSegmentSlugUnique } from "../shared/shared.server";

export async function handleCreateSegment(
	request: Request,
	formData: FormData,
) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const unvalidatedFields = createSegmentSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const { courseSlug, name, description, videoUrl } = unvalidatedFields.data;

	try {
		// check the slug created is unique in all the other courses

		// getting the course where the segment will be created

		const { success: courseResponse, course } = await getCourseBySlug(
			request,
			courseSlug,
		);

		if (!courseResponse || !course) {
			return data(
				{ success: false, message: "Course not found" },
				{ status: 404 },
			);
		}

		// convert segment name to slug
		const slug = titleToSlug(name);

		// check the slug created is unique in all the other courses
		const isSlugUnique = await checkSegmentSlugUnique(slug, course.id);
		if (!isSlugUnique) {
			return data(
				{ success: false, message: "a segment with this name already exists" },
				{ status: 400 },
			);
		}

		// insert segment into database

		const [insertedSegment] = await db
			.insert(segmentsTable)
			.values({
				name,
				description,
				videoUrl,
				slug,
				courseId: course.id,
			})
			.returning({
				slug: segmentsTable.slug,
			});

		if (!insertedSegment) {
			return data(
				{ success: false, message: "Failed to create segment" },
				{ status: 500 },
			);
		}

		return data(
			{
				success: true,
				message: "Segment created successfully",
				segmentSlug: insertedSegment.slug,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error creating segment:", error);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}
export async function handleEditSegment(request: Request, formData: FormData) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const existingSlug = formData.get("segmentSlug");

	if (!existingSlug || typeof existingSlug !== "string") {
		return data(
			{ success: false, message: "Slug is required" },
			{ status: 400 },
		);
	}

	// validation
	const unvalidatedFields = editSegmentSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unvalidatedFields.data;

	try {
		// getting the course where the segment is being edited into
		const { success: courseResponse, course } = await getCourseBySlug(
			request,
			validatedFields.courseSlug,
		);

		if (!courseResponse || !course) {
			return data(
				{ success: false, message: "Course not found" },
				{ status: 404 },
			);
		}

		// check the slug created is unique in all the other courses
		const slug = titleToSlug(validatedFields.name);
		const isSlugUnique = await checkSegmentSlugUnique(
			slug,
			course.id,
			validatedFields.segmentSlug,
		);

		if (!isSlugUnique) {
			return data(
				{ success: false, message: "a segment with this name already exists" },
				{ status: 400 },
			);
		}
		// db mutation
		const [updatedSegment] = await db
			.update(segmentsTable)
			.set({
				name: validatedFields.name,
				description: validatedFields.description,
				videoUrl: validatedFields.videoUrl,
				slug,
			})
			.where(
				and(
					eq(segmentsTable.slug, existingSlug),
					eq(segmentsTable.courseId, course.id),
				),
			)
			.returning({
				slug: segmentsTable.slug,
			});

		if (!updatedSegment) {
			return data(
				{ success: false, message: "Failed to update segment" },
				{ status: 500 },
			);
		}
		return data(
			{
				success: true,
				message: "Segment updated successfully",
				redirectTo: updatedSegment.slug,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating segment:", error);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}
export async function handleDeleteSegment(
	request: Request,
	formData: FormData,
) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const segmentId = formData.get("id") as string;
	const courseSlug = formData.get("courseSlug") as string;

	if (!segmentId || !courseSlug) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	try {
		// getting the course where the segment is being deleted from
		const { success: courseResponse, course } = await getCourseBySlug(
			request,
			courseSlug,
		);

		if (!courseResponse || !course) {
			return data(
				{ success: false, message: "Course not found" },
				{ status: 404 },
			);
		}
		// db mutation
		await db
			.delete(segmentsTable)
			.where(
				and(
					eq(segmentsTable.id, segmentId),
					eq(segmentsTable.courseId, course.id),
				),
			);
		return data(
			{ success: true, message: "Segment deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"Error deleting segment:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}
export async function handleMakeSegmentPrivate(
	request: Request,
	formData: FormData,
) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const segmentId = formData.get("id") as string;
	const courseSlug = formData.get("courseSlug") as string;

	if (!segmentId || !courseSlug) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	try {
		// getting the course where the segment is being made private into
		const { success: courseSuccess, course } = await getCourseBySlug(
			request,
			courseSlug,
		);

		if (!courseSuccess || !course) {
			return data(
				{ success: false, message: "Course not found" },
				{ status: 404 },
			);
		}
		// db mutation
		await db
			.update(segmentsTable)
			.set({
				isPublic: false,
			})
			.where(
				and(
					eq(segmentsTable.id, segmentId),
					eq(segmentsTable.courseId, course.id),
				),
			);
		return data(
			{ success: true, message: "Segment made private successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"Error making segment private:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}
export async function handleMakeSegmentPublic(
	request: Request,
	formData: FormData,
) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const segmentId = formData.get("id") as string;
	const courseSlug = formData.get("courseSlug") as string;

	if (!segmentId || !courseSlug) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	try {
		// getting the course where the segment is being made public in
		const { success: courseSuccess, course } = await getCourseBySlug(
			request,
			courseSlug,
		);

		if (!courseSuccess || !course) {
			return data(
				{ success: false, message: "Course not found" },
				{ status: 404 },
			);
		}
		// db mutation
		await db
			.update(segmentsTable)
			.set({
				isPublic: true,
			})
			.where(
				and(
					eq(segmentsTable.id, segmentId),
					eq(segmentsTable.courseId, course.id),
				),
			);
		return data(
			{ success: true, message: "Segment made public successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"Error making segment public:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}
