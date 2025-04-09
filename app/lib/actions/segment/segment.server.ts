import { and, eq } from "drizzle-orm";
import { data, redirect } from "react-router";
import db from "~/db/index.server";
import { segmentsTable } from "~/db/schema";
import { getCourseBySlug } from "~/lib/data-access/courses.server";
import { isAdminLoggedIn } from "~/lib/supabase-utils.server";
import { titleToSlug } from "~/lib/utils";
import { createSegmentSchema, editSegmentSchema } from "~/lib/zod-schemas/segment";

export async function handleCreateSegment(request: Request, formData: FormData) {
  // auth check
  const { isLoggedIn } = await isAdminLoggedIn(request);

  if (!isLoggedIn) {
    throw redirect('/admin/login');
  }

  // validation
  const unvalidatedFields = createSegmentSchema.safeParse(Object.fromEntries(formData));
  if (!unvalidatedFields.success) {
    return data({ success: false, message: 'Invalid form data' }, { status: 400 });
  }
  const { courseSlug, name, description, videoUrl } = unvalidatedFields.data;

  try {
    // getting the course where the segment will be created
    const { success: courseSuccess, course } = await getCourseBySlug(request, courseSlug);

    if (!courseSuccess || !course) {
      return data({ success: false, message: 'Course not found' }, { status: 404 });
    }

    // convert segment name to slug
    const slug = titleToSlug(name);

    // insert segment into database

    const [insertedSegment] = await db.insert(segmentsTable).values({
      name,
      description,
      videoUrl,
      slug,
      courseId: course.id,
    }).returning({
      slug: segmentsTable.slug,
    })

    if (!insertedSegment.slug) {
      return data({ success: false, message: 'Failed to create segment' }, { status: 500 });
    }

    return data({ success: true, message: 'Segment created successfully', segmentSlug: insertedSegment.slug }, { status: 200 });
  }
  catch (error) {
    console.error('Error creating segment:', error);
    return data({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}
export async function handleEditSegment(request: Request, formData: FormData) {
  // auth check
  const { isLoggedIn } = await isAdminLoggedIn(request);

  if (!isLoggedIn) {
    throw redirect('/admin/login');
  }

  // validation
  const unvalidatedFields = editSegmentSchema.safeParse(Object.fromEntries(formData));

  if (!unvalidatedFields.success) {
    return data({ success: false, message: 'Invalid form data' }, { status: 400 });
  }

  const validatedFields = unvalidatedFields.data;

  try {
    // getting the course where the segment will be created
    const { success: courseSuccess, course } = await getCourseBySlug(request, validatedFields.courseSlug);

    if (!courseSuccess || !course) {
      return data({ success: false, message: 'Course not found' }, { status: 404 });
    }
    // db mutation
    const [updatedSegment] = await db.update(segmentsTable).set({
      name: validatedFields.name,
      description: validatedFields.description,
      videoUrl: validatedFields.videoUrl,
    }).where(and(eq(segmentsTable.slug, validatedFields.segmentSlug), eq(segmentsTable.courseId, course.id)))
      .returning({
        slug: segmentsTable.slug,
      })

    if (!updatedSegment.slug) {
      return data({ success: false, message: 'Failed to update segment' }, { status: 500 });
    }
    return data({ success: true, message: 'Segment updated successfully', segmentSlug: updatedSegment.slug }, { status: 200 });
  }
  catch (error) {
    console.error('Error updating segment:', error);
    return data({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}
export async function handleDeleteSegment(request: Request, formData: FormData) {
  // auth check
  const { isLoggedIn } = await isAdminLoggedIn(request);

  if (!isLoggedIn) {
    throw redirect('/admin/login');
  }
  const segmentId = formData.get('id') as string;
  const courseSlug = formData.get('courseSlug') as string;

  if (!segmentId || !courseSlug) {
    return data({ success: false, message: 'Invalid form data' }, { status: 400 });
  }

  try {
    // getting the course where the segment is created in
    const { success: courseSuccess, course } = await getCourseBySlug(request, courseSlug);

    if (!courseSuccess || !course) {
      return data({ success: false, message: 'Course not found' }, { status: 404 });
    }
    // db mutation
    await db.delete(segmentsTable).where(and(eq(segmentsTable.id, segmentId), eq(segmentsTable.courseId, course.id)));
    return data({ success: true, message: 'Segment deleted successfully' }, { status: 200 });
  }
  catch (error) {
    console.error('Error deleting segment:', error);
    return data({ success: false, message: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
  }
}