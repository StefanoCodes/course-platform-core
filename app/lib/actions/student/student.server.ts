import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { data } from "react-router";
import db from "~/db/index.server";
import { createSupabaseServerClient } from '~/db/supabase/server';
import { isAdminLoggedIn } from '~/lib/supabase-utils.server';
import { createStudentSchema, updateStudentSchema } from "~/lib/zod-schemas/student";
import { studentsTable } from './../../../db/schema';

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
            const { client } = createSupabaseServerClient(request);
            // create auth session for student to retrieve id and match to the studentID

            const { data: registerData, error: registerError } =
                await client.auth.signUp({
                    email: validatedFields.email,
                    password: validatedFields.password,
                });

            if (registerError) {
                throw new Error(registerError.message)
            }

            if (!registerData.user?.id) {
                throw new Error("Something went wrong")
            }

            const hashedPassword = await bcrypt.hash(validatedFields.password, 10);


            // create student in db

            const [insertedStudent] = await db.insert(studentsTable).values({
                name: validatedFields.name,
                email: validatedFields.email,
                phone: validatedFields.phoneNumber,
                password: hashedPassword,
                studentId: registerData.user.id
            }).returning({
                id: studentsTable.id,
            })

            if (!insertedStudent.id) {
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
    console.log("🔴Activating student", formData)
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

        if (!updatedStudent.studentId) {
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

        if (!updatedStudent.id) {
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
    const [existingStudent] = await db.select().from(studentsTable).where(eq(studentsTable.email, validatedFields.email)).limit(1)

    if (existingStudent && existingStudent.id !== studentId) {
        return data({ success: false, message: "Email already in use by another student" }, { status: 400 })
    }

    try {
        // Update student in the database
        const [updatedStudent] = await db.update(studentsTable)
            .set({
                name: validatedFields.name,
                email: validatedFields.email,
                phone: validatedFields.phoneNumber,
                updated_at: new Date()
            })
            .where(eq(studentsTable.id, studentId as string))
            .returning({
                id: studentsTable.id
            });

        if (!updatedStudent) {
            throw new Error("Failed to update student")
        }

        return data({ success: true, message: "Student updated successfully" }, { status: 200 })
    } catch (error) {
        return data({ success: false, message: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 })
    }
}
