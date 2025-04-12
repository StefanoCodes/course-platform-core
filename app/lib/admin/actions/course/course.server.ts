import { eq } from "drizzle-orm";
import { data } from "react-router";
import db from "~/db/index.server";
import { coursesTable, segmentsTable } from "~/db/schema";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { titleToSlug } from "~/lib/utils";
import { createCourseSchema, updateCourseSchema } from "~/lib/admin/zod-schemas/course";
import { checkSlugUnique } from "../shared/shared.server";

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
        // check the slug created is unique in all the other courses
        const isSlugUnique = await checkSlugUnique(slug, coursesTable);
        if (!isSlugUnique) {
            return data({ success: false, message: 'a course with this name already exists' }, { status: 400 });
        }
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
export async function handleEditCourse(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const courseId = formData.get('id') as string;

    if (!courseId) {
        return data({ success: false, message: 'Course ID is required' }, { status: 400 });
    }
    const slug = formData.get('slug') as string;

    if (!slug) {
        return data({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    // validate the form data
    const unavlidatedFields = updateCourseSchema.safeParse(Object.fromEntries(formData));


    if (!unavlidatedFields.success) {
        return data({ success: false, message: 'Invalid form data' }, { status: 400 });
    }

    const validatedFields = unavlidatedFields.data;

    // check if the slug is unique
    const newSlug = titleToSlug(validatedFields.name);
    const currentSlug = slug; // Assuming the current slug is passed in form data

    // Only check uniqueness if the slug would actually change
    if (newSlug !== currentSlug) {
        const isSlugUnique = await checkSlugUnique(newSlug, coursesTable);
        if (!isSlugUnique) {
            return data({ success: false, message: 'a course with this name already exists' }, { status: 400 });
        }
    }

    // update the course
    const [updatedCourse] = await db.update(coursesTable).set({
        name: validatedFields.name,
        description: validatedFields.description,
        slug: slug,
    }).where(eq(coursesTable.id, courseId)).returning({
        slug: coursesTable.slug,
    });

    if (!updatedCourse) {
        return data({ success: false, message: 'Failed to update course' }, { status: 500 });
    }

    return data({ success: true, message: 'Course updated successfully', courseSlug: updatedCourse.slug }, { status: 200 });
}
export async function handleDeleteCourse(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const courseId = formData.get('id') as string;

    if (!courseId) {
        return data({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    try {
        // need to delete all the segments connected to the course aswell i belive with onCascade
        await db.transaction(async (tx) => {
            // delete all the segments connected to the course
            await tx.delete(segmentsTable).where(eq(segmentsTable.courseId, courseId));
            // delete the course
            await tx.delete(coursesTable).where(eq(coursesTable.id, courseId));
        });

        return data({ success: true, message: 'Course deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return data({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

export async function handleMakePublic(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const courseId = formData.get('courseId') as string;

    if (!courseId) {
        return data({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    try {
        const [updatedCourse] = await db.update(coursesTable).set({
            isPublic: true,
        }).where(eq(coursesTable.id, courseId)).returning({
            slug: coursesTable.slug,
        });

        if (!updatedCourse) {
            return data({ success: false, message: 'Failed to make course public' }, { status: 500 });
        }

        return data({ success: true, message: 'Course made public successfully', courseSlug: updatedCourse.slug }, { status: 200 });
    } catch (error) {
        console.error(error);
        return data({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

export async function handleMakePrivate(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        return data({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const courseId = formData.get('courseId') as string;

    if (!courseId) {
        return data({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    try {
        const [updatedCourse] = await db.update(coursesTable).set({
            isPublic: false,
        }).where(eq(coursesTable.id, courseId)).returning({
            slug: coursesTable.slug,
        });

        if (!updatedCourse) {
            return data({ success: false, message: 'Failed to make course private' }, { status: 500 });
        }

        return data({ success: true, message: 'Course made private successfully', courseSlug: updatedCourse.slug }, { status: 200 });
    } catch (error) {
        console.error(error);
        return data({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}


