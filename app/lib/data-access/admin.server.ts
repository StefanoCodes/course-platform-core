import db from "~/db/index.server";
import { adminsTable } from "~/db/schema";
import { eq } from "drizzle-orm";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
export async function getAdminById(request: Request) {
    // protected action
    const { isLoggedIn, adminId } = await isAdminLoggedIn(request);

    if (!isLoggedIn || !adminId) {
        return {
            success: false,
            admin: null,
        }
    }

    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.adminId, adminId)).limit(1)
    return {
        success: true,
        admin: admin,
    }
}
