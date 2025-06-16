import { roleSchema } from "@/utils/rolesSchemas";
import { z } from "zod";

export type Role = z.infer<typeof roleSchema>;
export type DraftRole = Pick<Role,'name'>;