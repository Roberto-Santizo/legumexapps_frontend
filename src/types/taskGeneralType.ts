import { TaskSchema } from "@/utils/taskGeneralSchemas";
import { z } from "zod";

export type TaskGeneral = z.infer<typeof TaskSchema>;
export type DraftTask = Pick<TaskGeneral, 'description' |'code' |'name'>;