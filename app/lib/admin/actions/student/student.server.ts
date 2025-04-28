import { eq } from "drizzle-orm";
import { data, redirect } from "react-router";
import db from "~/db/index.server";
import {
	account,
	session,
	studentCoursesTable,
	studentsTable,
	user,
} from "~/db/schema";
import {
	createStudentSchema,
	updateStudentPasswordSchema,
	updateStudentSchema,
} from "~/lib/zod-schemas/student";
import { auth, isAdminLoggedIn } from "~/lib/auth/auth.server";
import { DeleteAllExistingAuthSessions } from "../auth/auth.server";

export async function handleCreateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const { name, email, phoneNumber, password } = Object.fromEntries(formData);
	const courses = formData.get("courses") as string;
	const coursesArray = courses.split(",");
	// validate the data
	const unvalidatedFields = createStudentSchema.safeParse({
		name,
		email,
		phoneNumber,
		password,
		courses: coursesArray,
	});

	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unvalidatedFields.data;
	// check if the email is already in use
	const [existingStudent] = await db
		.select()
		.from(studentsTable)
		.where(eq(studentsTable.email, validatedFields.email))
		.limit(1);

	if (existingStudent) {
		return data(
			{ success: false, message: "Email already in use" },
			{ status: 400 },
		);
	}

	try {
		await db.transaction(async (tx) => {
			// create user with better auth
			const { user } = await auth.api.createUser({
				body: {
					email: validatedFields.email,
					password: validatedFields.password,
					name: validatedFields.name,
					role: "user",
				},
			});

			// insert into students table
			const [insertedStudent] = await tx
				.insert(studentsTable)
				.values({
					name: validatedFields.name,
					email: validatedFields.email,
					phone: validatedFields.phoneNumber,
					studentId: user.id,
				})
				.returning({
					id: studentsTable.studentId,
				});

			if (!insertedStudent) {
				throw new Error("Something went wrong");
			}

			// insert into studentCoursesTable (if they have courses assgiend to from the frontend)
			if (coursesArray.length > 1) {
				const valuesToInsert = coursesArray.map((courseId) => ({
					studentId: user.id,
					courseId: courseId,
				}));
				await tx.insert(studentCoursesTable).values(valuesToInsert);
			}
		});

		return data(
			{ success: true, message: "Student created successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}

export async function handleDeleteStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const { studentId } = Object.fromEntries(formData);

	if (!studentId || typeof studentId !== "string") {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}

	// Deleteing their user sessions etc

	try {
		await db.transaction(async (tx) => {
			// erase user data across the system
			await tx.delete(user).where(eq(user.id, studentId));
			await tx.delete(account).where(eq(account.userId, studentId));
			await tx.delete(session).where(eq(session.userId, studentId));
			await tx
				.delete(studentCoursesTable)
				.where(eq(studentCoursesTable.studentId, studentId));
			await tx
				.delete(studentsTable)
				.where(eq(studentsTable.studentId, studentId));
		});

		return data(
			{ success: true, message: "Student deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error deleting student:",
			error instanceof Error && error.message,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}

export async function handleActivateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const { studentId } = Object.fromEntries(formData);

	if (!studentId || typeof studentId !== "string") {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}

	try {
		const [updatedStudent] = await db
			.update(studentsTable)
			.set({
				isActivated: true,
			})
			.where(eq(studentsTable.studentId, studentId))
			.returning({
				studentId: studentsTable.studentId,
			});

		if (!updatedStudent) {
			throw new Error("Something went wrong activating the student");
		}

		return data(
			{ success: true, message: "Student activated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error activating student:",
			error instanceof Error ? error.message : error,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}

export async function handleDeactivateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const { studentId } = Object.fromEntries(formData);

	if (!studentId || typeof studentId !== "string") {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}

	try {
		const [updatedStudent] = await db
			.update(studentsTable)
			.set({
				isActivated: false,
			})
			.where(eq(studentsTable.studentId, studentId))
			.returning({
				id: studentsTable.id,
			});

		if (!updatedStudent) {
			throw new Error("Something went wrong deactivating student");
		}

		return data(
			{ success: true, message: "Student deactivated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error deactivating student:",
			error instanceof Error ? error.message : error,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}

export async function handleUpdateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}

	const { studentId, name, email, phoneNumber } = Object.fromEntries(formData);

	if (!studentId || typeof studentId !== "string") {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}

	const unvalidatedFields = updateStudentSchema.safeParse({
		name,
		email,
		phoneNumber,
	});

	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}

	const validatedFields = unvalidatedFields.data;

	try {
		// get student from db
		const [existingStudent] = await db
			.select({
				email: studentsTable.email,
			})
			.from(studentsTable)
			.where(eq(studentsTable.studentId, studentId));
		await db.transaction(async (tx) => {
			const hasEmailChanged = existingStudent.email !== validatedFields.email;

			if (hasEmailChanged) {
				const [updatedUser] = await tx
					.update(user)
					.set({
						email: validatedFields.email,
					})
					.where(eq(user.id, studentId))
					.returning({ id: user.id });
				const [updatedStudent] = await tx
					.update(studentsTable)
					.set({
						email: validatedFields.email,
					})
					.where(eq(studentsTable.studentId, studentId));

				// logout student of all sessions existing
				await DeleteAllExistingAuthSessions(updatedUser.id);
			}

			if (!hasEmailChanged) {
				const [updatedStudent] = await tx
					.update(studentsTable)
					.set({
						name: validatedFields.name,
						phone: validatedFields.phoneNumber,
					})
					.where(eq(studentsTable.studentId, studentId));
				return data(
					{ success: true, message: "Student updated successfully" },
					{ status: 200 },
				);
			}
		});
		return data(
			{ success: true, message: "Student updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error updating student:",
			error instanceof Error ? error.message : error,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}
export async function handleUpdateStudentPassword(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		throw redirect("/admin/login");
	}
	const { studentId, password } = Object.fromEntries(formData);
	if (!studentId || typeof studentId !== "string") {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}
	const unvalidatedFields = updateStudentPasswordSchema.safeParse({ password });
	if (!unvalidatedFields.success) {
		return data(
			{ success: false, message: "Invalid form data" },
			{ status: 400 },
		);
	}
	const validatedFields = unvalidatedFields.data;
	try {
		// update password in supabase admin client
		await db.transaction(async (tx) => {
			const ctx = await auth.$context;
			const hash = await ctx.password.hash(validatedFields.password);
			await ctx.internalAdapter.updatePassword(studentId, hash);
			await DeleteAllExistingAuthSessions(studentId);
		});

		return data(
			{ success: true, message: "Student's Password updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"🔴Error updating student's password:",
			error instanceof Error ? error.message : error,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 },
		);
	}
}
