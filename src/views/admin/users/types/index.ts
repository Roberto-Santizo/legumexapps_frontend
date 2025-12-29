import { draftUserSchema, userSchema } from "@/views/admin/users/schemas";
import { z } from "zod";

export type User = z.infer<typeof userSchema>
export type DraftUser = z.infer<typeof draftUserSchema>