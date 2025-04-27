import { eq } from "drizzle-orm";
import { data } from "react-router";
import db from "~/db/index.server";
import {
	account,
	coursesTable,
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
import bcrypt from "bcrypt";

export async function handleCreateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);

	if (!isLoggedIn) {
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
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
	const [potentialStudent] = await db
		.select()
		.from(studentsTable)
		.where(eq(studentsTable.email, validatedFields.email))
		.limit(1);

	if (potentialStudent) {
		return data(
			{ success: false, message: "Email already in use" },
			{ status: 400 },
		);
	}

	try {
		// transaction to ensure that the student is created in the db and the auth session is created
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

			const hashedPassword = await bcrypt.hash(validatedFields.password, 10);
			// insert into students table
			const [insertedStudent] = await tx
				.insert(studentsTable)
				.values({
					name: validatedFields.name,
					email: validatedFields.email,
					phone: validatedFields.phoneNumber,
					password: hashedPassword,
					studentId: user.id,
				})
				.returning({
					id: studentsTable.studentId,
				});

			if (!insertedStudent) {
				throw new Error("Something went wrong");
			}

			// insert into studentCoursesTable
			console.log(coursesArray.length, "coursesArray");
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
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
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
			await auth.api.removeUser({
				body: {
					userId: studentId,
				},
			});
		});

		return data(
			{ success: true, message: "Student deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error deleting student:", error);
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
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
	}
	const { studentId } = Object.fromEntries(formData);

	if (!studentId) {
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
			.where(eq(studentsTable.studentId, studentId as string))
			.returning({
				studentId: studentsTable.studentId,
			});

		if (!updatedStudent) {
			throw new Error("Something went wrong");
		}

		return data(
			{ success: true, message: "Student activated successfully" },
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

export async function handleDeactivateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
	}

	const { studentId } = Object.fromEntries(formData);

	if (!studentId) {
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
			.where(eq(studentsTable.studentId, studentId as string))
			.returning({
				id: studentsTable.id,
			});

		if (!updatedStudent) {
			throw new Error("Something went wrong");
		}

		return data(
			{ success: true, message: "Student deactivated successfully" },
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

export async function handleUpdateStudent(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
	}

	const { studentId, name, email, phoneNumber } = Object.fromEntries(formData);

	if (!studentId) {
		return data(
			{ success: false, message: "Student ID is required" },
			{ status: 400 },
		);
	}

	// validate the data using updateStudentSchema
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
		// updated in the better auth tables
		// Update student in the database
		const [updatedStudent] = await db
			.update(studentsTable)
			.set({
				name: validatedFields.name,
				email: validatedFields.email,
				phone: validatedFields.phoneNumber,
			})
			.where(eq(studentsTable.studentId, studentId as string))
			.returning({
				studentId: studentsTable.studentId,
			});

		if (!updatedStudent.studentId) {
			throw new Error("Failed to update student");
		}
		return data(
			{ success: true, message: "Student updated successfully" },
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

export async function handleUpdateStudentPassword(
	request: Request,
	formData: FormData,
) {
	// admin auth check
	const { isLoggedIn } = await isAdminLoggedIn(request);
	if (!isLoggedIn) {
		return data({ success: false, message: "Unauthorized" }, { status: 401 });
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
			const [updatedStudent] = await tx
				.update(studentsTable)
				.set({
					password: hash,
				})
				.where(eq(studentsTable.studentId, studentId))
				.returning({
					studentId: studentsTable.studentId,
				});
			if (!updatedStudent) {
				throw new Error("Failed to update password");
			}
		});
		return data(
			{ success: true, message: "Password updated successfully" },
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
