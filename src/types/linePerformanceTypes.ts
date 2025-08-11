import { LinePerformanceSchema, PaginatedLinesPerformancesSchema } from "@/utils/linePerformance";
import { z } from "zod";

export type PaginatedLinesPerformances = z.infer<typeof PaginatedLinesPerformancesSchema>;
export type LinePerformance = z.infer<typeof LinePerformanceSchema>;
