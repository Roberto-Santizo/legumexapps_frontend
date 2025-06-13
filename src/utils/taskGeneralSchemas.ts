import {z} from "zod";
import { paginatedSchema } from "./schemas";

export const TaskSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
});

export const TasksSchema = z.object({
    data: z.array(TaskSchema),
    meta: paginatedSchema.optional()
});