


import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
// students
// admins
export const adminsTable = pgTable('admins', {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id').unique().notNull(), // this is the id of the admin that is logged in reading it from the supabase auth table
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});
// roles

// roles table will have a foreign key to the admins table id and if they match then they are an admin otherwise they are a student
export const rolesTable = pgTable('roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id').references(() => adminsTable.adminId),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});
// courses
// segments
// messages
