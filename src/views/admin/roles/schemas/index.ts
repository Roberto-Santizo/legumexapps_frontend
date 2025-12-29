import { z } from "zod";
import { paginatedSchema } from "../../../../utils/schemas";

export const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export const rolesSchema = z.object({
    data: z.array(roleSchema),
    meta: paginatedSchema.optional()
});

export const userRoleSchema = z.object({
    name: z.string()
});
