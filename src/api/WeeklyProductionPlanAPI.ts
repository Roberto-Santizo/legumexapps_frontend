import clienteAxios from "@/config/axios";
import { Line } from "recharts";
import { z } from 'zod';
import { SKUSchema } from "./SkusAPI";
import { EmployeeTaskCropPlanSchema } from "@/utils/taskCropWeeklyPlan-schema";

const WeeklyPlanProductionPlanSchema = z.object({
    id: z.string(),
    week: z.number(),
    year: z.number()
});

export type WeeklyPlanProductionPlan = z.infer<typeof WeeklyPlanProductionPlanSchema>

const PaginatedWeeklyProductionPlansSchema = z.object({
    data: z.array(WeeklyPlanProductionPlanSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })

});

export type PaginatedWeeklyProductionPlans = z.infer<typeof PaginatedWeeklyProductionPlansSchema>

export async function getPaginatedWeeklyProductionPlans(page: number): Promise<PaginatedWeeklyProductionPlans> {
    try {
        const url = `/api/weekly_production_plan?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedWeeklyProductionPlansSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const LineWeeklyPlanSchema = z.object({
    id: z.string(),
    line: z.string(),
    status: z.boolean()
});

export const LinesWeeklyPlanSchema = z.object({
    data: z.array(LineWeeklyPlanSchema)
});

export type LineWeeklyPlan = z.infer<typeof LineWeeklyPlanSchema>

export async function getWeeklyPlanDetails(id: WeeklyPlanProductionPlan['id']): Promise<LineWeeklyPlan[]> {
    try {
        const url = `/api/weekly_production_plan/${id}`;
        const { data } = await clienteAxios(url);
        const result = LinesWeeklyPlanSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskProductionSchema = z.object({
    id: z.string(),
    line: z.string(),
    total_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number(),
    total_hours: z.number(),
});

export const TasksProductionSchema = z.object({
    data: z.array(TaskProductionSchema)
});

export type TaskProduction = z.infer<typeof TaskProductionSchema>

export async function getWeeklyPlanLineDetails(line_id: Line['id'], weekly_production_plan_id: WeeklyPlanProductionPlan['id']) : Promise<TaskProduction[]> {
    try {
        const url = `/api/weekly_production_plan/details/${weekly_production_plan_id}/${line_id}`;
        const { data } = await clienteAxios(url);
        const result = TasksProductionSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const EmployeeTaskProductionSchema = z.object({
    id: z.string(), 
    name: z.string(), 
    code: z.string(),
    position: z.string(),
    column_id: z.string()
});

export const TaskProductionDetailSchema = z.object({
    id: z.string(),
    line: z.string(), 
    operation_date: z.string(), 
    total_tarimas: z.number(), 
    sku: SKUSchema,
    employees: z.array(EmployeeTaskProductionSchema), 
});

export type EmployeeProduction = z.infer<typeof EmployeeTaskProductionSchema>
export type TaskProductionDetails = z.infer<typeof TaskProductionDetailSchema>

export async function getTaskProductionDetails(id:TaskProduction['id']) : Promise<TaskProductionDetails> {
    try {
        const url = `/api/task_production_plan/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionDetailSchema.safeParse(data.data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const EmployeeComodinSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    column_id: z.string()
});

export const EmployeesComodinesSchema = z.object({
    data: z.array(EmployeeComodinSchema)
});

export type EmployeeComodin = z.infer<typeof EmployeeComodinSchema>

export async function getComodines() : Promise<EmployeeComodin[]>{
    try {
        const url = '/api/employees-comodines';
        const { data } = await clienteAxios(url);
        const result =  EmployeesComodinesSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createProductionPlan(file: File[]) {
    try {
        const url = '/api/weekly_production_plan';
        const formData = new FormData();
        formData.append("file", file[0]);

        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function createAssigmentsProductionTasks(file: File[], id: LineWeeklyPlan['id']) {
    try {
        const url = `/api/weekly_production_plan/assign/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}