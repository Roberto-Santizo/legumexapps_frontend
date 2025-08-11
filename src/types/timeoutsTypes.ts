import { PaginatedTimeoutsSchema, TimeoutSchema } from "@/utils/timeOutSchema";
import { z } from "zod";

export type Timeout = z.infer<typeof TimeoutSchema>;
export type PaginatedTimeouts = z.infer<typeof PaginatedTimeoutsSchema>;
