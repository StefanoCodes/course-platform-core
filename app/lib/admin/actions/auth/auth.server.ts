import { data } from "react-router";
import { createSupabaseServerClient } from '~/db/supabase/server';
import { loginSchema } from "~/lib/admin/zod-schemas/auth";
import { isStudentAccountActivated } from "~/lib/student/data-access/students.server";

// SIGN IN AN ADMIN LOGIC
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
        const { client, headers } = createSupabaseServerClient(request);

        const { data: LoginResponse, error } = await client.auth.signInWithPassword({
            email: validatedFields.email,
            password: validatedFields.password,
        });

        if (error) {
            return data({
                success: false,
                message: error.message,

            }, {
                status: 403,
            })
        }

        const { user } = LoginResponse;

        if (!user)
            return data({
                success: false,
                message: "User not found",

            }, {
                status: 403,
            })
        return data({
            success: true,
            message: 'Admin Logged In',

        }, {
            headers: headers
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

// SIGN IN A STUDENT LOGIC

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

        const { client, headers } = createSupabaseServerClient(request);

        // check if the student is activated or not first incase their account is not activated
        const { isStudentActivated } = await isStudentAccountActivated(validatedFields.email);

        if (!isStudentActivated) {
            return data({
                success: false,
                message: 'Student account is not activated contact your admin',
            }, {
                status: 403,
            })
        }

        const { data: LoginResponse, error } = await client.auth.signInWithPassword({
            email: validatedFields.email,
            password: validatedFields.password,
        });

        if (error) {
            return data({
                success: false,
                message: error.message,

            }, {
                status: 403,
            })
        }

        const { user } = LoginResponse;

        if (!user)
            return data({
                success: false,
                message: "User not found",

            }, {
                status: 403,
            })
        return data({
            success: true,
            message: 'Student Logged In',

        }, {
            headers: headers
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

// SIGN OUT A USER LOGIC

export async function handleSignOut(request: Request) {
    const { client, headers } = createSupabaseServerClient(request);
    const { error } = await client.auth.signOut();
    if (error) {
        return data({
            success: false,
            message: 'Something went wrong signing out, try again later',
        }, {
            status: 500,
        })
    }

    return data({
        success: true,
        message: 'Logged out',

    }, {
        headers: headers
    })

}



// SIGN UP AN ADMIN LOGIC


// just used to create the admin account for the first time

// const { data: registerData, error: registerError } =
//     await client.auth.signUp({
//         email: validatedFields.email,
//         password: validatedFields.password,
// });

// if (registerError) {
//     return {
//         success: false,
//         message: registerError.message,
//         inputs: loginData,
//     };
// }

// if (!registerData.user?.id) {
//     return {
//         success: false,
//         message: "Something went wrong",
//     };
// }

// const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

// // insert admin into admin table + roles table
// const [insertedAdminResponse] = await db.insert(adminsTable).values({
//     email: validatedFields.email,
//     password: hashedPassword,
//     adminId: registerData.user.id,
//     name: "Admin",
// }).returning({
//     id: adminsTable.id
// })

// if (!insertedAdminResponse.id) {
//     console.error(`🔴Error inserting admin into admins table`)
//     return {
//         success: false,
//         message: "Something Went Wrong"
//     }
// }

// const [insertedAdminIntoRoleTableResponse] = await db.insert(rolesTable).values({
//     adminId: registerData.user.id,
// }).returning({
//     id: rolesTable.id
// })

// if (!insertedAdminIntoRoleTableResponse.id) {
//     console.error(`🔴Error inserting admin into roles table`)
//     return {
//         success: false,
//         message: "Something Went Wrong"
//     }
// }