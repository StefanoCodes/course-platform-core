import { boolean, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// AUTH RELATED

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    role: text('role').notNull(),
    banned: boolean('banned'),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
    phone: text('phone')
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

// BUSINESS LOGIC

export const studentsTable = pgTable('students', {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: text('student_id').unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 255 }),
    password: varchar('password', { length: 255 }).notNull(),
    isActivated: boolean('is_activated').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('student_email_index').on(t.email), index('student_id_index').on(t.studentId)]);


export const coursesTable = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    isPublic: boolean('is_public').notNull().default(false),
    slug: varchar('slug', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('course_name_index').on(t.name), index('course_slug_index').on(t.slug)]);


export const segmentsTable = pgTable('segments', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    videoUrl: varchar('video_url', { length: 255 }).notNull(),
    isPublic: boolean('is_public').notNull().default(true),
    slug: varchar('slug', { length: 255 }).notNull(),
    courseId: uuid('course_id').references(() => coursesTable.id).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('segment_name_index').on(t.name), index('segment_slug_index').on(t.slug)]);

export const studentCoursesTable = pgTable('student_courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: text('student_id').references(() => studentsTable.studentId).notNull(),
    courseId: uuid('course_id').references(() => coursesTable.id).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [index('student_course_student_id_index').on(t.studentId), index('student_course_course_id_index').on(t.courseId)]);


// types
export type Student = typeof studentsTable.$inferSelect;
export type Course = typeof coursesTable.$inferSelect;
export type Segment = typeof segmentsTable.$inferSelect;
export type StudentCourse = typeof studentCoursesTable.$inferSelect;
// AUTH RELATED
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;