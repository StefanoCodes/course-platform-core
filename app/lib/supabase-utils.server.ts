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
    if (!data.user?.id) return false;

    //then query the roles and check if the user with the id is in that roles table if so then they are an admin allow them through otherwise redirect them to the admin login page

    const [admin] = await db.select({
        adminId: rolesTable.adminId
    }).from(rolesTable).where(eq(rolesTable.adminId, data.user.id)).limit(1)
    if (!admin.adminId) return false;
    return true;
};


