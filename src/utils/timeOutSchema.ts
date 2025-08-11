import { z } from "zod";

export const TimeoutSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const PaginatedTimeoutsSchema = z.object({
    data: z.array(TimeoutSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});
