import { and, eq } from "drizzle-orm";
import { data, redirect } from "react-router";
import db from "~/db/index.server";
import { coursesTable, segmentsTable, studentCoursesTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/auth/auth.server";
import { titleToSlug } from "~/lib/utils";
import {
	assignCourseSchema,
	createCourseSchema,
	updateCourseSchema,
} from "../../../zod-schemas/course";
import { checkCourseSlugUnique } from "../shared/shared.server";

export async function handleCreateCourse(request: Request, formData: FormData) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const studentsIds = (formData.get("students") as string).split(",");
	const formDataObject = {
		name: formData.get("name"),
		description: formData.get("description"),
		students: studentsIds,
	};
	const unvalidatedFields = createCourseSchema.safeParse(formDataObject);
	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unvalidatedFields.data;

	try {
		const slug = titleToSlug(validatedFields.name);
		// check the slug created is unique in all the other courses
		const isSlugUnique = await checkCourseSlugUnique(slug);
		if (!isSlugUnique) {
			return data(
				{ success: false, message: "a course with this name already exists" },
				{ status: 400 },
			);
		}
		const { slug: redirectToUrl } = await db.transaction(async (tx) => {
			const [insertedCourse] = await tx
				.insert(coursesTable)
				.values({
					name: validatedFields.name,
					description: validatedFields.description,
					slug: slug,
				})
				.returning({
					id: coursesTable.id,
				});

			// insert all the studentids + courseId in the studentCoursesTable so they are assigned to this course

			const valuesToInsert = validatedFields.students.map((student) => ({
				studentId: student,
				courseId: insertedCourse.id,
			}));

			await tx.insert(studentCoursesTable).values(valuesToInsert);
			return { slug };
		});
		return data(
			{
				success: true,
				message: "Course created successfully",
				courseSlug: redirectToUrl,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function handleEditCourse(request: Request, formData: FormData) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const courseId = formData.get("id") as string;
	const slug = formData.get("slug") as string;

	if (!courseId) {
		return data(
			{ success: false, message: "Course ID is required" },
			{ status: 400 },
		);
	}

	if (!slug) {
		return data(
			{ success: false, message: "Slug is required" },
			{ status: 400 },
		);
	}

	// validate the form data
	const unavlidatedFields = updateCourseSchema.safeParse(
		Object.fromEntries(formData),
	);

	if (!unavlidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unavlidatedFields.data;

	// check if the slug is unique
	const newSlug = titleToSlug(validatedFields.name);
	const currentSlug = slug;

	// Only check uniqueness if the slug would actually change
	try {
		if (newSlug !== currentSlug) {
			const isSlugUnique = await checkCourseSlugUnique(newSlug);
			if (!isSlugUnique) {
				return data(
					{ success: false, message: "a course with this name already exists" },
					{ status: 400 },
				);
			}
		}

		// update the course
		const [updatedCourse] = await db
			.update(coursesTable)
			.set({
				name: validatedFields.name,
				description: validatedFields.description,
				slug: newSlug,
			})
			.where(eq(coursesTable.id, courseId))
			.returning({
				slug: coursesTable.slug,
			});

		if (!updatedCourse) {
			return data(
				{ success: false, message: "Failed to update course" },
				{ status: 500 },
			);
		}

		return data(
			{
				success: true,
				message: "Course updated successfully",
				courseSlug: updatedCourse.slug,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error updating course details:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function handleDeleteCourse(request: Request, formData: FormData) {
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const courseId = formData.get("courseId") as string;

	if (!courseId) {
		return data(
			{ success: false, message: "Course ID is required" },
			{ status: 400 },
		);
	}

	try {
		await db
			.delete(studentCoursesTable)
			.where(eq(studentCoursesTable.courseId, courseId));
		await db.delete(segmentsTable).where(eq(segmentsTable.courseId, courseId));
		await db.delete(coursesTable).where(eq(coursesTable.id, courseId));

		return data(
			{ success: true, message: "Course deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error Deleting course:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function handleMakePublic(request: Request, formData: FormData) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const courseId = formData.get("courseId") as string;

	if (!courseId) {
		return data(
			{ success: false, message: "Course ID is required" },
			{ status: 400 },
		);
	}

	try {
		const [updatedCourse] = await db
			.update(coursesTable)
			.set({
				isPublic: true,
			})
			.where(eq(coursesTable.id, courseId))
			.returning({
				slug: coursesTable.slug,
			});

		if (!updatedCourse) {
			return data(
				{ success: false, message: "Failed to make course public" },
				{ status: 500 },
			);
		}

		return data(
			{
				success: true,
				message: "Course made public successfully",
				courseSlug: updatedCourse.slug,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error updating the course status to public:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function handleMakePrivate(request: Request, formData: FormData) {
	// auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const courseId = formData.get("courseId") as string;

	if (!courseId) {
		return data(
			{ success: false, message: "Course ID is required" },
			{ status: 400 },
		);
	}

	try {
		const [updatedCourse] = await db
			.update(coursesTable)
			.set({
				isPublic: false,
			})
			.where(eq(coursesTable.id, courseId))
			.returning({
				slug: coursesTable.slug,
			});

		if (!updatedCourse) {
			return data(
				{ success: false, message: "Failed to make course private" },
				{ status: 500 },
			);
		}

		return data(
			{
				success: true,
				message: "Course made private successfully",
				courseSlug: updatedCourse.slug,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error changing course status to private:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

export async function handleUpdateCourseAssignment(
	request: Request,
	formData: FormData,
) {
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const isAssigned = formData.get("isAssigned") === "true";
	const studentId = formData.get("studentId");
	const courseId = formData.get("courseId");

	const formDataObject = {
		isAssigned,
		studentId,
		courseId,
	};
	const unavlidatedFields = assignCourseSchema.safeParse(formDataObject);

	if (!unavlidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unavlidatedFields.data;

	try {
		// if we are setting the value to true then we create an entry in the studentCourseTable
		if (validatedFields.isAssigned) {
			const [insertedStudentCourseAssignment] = await db
				.insert(studentCoursesTable)
				.values({
					studentId: validatedFields.studentId,
					courseId: validatedFields.courseId,
				})
				.returning({
					id: studentCoursesTable.id,
				});
			if (!insertedStudentCourseAssignment) {
				return data(
					{
						success: false,
						message:
							"Something went wrong inserting a new student course in the student course table",
					},
					{ status: 400 },
				);
			}

			return data({ success: true, message: "Success" }, { status: 200 });
		}

		// if false then we delete the entry in the studentCourseTable
		if (!validatedFields.isAssigned) {
			await db
				.delete(studentCoursesTable)
				.where(
					and(
						eq(studentCoursesTable.studentId, validatedFields.studentId),
						eq(studentCoursesTable.courseId, validatedFields.courseId),
					),
				);
			return data({ success: true, message: "Success" }, { status: 200 });
		}
	} catch (error) {
		console.error(
			"Error updating student course assignment",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
	}
}
