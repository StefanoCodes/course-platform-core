import { eq } from "drizzle-orm";
import db from "~/db/index.server";
import { rolesTable, studentsTable } from "~/db/schema";
import { createSupabaseServerClient } from "~/db/supabase/server";

// regular auth check
export const isAuthenticated = async (request: Request) => {
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    if (!data.user?.id) {
        return {
            isLoggedIn: false,
            userId: null
        }
    }
    return {
        isLoggedIn: true,
        userId: data.user.id
    }
}

// student auth check + checking if the student is actiavted in the database
export const isStudentLoggedIn = async (request: Request) => {
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    if (!data.user?.id) {
        return {
            isLoggedIn: false,
            student: null
        }
    };

    try {
        const [student] = await db.select().from(studentsTable).where(eq(studentsTable.studentId, data.user.id)).limit(1)
        if (!student) {
            return {
                isLoggedIn: false,
                student: null
            }
        }
        if (!student.isActivated) {
            // logout the user and redirect to the login page
            await client.auth.signOut();
            return {
                isLoggedIn: false,
                student: null
            }
        }
        return {
            isLoggedIn: true,
            student: student
        }
    } catch (error) {
        console.error(`Error checking if student is logged in: ${error}`);
        return {
            isLoggedIn: false,
            student: null
        }
    }
}

// admin auth check + db query to check if the user logged in is an admin
export const isAdminLoggedIn = async (request: Request) => {
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    if (!data.user?.id) {
        return {
            isLoggedIn: false,
            adminId: null
        }
    };
    const [admin] = await db.select({
        adminId: rolesTable.adminId
    }).from(rolesTable).where(eq(rolesTable.adminId, data.user.id)).limit(1)

    if (!admin) return {
        isLoggedIn: false,
        adminId: null
    };
    return {
        isLoggedIn: true,
        adminId: admin.adminId
    };
};


