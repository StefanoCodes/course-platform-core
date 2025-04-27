import { desc, eq, inArray } from "drizzle-orm";
import { data } from "react-router";
import db from "~/db/index.server";
import { session, user } from "~/db/schema";
import { auth } from "~/lib/auth/auth.server";
import { isStudentAccountActivated } from "~/lib/student/data-access/students.server";
import { loginSchema } from "../../../zod-schemas/auth";

// Admin Login (create first account)
export async function handleSignInAdmin(request: Request, formData: FormData) {
	const loginData = {
		email: formData.get("email"),
		password: formData.get("password"),
	};
	const unvalidatedFields = loginSchema.safeParse(loginData);
	if (!unvalidatedFields.success)
		return data(
			{
				success: false,
				message: "Invalid Fields",
			},
			{
				status: 403,
			},
		);
	const validatedFields = unvalidatedFields.data;

	try {
		const { response, headers } = await auth.api.signInEmail({
			returnHeaders: true,
			body: {
				email: validatedFields.email,
				password: validatedFields.password,
				callbackURL: `${process.env.BASE_URL}/dashboard`,
			},
		});

		const [signedInUser] = await db
			.select()
			.from(user)
			.where(eq(user.id, response.user.id))
			.limit(1);

		if (signedInUser.role !== "admin") {
			return data(
				{
					success: false,
					message: "Not Allowed",
					redirectTo: "/login",
				},
				{ status: 403 },
			);
		}

		return data(
			{
				success: true,
				message: "Admin logged in",
			},
			{
				headers,
			},
		);
	} catch (error) {
		console.error(`🔴Error signing in admin: ${error}`);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Something went wrong signing in, try again later",
			},
			{
				status: 500,
			},
		);
	}
}
// Student Login (role:student)
export async function handleSignInStudent(
	request: Request,
	formData: FormData,
) {
	const loginData = {
		email: formData.get("email"),
		password: formData.get("password"),
	};
	const unvalidatedFields = loginSchema.safeParse(loginData);
	if (!unvalidatedFields.success)
		return data(
			{
				success: false,
				message: "Invalid Fields",
			},
			{
				status: 403,
			},
		);
	const validatedFields = unvalidatedFields.data;

	try {
		const { response, headers } = await auth.api.signInEmail({
			returnHeaders: true,
			body: {
				email: validatedFields.email,
				password: validatedFields.password,
				callbackURL: `${process.env.BASE_URL}/student/courses`,
			},
		});

		const { isStudentActivated } = await isStudentAccountActivated(
			validatedFields.email,
		);

		if (!isStudentActivated) {
			return data(
				{
					success: false,
					message: "Student account is not activated contact your admin",
				},
				{
					status: 403,
				},
			);
		}

		const [signedInUser] = await db
			.select()
			.from(user)
			.where(eq(user.id, response.user.id))
			.limit(1);

		if (signedInUser.role === "admin") {
			return data(
				{
					success: false,
					message: "Not Allowed",
					redirectTo: "/admin/login",
				},
				{ status: 403 },
			);
		}

		const allExisitingSessionForLoggedInUser = await db
			.select()
			.from(session)
			.where(eq(session.userId, response.user.id))
			.orderBy(desc(session.createdAt));

		const oldSessionsToDelete = allExisitingSessionForLoggedInUser.slice(1);

		if (oldSessionsToDelete.length > 0) {
			const sessionIdsToDelete = oldSessionsToDelete.map(
				(session) => session.id,
			);

			await db.delete(session).where(inArray(session.id, sessionIdsToDelete));
		}

		return data(
			{
				success: true,
				message: "Student logged in",
			},
			{
				headers,
			},
		);
	} catch (error) {
		console.error(`🔴Error signing in student: ${error}`);
		return data(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Something went wrong signing in, try again later",
			},
			{
				status: 500,
			},
		);
	}
}
