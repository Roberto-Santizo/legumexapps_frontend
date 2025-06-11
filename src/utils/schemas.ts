import { z } from "zod";

export const paginatedSchema = z.object({
    current_page: z.number(),
    last_page: z.number()
});