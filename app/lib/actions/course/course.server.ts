import { data } from "react-router";
import db from "~/db/index.server";
import { coursesTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { titleToSlug } from "~/lib/utils";
import { createCourseSchema } from "~/lib/zod-schemas/course";

export async function handleCreateCourse(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const unavlidatedFields = createCourseSchema.safeParse(Object.fromEntries(formData));

    if (!unavlidatedFields.success) {
        return data({ success: false, message: 'Invalid form data' }, { status: 400 });
    }

    const validatedFields = unavlidatedFields.data;

    // insert course into database

    try {
        const slug = titleToSlug(validatedFields.name);
        const [insertedCourse] = await db.insert(coursesTable).values({
            name: validatedFields.name,
            description: validatedFields.description,
            slug: slug,
        }).returning({
            slug: coursesTable.slug,
        });

        if (!insertedCourse) {
            return data({ success: false, message: 'Failed to create course' }, { status: 500 });
        }

        return data({ success: true, message: 'Course created successfully', courseSlug: insertedCourse.slug }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return data({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}
