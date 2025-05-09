import { desc, eq, inArray } from "drizzle-orm";
import { data } from "react-router";
import db from "~/db/index.server";
import { session, user } from "~/db/schema";
import { auth } from "~/lib/auth/auth.server";
import { isStudentAccountActivated } from "~/lib/student/data-access/students.server";
import { loginSchema } from "../../../zod-schemas/auth";

// Admin Login
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
		// [insert for first time admin creations]

		// await auth.api.signUpEmail({
		// 	returnHeaders: true,
		// 	body: {
		// 		email: validatedFields.email,
		// 		password: validatedFields.password,
		// 		role: "admin",
		// 		name: "Admin",
		// 	},
		// });

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

		const { success } = await LogUserOutOfAllSessionsExceptMostActiveOne(
			response.user.id,
		);
		if (!success) {
			throw new Error("Error logging out user from all sessions");
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
// Logout user from all sessions except the new one
export async function LogUserOutOfAllSessionsExceptMostActiveOne(
	userId: string,
) {
	try {
		const allExisitingSessionForLoggedInUser = await db
			.select()
			.from(session)
			.where(eq(session.userId, userId))
			.orderBy(desc(session.createdAt));
		const oldSessionsToDelete = allExisitingSessionForLoggedInUser.slice(1);

		if (oldSessionsToDelete.length > 0) {
			const sessionIdsToDelete = oldSessionsToDelete.map(
				(session) => session.id,
			);
			await db.delete(session).where(inArray(session.id, sessionIdsToDelete));
		}
		return {
			success: true,
		};
	} catch (error) {
		console.error("🔴Error logging out user from all sessions", error);
		return { success: false };
	}
}

export async function DeleteAllExistingAuthSessions(userId: string) {
	try {
		await db.delete(session).where(eq(session.userId, userId));
	} catch (error) {
		console.error(
			"🔴Error deleting all existing user auth sessions:",
			error instanceof Error ? error.message : error,
		);
		return data(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{
				status: 500,
			},
		);
	}
}
