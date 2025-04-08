import { z } from 'zod';

export const userRoleSchema = z.object({
    name: z.string()
});


