import { z } from "zod";
import { paginatedSchema } from "../../../../utils/schemas";

export const PermissionSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const PermissionsSchema = z.object({
    data: z.array(PermissionSchema),
    meta: paginatedSchema.optional()
});

export const PermissionsUserSchema = z.object({
    data: z.array(PermissionSchema.pick({ name: true }))
});

