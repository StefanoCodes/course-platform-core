import { data, redirect } from "react-router";
import { isAdminLoggedIn } from "~/lib/auth.server";
import { assignCourseSchema, createCourseSchema, updateCourseSchema } from "../../zod-schemas/course";
import { titleToSlug } from "~/lib/utils";
import { checkSlugUnique } from "../shared/shared.server";
import { coursesTable, segmentsTable, studentCoursesTable } from "~/db/schema";
import db from "~/db/index.server";
import { and, eq } from "drizzle-orm";

export async function handleCreateCourse(request: Request, formData: FormData) {
    // auth check
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
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

    const courseId = formData.get('courseId') as string;

    if (!courseId) {
        return data({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    try {
        // need to delete all the segments connected to the course aswell i belive with onCascade
        await db.transaction(async (tx) => {
            // delete in the studentCoursesEntry
            await tx.delete(studentCoursesTable).where(eq(studentCoursesTable.courseId, courseId))
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

export async function handleUpdateCourseAssignment(request: Request, formData: FormData) {
    const { isLoggedIn } = await isAdminLoggedIn(request);
    if (!isLoggedIn) {
        throw redirect("/admin/login")
    }

    const isAssigned = formData.get("isAssigned") === "true" ? true : false;
    const studentId = formData.get("studentId")
    const courseId = formData.get("courseId");

    const formDataObject = {
        isAssigned,
        studentId,
        courseId,
    }
    const unavlidatedFields = assignCourseSchema.safeParse(formDataObject);

    if (!unavlidatedFields.success) {
        return data({ success: false, message: 'Invalid form data' }, { status: 400 });
    }

    const validatedFields = unavlidatedFields.data;

    try {
        // if we are setting the value to true then we create an entry in the studentCourseTable
        if (validatedFields.isAssigned) {
            const [insertedStudentCourseAssignment] = await db.insert(studentCoursesTable).values({
                studentId: validatedFields.studentId,
                courseId: validatedFields.courseId

            }).returning({
                id: studentCoursesTable.id
            })
            if (!insertedStudentCourseAssignment.id) {
                return data({ success: false, message: 'Something went wrong inserting a new student course in the student course table' }, { status: 400 });
            }
            return data({ success: true, message: 'Success' }, { status: 200 });
        }

        // if false then we delete the entry in the studentCourseTable
        if (!validatedFields.isAssigned) {
            await db.delete(studentCoursesTable).where(and(eq(studentCoursesTable.studentId, validatedFields.studentId), eq(studentCoursesTable.courseId, validatedFields.courseId)))
            return data({ success: true, message: 'Success' }, { status: 200 });
        }
    } catch (error) {
        console.error(`Error updating student course assignment`, error);
        return data({ success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

