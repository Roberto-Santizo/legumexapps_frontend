import { PermissionSchema } from "@/utils/permissionsSchemas";
import { z } from "zod";

export type Permission = z.infer<typeof PermissionSchema>;
export type DraftPermiso = Pick<Permission, 'name'>;