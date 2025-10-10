import { PaginatedRequestSchema } from "./httpRequestsSchemas";
import z from "zod";

export const DraftWeeklyPlansSchema = PaginatedRequestSchema.extend({
    data: z.array(z.object({
        id: z.number(),
        finca: z.string(),
        week: z.number(),
        year: z.number()
    }))
})