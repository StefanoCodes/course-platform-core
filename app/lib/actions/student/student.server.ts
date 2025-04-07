import { eq } from 'drizzle-orm';
import { studentsTable } from './../../../db/schema';
import { data } from "react-router";
import db from "~/db/index.server";
import { createStudentSchema } from "~/lib/zod-schemas/student";
import { createSupabaseServerClient } from '~/db/supabase/server';
import bcrypt from 'bcrypt';
import { isAdminLoggedIn } from '~/lib/supabase-utils.server';

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
