import { roleSchema } from "@/views/admin/roles/schemas";
import { z } from "zod";

export type Role = z.infer<typeof roleSchema>;
export type DraftRole = Pick<Role,'name'>;