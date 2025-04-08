import { z } from "zod";

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  username: z.string(),
});

export const DraftUserSchema = z.object({
  name: z.string(),
  email: z.string() || z.null(),
  username: z.string(),
  status: z.number(),
  roles: z.string(),
  password: z.string(),
  permissions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});


