import { index, pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";

// students
export const studentsTable = pgTable('students', {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: uuid('student_id').unique().notNull(), // this is the id of the student that is logged in reading it from the supabase auth table
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 255 }),
    password: varchar('password', { length: 255 }).notNull(),
    isActivated: boolean('is_activated').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('student_email_index').on(t.email), index('student_id_index').on(t.studentId)]);

// admins
export const adminsTable = pgTable('admins', {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id').unique().notNull(), // this is the id of the admin that is logged in reading it from the supabase auth table
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('admin_email_index').on(t.email), index('admin_admin_id_index').on(t.adminId)]);

// roles
export const rolesTable = pgTable('roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id').references(() => adminsTable.adminId),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('role_admin_id_index').on(t.adminId)]);

// courses
export const coursesTable = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    isPublic: boolean('is_public').notNull().default(false),
    slug: varchar('slug', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('course_name_index').on(t.name), index('course_slug_index').on(t.slug)]);

// student courses (each student can have many courses)
// when a student is assigned to a course, the student will be added to the student_courses table
// which we will use to get the courses that a student has access to
export const studentCoursesTable = pgTable('student_courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: uuid('student_id').references(() => studentsTable.studentId),
    courseId: uuid('course_id').references(() => coursesTable.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('student_course_student_id_index').on(t.studentId), index('student_course_course_id_index').on(t.courseId)]);

// segments (each course can have many segments)
export const segmentsTable = pgTable('segments', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    videoUrl: varchar('video_url', { length: 255 }),
    slug: varchar('slug', { length: 255 }).notNull(),
    courseId: uuid('course_id').references(() => coursesTable.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('segment_name_index').on(t.name), index('segment_slug_index').on(t.slug)]);

// contact form messages
export const messagesTable = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    message: varchar('message', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 255 }),
    email: varchar('email', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('message_message_index').on(t.message)]);

// types
export type Student = typeof studentsTable.$inferSelect;
export type Admin = typeof adminsTable.$inferSelect;
export type Role = typeof rolesTable.$inferSelect;
export type Course = typeof coursesTable.$inferSelect;
export type Segment = typeof segmentsTable.$inferSelect;
export type Message = typeof messagesTable.$inferSelect;
export type StudentCourse = typeof studentCoursesTable.$inferSelect;

