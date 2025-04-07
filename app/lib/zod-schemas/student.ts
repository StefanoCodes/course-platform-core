import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
    phoneNumber: z.string().refine((val) => val === '' || val.length >= 10, { message: "Phone number must be at least 10 characters long" }).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
