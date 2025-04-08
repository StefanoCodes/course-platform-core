import { z } from "zod";

export const createSegmentSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    description: z.string().min(1, { message: "Description is required" }).trim(),
    videoUrl: z.string().min(1, { message: "Video URL is required" }).trim(),
});

export type CreateSegmentSchema = z.infer<typeof createSegmentSchema>;

