import { draftUserSchema, userSchema } from "@/utils/usersSchemas";
import { z } from "zod";

export type User = z.infer<typeof userSchema>
export type DraftUser = z.infer<typeof draftUserSchema>