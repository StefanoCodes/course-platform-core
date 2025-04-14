import { eq } from 'drizzle-orm';
import { data } from "react-router";
import db from "~/db/index.server";
import { studentsTable } from '~/db/schema';
import { createStudentSchema, updateStudentSchema } from "~/lib/admin/zod-schemas/student";
import { auth, isAdminLoggedIn } from '~/lib/auth.server';
import bcrypt from "bcrypt"

export async function handleCreateStudent(request: Request, formData: FormData) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { name, email, phoneNumber, password } = Object.fromEntries(formData);
    // validate the data
    const unvalidatedFields = createStudentSchema.safeParse({ name, email, phoneNumber, password })

    if (!unvalidatedFields.success) {
        return data({ success: false, message: "Invalid form data" }, { status: 400 })
    }


    const validatedFields = unvalidatedFields.data
    // check if the email is already in use
    const [potentialStudent] = await db.select().from(studentsTable).where(eq(studentsTable.email, validatedFields.email)).limit(1)

    if (potentialStudent) {
        return data({ success: false, message: "Email already in use" }, { status: 400 })
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
                    role: "user"
                }
            })



            const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

            const [insertedStudent] = await db.insert(studentsTable).values({
                name: validatedFields.name,
                email: validatedFields.email,
                phone: validatedFields.phoneNumber,
                password: hashedPassword,
                studentId: user.id
            }).returning({
                id: studentsTable.id,
            })

            if (!insertedStudent) {
                throw new Error("Something went wrong")
            }

            // TODO: assign student to all courses that are existing & are public
        })

        return data({ success: true, message: "Student created successfully" }, { status: 200 })
    } catch (error) {
        return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
    }

}

export async function handleActivateStudent(request: Request, formData: FormData) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    const { studentId } = Object.fromEntries(formData);

    if (!studentId) {
        return data({ success: false, message: "Student ID is required" }, { status: 400 })
    }

    try {
        const [updatedStudent] = await db.update(studentsTable).set({
            isActivated: true
        }).where(eq(studentsTable.studentId, studentId as string)).returning({
            studentId: studentsTable.studentId
        })

        if (!updatedStudent) {
            throw new Error("Something went wrong")
        }

        return data({ success: true, message: "Student activated successfully" }, { status: 200 })
    } catch (error) {
        return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
    }
}

export async function handleDeactivateStudent(request: Request, formData: FormData) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { studentId } = Object.fromEntries(formData);

    if (!studentId) {
        return data({ success: false, message: "Student ID is required" }, { status: 400 })
    }

    try {
        const [updatedStudent] = await db.update(studentsTable).set({
            isActivated: false
        }).where(eq(studentsTable.studentId, studentId as string)).returning({
            id: studentsTable.id
        })

        if (!updatedStudent) {
            throw new Error("Something went wrong")
        }

        // TODO: Logout user out all existing sessions using supabase (sort of like banning them)


        return data({ success: true, message: "Student deactivated successfully" }, { status: 200 })
    } catch (error) {
        return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
    }
}

export async function handleUpdateStudent(request: Request, formData: FormData) {
    // admin auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { studentId, name, email, phoneNumber } = Object.fromEntries(formData);

    if (!studentId) {
        return data({ success: false, message: "Student ID is required" }, { status: 400 })
    }

    // validate the data using updateStudentSchema
    const unvalidatedFields = updateStudentSchema.safeParse({ name, email, phoneNumber })

    if (!unvalidatedFields.success) {
        return data({ success: false, message: "Invalid form data" }, { status: 400 })
    }

    const validatedFields = unvalidatedFields.data

    // Check if email is already in use by another student
    const [alreadyExistingStudent] = await db.select().from(studentsTable).where(eq(studentsTable.email, validatedFields.email)).limit(1)

    if (alreadyExistingStudent && alreadyExistingStudent.studentId !== studentId) {
        return data({ success: false, message: "Email already in use by another student" }, { status: 400 })
    }
    // at this point it means we can change the email since there is not a student with it already
    const [existingStudent] = await db.select().from(studentsTable).where(eq(studentsTable.studentId, studentId as string)).limit(1)

    const isEmailChanged = existingStudent.email !== validatedFields.email;



    try {

        // Update email if it has changed since attahed to supabase auth
        if (isEmailChanged) {
            // const { success } = await UpdateEmail(request, validatedFields.email, studentId as string)
            // if (!success) {
            //     return data({ success: false, message: "Failed to update email" }, { status: 500 })
            // }
        }

        // Update student in the database
        const [updatedStudent] = await db.update(studentsTable)
            .set({
                name: validatedFields.name,
                phone: validatedFields.phoneNumber,
                updatedAt: new Date()
            })
            .where(eq(studentsTable.studentId, studentId as string))
            .returning({
                studentId: studentsTable.studentId
            });

        if (!updatedStudent) {
            throw new Error("Failed to update student")
        }
        return data({ success: true, message: "Student updated successfully" }, { status: 200 })
    } catch (error) {
        return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
    }
}

// export async function handleUpdateStudentPassword(request: Request, formData: FormData) {
//     // admin auth check
//     const { isLoggedIn } = await isAdminLoggedIn(request);
//     if (!isLoggedIn) {
//         return data({ success: false, message: "Unauthorized" }, { status: 401 })
//     }
//     const { studentId, password } = Object.fromEntries(formData);
//     if (!studentId || typeof studentId !== "string") {
//         return data({ success: false, message: "Student ID is required" }, { status: 400 })
//     }
//     const unvalidatedFields = updateStudentPasswordSchema.safeParse({ password })
//     if (!unvalidatedFields.success) {
//         return data({ success: false, message: "Invalid form data" }, { status: 400 })
//     }
//     const validatedFields = unvalidatedFields.data
//     const { client } = createSupabaseAdminClient(request);
//     try {
//         // update password in supabase admin client
//         await db.transaction(async (tx) => {
//             const { data: updatedUser, error } = await client.auth.admin.updateUserById(studentId, {
//                 password: validatedFields.password,
//             });
//             if (error) {
//                 throw new Error(error.message)
//             }
//             if (!updatedUser) {
//                 throw new Error("Failed to update password")
//             }

//             // update password in the database
//             const hashedPassword = await bcrypt.hash(validatedFields.password, 10);
//             const [updatedStudent] = await tx.update(studentsTable).set({
//                 password: hashedPassword,
//             }).where(eq(studentsTable.studentId, studentId)).returning({
//                 studentId: studentsTable.studentId
//             })
//             if (!updatedStudent) {
//                 throw new Error("Failed to update password")
//             }
//             // TODO: check if we need to logout them out ?
//         })
//         return data({ success: true, message: "Password updated successfully" }, { status: 200 })
//     } catch (error) {
//         return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
//     }
// }

// async function UpdateEmail(request: Request, email: string, studentId: string) {
//     const { client } = createSupabaseAdminClient(request);

//     const { data, error } = await client.auth.admin.updateUserById(studentId, {
//         email,
//     });
//     if (error) {
//         console.error(`Error updating email:`, error)
//         return {
//             success: false,
//         }
//     }
//     try {
//         await db.update(studentsTable).set({
//             email,
//         }).where(eq(studentsTable.studentId, studentId))
//         return {
//             success: true,
//         }
//     } catch (e) {
//         console.error(`Error updating user email:`, e)
//         return {
//             success: false
//         }
//     }
// }