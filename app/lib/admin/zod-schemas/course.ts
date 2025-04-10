import { z } from "zod";

export const createCourseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    description: z.string().min(1, { message: "Description is required" }).trim(),
});

export const updateCourseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    description: z.string().min(1, { message: "Description is required" }).trim(),
});

// types
export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;

