import { LineaSchema,  LineHoursPerWeekSchema, LinePerformanceByDaySchema, LinesPaginatedSchema, LinesSelectSchema, PositionSchema } from "@/utils/lineSchemas";
import { z } from "zod";

export type LineasPaginated = z.infer<typeof LinesPaginatedSchema>;
export type Line = z.infer<typeof LineaSchema>;
export type Position = z.infer<typeof PositionSchema>;

export type LineaSelect = z.infer<typeof LinesSelectSchema>
export type LinePerformanceByDay = z.infer<typeof LinePerformanceByDaySchema>;
export type LineHoursPerWeek = z.infer<typeof LineHoursPerWeekSchema>;
