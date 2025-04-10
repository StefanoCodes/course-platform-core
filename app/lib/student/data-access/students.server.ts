// get active status for a student based on their id

import { eq } from "drizzle-orm";
import db from "~/db/index.server";
import { studentsTable } from "~/db/schema";

export async function isStudentAccountActivated(email: string) {

    // get active status for a student based on their id
    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.email, email));
    return {
        isStudentActivated: student.isActivated,
    }

}
