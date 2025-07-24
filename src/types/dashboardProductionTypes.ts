import { TaskProductionInProgressSchema } from "@/utils/dashboardSchemas";
import { z } from "zod";

export type TaskProductionDashboardInProgress = z.infer<typeof TaskProductionInProgressSchema>;