import { eq } from "drizzle-orm";
import db from "~/db/index.server";
import { rolesTable } from "~/db/schema";
import { createSupabaseServerClient } from "~/db/supabase/server";


// just regular user auth check
export const isLoggedIn = async (request: Request) => {
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    return data.user?.id ? true : false;
};

// admin auth check + db query to check if the user logged in is an admin
export const isAdminLoggedIn = async (request: Request) => {
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    if (!data.user?.id) return {
        isLoggedIn: false,
        adminId: null
    };
    const [admin] = await db.select({
        adminId: rolesTable.adminId
    }).from(rolesTable).where(eq(rolesTable.adminId, data.user.id)).limit(1)
    if (!admin.adminId) return {
        isLoggedIn: false,
        adminId: null
    };
    return {
        isLoggedIn: true,
        adminId: admin.adminId
    };
};


