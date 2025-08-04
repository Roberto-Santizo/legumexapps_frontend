import { TaskProductionDashboardSchema } from "@/utils/dashboardSchemas";
import { z } from "zod";

export type TaskProductionDashboard = z.infer<typeof TaskProductionDashboardSchema>;