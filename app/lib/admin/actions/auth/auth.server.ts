import { desc, eq, inArray } from 'drizzle-orm';
import { data } from "react-router";
import { loginSchema } from "../../zod-schemas/auth";
import authClient from "~/lib/auth-client.server";
import { auth } from "~/lib/auth.server";
import { isStudentAccountActivated } from "~/lib/student/data-access/students.server";
import db from "~/db/index.server";
import { session } from "~/db/schema";

// Admin Login (create first account)
export async function handleSignInAdmin(request: Request, formData: FormData) {
    const loginData = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const unvalidatedFields = loginSchema.safeParse(loginData)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',

    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    try {

        // first time to login / create admins

        // const { headers, response } = await auth.api.signUpEmail({
        //     returnHeaders: true,
        //     body: {
        //         email: validatedFields.email,
        //         password: validatedFields.password,
        //         name: "Stefano",
        //         role: "admin"
        //     }
        // });

        // console.log(headers, response);

        // if (!response.user.id) {
        //     return data({
        //         success: false,
        //         message: "Something went wrong",
        //     }, {
        //         status: 403,
        //     })
        // }

        const { response, headers } = await auth.api.signInEmail({
            returnHeaders: true,
            body: {
                email: validatedFields.email,
                password: validatedFields.password,
                callbackURL: `${process.env.BASE_URL}/dashboard`
            }
        });



        return data({
            success: true,
            message: "Admin logged in",
        }, {
            headers
        })

    } catch (error) {
        console.error(`🔴Error signing in admin: ${error}`);
        return data({
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong signing in, try again later',
        }, {
            status: 500,
        })
    }





}
// Student Login (role:student)
export async function handleSignInStudent(request: Request, formData: FormData) {
    const loginData = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const unvalidatedFields = loginSchema.safeParse(loginData)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',

    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    try {

        const { isStudentActivated } = await isStudentAccountActivated(validatedFields.email);

        if (!isStudentActivated) {
            return data({
                success: false,
                message: 'Student account is not activated contact your admin',
            }, {
                status: 403,
            })
        }






        const { response, headers } = await auth.api.signInEmail({
            returnHeaders: true,
            body: {
                email: validatedFields.email,
                password: validatedFields.password,
                callbackURL: `${process.env.BASE_URL}/student/courses`
            }
        });


        const allExisitingSessionForLoggedInUser = await db.select().from(session).where(eq(session.userId, response.user.id)).orderBy(desc(session.createdAt))

        const oldSessionsToDelete = allExisitingSessionForLoggedInUser.slice(1);

        if (oldSessionsToDelete.length > 0) {
            const sessionIdsToDelete = oldSessionsToDelete.map((session) => session.id);

            await db
                .delete(session)
                .where(inArray(session.id, sessionIdsToDelete));
        }

        return data({
            success: true,
            message: "Student logged in",
        }, {
            headers
        })

    } catch (error) {
        console.error(`🔴Error signing in student: ${error}`);
        return data({
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong signing in, try again later',
        }, {
            status: 500,
        })
    }





}