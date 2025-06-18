import { FinishedTaskProductionDetailsSchema, HistoryOperationDateSchema, NoteTaskProductionSchema, TaskProductionChange, TaskProductionEmployeeSchema, TaskProductionEventSchema, TaskProductionInProgressSchema, TaskProductionItemSchema, TaskProductionNoOperationDateSchema, TaskProductionOperationDateSchema, TaskProductionSchema, TasksProductionSelectSchema, TransactionTaskProductionSchema } from "@/utils/taskProductionPlanSchemas";
import { z } from "zod";

export type TaskProductionPlan = z.infer<typeof TaskProductionSchema>;
export type TaskProductionEmployee = z.infer<typeof TaskProductionEmployeeSchema>;
export type TaskProductionInProgress = z.infer<typeof TaskProductionInProgressSchema>
export type TaskProductionTransaction = z.infer<typeof TransactionTaskProductionSchema>;

export type TaskProductionEvents = z.infer<typeof TaskProductionEventSchema>;
export type TaskProductionNoOperationDate = z.infer<typeof TaskProductionNoOperationDateSchema>;
export type TasksProductionSelect = z.infer<typeof TasksProductionSelectSchema>;

export type TaskProductionOperationDate = z.infer<typeof TaskProductionOperationDateSchema>;
export type TaskProductionFinished = z.infer<typeof FinishedTaskProductionDetailsSchema>;
export type TaskProductionHistoryOperationDate = z.infer<typeof HistoryOperationDateSchema>;
export type TaskProductionNotePerformance = z.infer<typeof NoteTaskProductionSchema>;

export type TaskProductionItem = z.infer<typeof TaskProductionItemSchema>;


export type TaskProductionChange = {
    new_employee: TaskProductionEmployee,
    old_employee: TaskProductionEmployee
};

export type DraftTaskProductionEmployee = {
    name: string;
    code: string;
    position_id: string;
    new_position: string;
    old_position: string;
}
