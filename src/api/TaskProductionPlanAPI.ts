import { z } from "zod";
import { TaskByLine } from "./WeeklyProductionPlanAPI";
import clienteAxios from "@/config/axios";

export const TaskProductionItemSchema = z.object({
    name: z.string(),
    packing_material_id: z.string(),
    quantity: z.number(),
    lote: z.string(),
    destination: z.string()
});

export const TaskProductionItemsSchema = z.object({
    data: z.object({
        available: z.boolean(),
        items: z.array(TaskProductionItemSchema)
    })
})

export type TaskProductionItems = z.infer<typeof TaskProductionItemsSchema>;
export type TaskProductionItem = z.infer<typeof TaskProductionItemSchema>;

export async function getTaskReturnPackingMaterialDetails({ id } : { id: TaskByLine['id'] }) : Promise<TaskProductionItems>{
    try {
        const url = `api/tasks-production/devolution-details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionItemsSchema.safeParse(data);
       
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}