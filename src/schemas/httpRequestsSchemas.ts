import { z } from "zod";

export const PaginatedRequestSchema = z.object({
    statusCode: z.number(),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number(),
        total: z.number()
    }).optional()
});

export const ApiResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string().optional()
});

export const FileResponseSchema = z.object({
    fileName: z.string(),
    file: z.string()
});
