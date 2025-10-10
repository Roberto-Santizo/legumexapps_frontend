import { z } from "zod";

export const PaginatedRequestSchema = z.object({
    statusCode: z.number(),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number(),
        total: z.number()
    })
});