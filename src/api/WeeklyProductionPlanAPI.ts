import clienteAxios from "@/config/axios";
import { z } from 'zod';
import { SKUSchema } from "./SkusAPI";
import { DraftChangePosition } from "@/components/modals/ModalChangeEmployee";
import { DraftPerformance } from "@/components/modals/ModalTomaRendimientoProduccion";
import { DraftCloseTask } from "@/components/modals/ModalCierreTareaProduccion";
import { Linea, PositionSchema } from "./LineasAPI";
import { DraftNewTaskProduction } from "@/components/modals/ModalCrearTareaProduccion";
import { isAxiosError } from "axios";
import { ReportSchema } from "@/utils/reports-schema";
import { downloadBase64File } from "@/helpers";
import { DraftNote } from "@/components/modals/ModalNotasProblemas";
import { DraftTaskProductionEmployee } from "@/components/modals/ModalAddEmployee";
import { DraftChangeOperationDate } from "@/components/modals/ModalChangeOperationDate";
import { DraftUnassignTaskProduction } from "@/components/modals/ModalUnassignNote";

const WeeklyPlanProductionPlanSchema = z.object({
    id: z.string(),
    week: z.number(),
    year: z.number(),
    completed: z.boolean().nullable()
});

export type WeeklyPlanProductionPlan = z.infer<typeof WeeklyPlanProductionPlanSchema>

const PaginatedWeeklyProductionPlansSchema = z.object({
    data: z.array(WeeklyPlanProductionPlanSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()

});

export type PaginatedWeeklyProductionPlans = z.infer<typeof PaginatedWeeklyProductionPlansSchema>

export async function getWeeklyProductionPlans({ page, paginated }: { page: number, paginated: string }): Promise<PaginatedWeeklyProductionPlans> {
    try {
        const url = `/api/weekly-production-plans?paginated${paginated}&page=${page}`;
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
    status: z.boolean(),
    total_employees: z.number(),
    assigned_employees: z.number()
});

export const LinesWeeklyPlanSchema = z.object({
    data: z.array(LineWeeklyPlanSchema)
});

export type LineWeeklyPlan = z.infer<typeof LineWeeklyPlanSchema>

export async function getWeeklyPlanDetails(id: WeeklyPlanProductionPlan['id']): Promise<LineWeeklyPlan[]> {
    try {
        const url = `/api/weekly-production-plans/${id}`;
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

export const TaskProductionByLineSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    total_tarimas: z.number(),
    finished_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number(),
    total_hours: z.number(),
    total_employees: z.number(),
    total_in_employees: z.number(),
    priority: z.number(),
    available: z.boolean(),
    paused: z.boolean()
});

export const TasksProductionByLineSchema = z.object({
    data: z.array(TaskProductionByLineSchema)
});

export type TaskProductionByLine = z.infer<typeof TaskProductionByLineSchema>

export async function getWeeklyPlanLineDetails(line_id: Linea['id'], weekly_production_plan_id: WeeklyPlanProductionPlan['id'], date: string): Promise<TaskProductionByLine[]> {
    try {
        const url = `/api/weekly-production-plans/details/${weekly_production_plan_id}/${line_id}?date=${date}`;
        const { data } = await clienteAxios(url);
        console.log(date);
        const result = TasksProductionByLineSchema.safeParse(data);
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

export const EmployeeTaskProductionSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    column_id: z.string(),
    active: z.number(),
});

export const TaskProductionDetailSchema = z.object({
    id: z.string(),
    line: z.string(),
    assigned_employees: z.number(),
    operation_date: z.string(),
    total_lbs: z.number(),
    sku: SKUSchema,
    start_date: z.string().nullable(),
    flag: z.boolean(),
    in_employees: z.array(EmployeeTaskProductionSchema),
    all_employees: z.array(EmployeeTaskProductionSchema),
    positions: z.array(PositionSchema)
});

export type EmployeeProduction = z.infer<typeof EmployeeTaskProductionSchema>
export type TaskProductionDetails = z.infer<typeof TaskProductionDetailSchema>

export async function getTaskProductionDetails(id: TaskProductionByLine['id']): Promise<TaskProductionDetails> {
    try {
        const url = `/api/tasks-production/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionDetailSchema.safeParse(data.data);
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

export const EmployeeComodinSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    column_id: z.string(),
    active: z.number()
});

export const EmployeesComodinesSchema = z.object({
    data: z.array(EmployeeComodinSchema)
});

export type EmployeeComodin = z.infer<typeof EmployeeComodinSchema>

export async function getComodines(): Promise<EmployeeComodin[]> {
    try {
        const url = '/api/employees-comodines';
        const { data } = await clienteAxios(url);
        const result = EmployeesComodinesSchema.safeParse(data);
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

export async function createProductionPlan(file: File[]) {
    try {
        const url = '/api/weekly-production-plans';
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createAssigmentsProductionTasks({ file, id }: { file: File[], id: LineWeeklyPlan['id'] }) {
    try {
        const url = `/api/weekly-production-plans/assign/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function changePosition(data: DraftChangePosition) {
    try {
        const url = '/api/tasks-production/change-assignment';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function startTaskProduction(id: TaskProductionByLine['id']) {
    try {
        const url = `/api/tasks-production/${id}/start`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TimeoutTaskProductionSchema = z.object({
    id: z.string(),
    name: z.string(),
    start_date: z.string(),
    end_date: z.string().nullable(),
    total_hours: z.number().nullable()
});

export const PerformanceTaskProductionSchema = z.object({
    id: z.string(),
    take_date: z.string(),
    tarimas_produced: z.number().nullable(),
    lbs_bascula: z.number(),
    lbs_teoricas: z.number(),
    difference: z.number()
});


export const AssignedEmployeeTaskProductionSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string()
});

export const TaskProductionInProgressSchema = z.object({
    data: z.object({
        line: z.string(),
        sku: z.string(),
        start_date: z.string(),
        HPlan: z.number(),
        HLinea: z.number(),
        HRendimiento: z.number(),
        HTiemposMuertos: z.number(),
        employees: z.array(AssignedEmployeeTaskProductionSchema),
        performances: z.array(PerformanceTaskProductionSchema),
        timeouts: z.array(TimeoutTaskProductionSchema)
    })
})

export type TaskProductionInProgress = z.infer<typeof TaskProductionInProgressSchema>


export async function getTaskProductionInProgressDetail(id: TaskProductionByLine['id']): Promise<TaskProductionInProgress> {
    try {
        const url = `/api/tasks-production/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionInProgressSchema.safeParse(data);
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


export async function createTaskProductionPerformance(id: TaskProductionByLine['id'], FormData: DraftPerformance) {
    try {
        const url = `/api/tasks-production/${id}/performance`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function closeTaskProduction(id: TaskProductionByLine['id'], FormData: DraftCloseTask) {
    try {
        const url = `/api/tasks-production/${id}/end`;
        const { data } = await clienteAxios.patch<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createNewTaskProduction(FormData: DraftNewTaskProduction) {
    try {
        const url = '/api/tasks-production/new-task';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}


export async function changeTasksPriority(FormData: string[]) {
    try {
        const url = '/api/tasks-production/change-priority';
        const { data } = await clienteAxios.put<string>(url, {
            data: FormData
        });
        console.log(data);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const TaskForCalendarSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string().nullable(),
    total_hours: z.number(),
    priority: z.string(),
    backgroundColor: z.string(),
    editable: z.boolean(),
    line_id: z.string()
});

export const TasksForCalendarSchema = z.object({
    data: z.array(TaskForCalendarSchema)
});

export type TaskForCalendar = z.infer<typeof TaskForCalendarSchema>;

export async function getAllTasksForCalendar(id: WeeklyPlanProductionPlan['id']): Promise<TaskForCalendar[]> {
    try {
        const url = `/api/weekly_production_plan/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksForCalendarSchema.safeParse(data);
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

export async function updateTaskProductionOperationDate({ id, FormData }: { id: TaskProductionByLine['id'], FormData: DraftChangeOperationDate }) {
    try {
        const url = `/api/tasks-production/change-operation-date/${id}`;
        const { data } = await clienteAxios.patch<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function assignOperationDate({ id, date }: { id: TaskProductionNoOperationDate['id'], date: string }) {
    try {
        const url = `/api/tasks-production/assign-operation-date/${id}`;
        const { data } = await clienteAxios.patch<string>(url, {
            date
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export const TaskByDateSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    total_lbs: z.number(),
    finished_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number().nullable(),
    priority: z.number(),
    line_id: z.string(),
    isDraggable: z.boolean()
});

export const SummaryHoursByLineSchema = z.object({
    line: z.string(),
    total_hours: z.number(),
    id: z.string()
});

export const TasksByDateSchema = z.object({
    summary: z.array(SummaryHoursByLineSchema),
    data: z.array(TaskByDateSchema)
})

export type TaskByDate = z.infer<typeof TaskByDateSchema>;
export type InfoTasksByDate = z.infer<typeof TasksByDateSchema>;

export async function getTasksProductionByDate(id: WeeklyPlanProductionPlan['id'], date: string): Promise<InfoTasksByDate> {
    try {
        const url = `api/weekly_production_plan/details-by-date/${id}?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = TasksByDateSchema.safeParse(data);
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

export const TaskByLineSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    product: z.string(),
    total_lbs: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number().nullable(),
    total_hours: z.number(),
    total_in_employees: z.number(),
    total_employees: z.number(),
    paused: z.boolean(),
    is_minimum_requrire: z.boolean().nullable(),
    is_justified: z.boolean().nullable()
});

export const TasksByLineSchema = z.object({
    data: z.array(TaskByLineSchema)
});

export type TaskByLine = z.infer<typeof TaskByLineSchema>;

export async function getTasksByLineId(plan_id: WeeklyPlanProductionPlan['id'], line_id: Linea['id']): Promise<TaskByLine[]> {
    try {
        const url = `/api/weekly-production-plans/details/${plan_id}/${line_id}`;
        const { data } = await clienteAxios(url);
        const result = TasksByLineSchema.safeParse(data);
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

export async function downloadPlanillaProduction({ plan_id, line_id }: { plan_id: WeeklyPlanProductionPlan['id'], line_id: Linea['id'] }) {
    try {
        const url = `/api/report-production/${plan_id}/${line_id}`;
        const { data } = await clienteAxios.post(url);
        const result = ReportSchema.safeParse(data);
        if (result.success) {
            downloadBase64File(result.data.file, result.data.fileName)
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createTaskProductionNote(FormData: DraftNote) {
    try {
        const url = '/api/notes';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.message);
        }
    }
}


export async function createTaskProductionEmployee({ id, FormData }: { id: TaskProductionByLine['id'], FormData: DraftTaskProductionEmployee }) {
    try {
        const url = `/api/tasks-production/create-assignee/${id}`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export const SummaryGraphHoursByTaskProductionSchema = z.object({
    HPlan: z.number(),
    HLinea: z.number(),
    HRendimiento: z.number(),
    HTiemposMuertos: z.number()
});

export const NoteTaskProductionSchema = z.object({
    reason: z.string(),
    action: z.string(),
    user: z.string(),
});

export const BitacoraTaskProductionEmployeeSchema = z.object({
    id: z.string(),
    original_name: z.string(),
    original_position: z.string()
});

export const TaskProductionEmployeeSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    bitacoras: z.array(BitacoraTaskProductionEmployeeSchema)
});

export const HistoryOperationDateSchema = z.object({
    id: z.string(),
    user: z.string(),
    reason: z.string(),
    original_date: z.string(),
    new_date: z.string(),
    created_at: z.string()
});

export const TransactionTaskProductionSchema = z.object({
    id: z.string(),
    type: z.number(),
    transaction_date: z.string(),
    items: z.array(z.object({
        id: z.string(),
        code: z.string(),
        description: z.string(),
        lote: z.string(),
        quantity: z.number(),
        destination: z.string()
    })),
    observations: z.string().nullable(),
    delivered_by: z.string(),
    delivered_by_signature: z.string(),
    responsable: z.string(),
    responsable_signature: z.string(),
});

export const FinishedTaskProductionDetailsSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    sku_description: z.string(),
    client: z.string(),
    total_lbs: z.number(),
    total_lbs_produced: z.number(),
    total_lbs_bascula: z.number(),
    destination: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    max_value: z.number(),
    is_minimum_require: z.boolean(),
    summary: SummaryGraphHoursByTaskProductionSchema,
    note: NoteTaskProductionSchema.nullable(),
    timeouts: z.array(TimeoutTaskProductionSchema),
    employees: z.array(TaskProductionEmployeeSchema),
    history_operation_date: z.array(HistoryOperationDateSchema),
    transactions: z.array(TransactionTaskProductionSchema),
    wastages: z.array(z.object({
        id: z.string(),
        item: z.string(),
        quantity: z.number(),
        lote: z.string()
    }))
});

export type FinishedTaskProductionDetails = z.infer<typeof FinishedTaskProductionDetailsSchema>;
export type TaskProductionEmployee = z.infer<typeof TaskProductionEmployeeSchema>;
export type HistoryOperationDate = z.infer<typeof HistoryOperationDateSchema>;
export type NoteTaskProduction = z.infer<typeof NoteTaskProductionSchema>;
export type TransactionTaskProduction = z.infer<typeof TransactionTaskProductionSchema>;

export async function getFinishedTaskProductionDetails(id: TaskProductionByLine['id']): Promise<FinishedTaskProductionDetails> {
    try {
        const url = `/api/tasks-production/finished/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = FinishedTaskProductionDetailsSchema.safeParse(data);
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

export async function createTaskProductionUnassignment({ id, FormData }: { id: string, FormData: DraftUnassignTaskProduction }) {
    try {
        const url = `/api/tasks-production/${id}/unassign`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

const TaskProductionNoOperationDateSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    destination: z.string(),
    total_lbs: z.number()
});

const TaskProductionEventSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string()
});

const WeeklyProductionPlanTasksSchema = z.object({
    tasks: z.array(TaskProductionNoOperationDateSchema),
    events: z.array(TaskProductionEventSchema)
});

export type TaskProductionEvents = z.infer<typeof TaskProductionEventSchema>;
export type TaskProductionNoOperationDate = z.infer<typeof TaskProductionNoOperationDateSchema>;
export type WeeklyProductionPlanTasks = z.infer<typeof WeeklyProductionPlanTasksSchema>;

export async function getAllTasksWeeklyProductionPlan(id: WeeklyPlanProductionPlan['id']): Promise<WeeklyProductionPlanTasks> {
    try {
        const url = `/api/weekly-production-plans/all-tasks/${id}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyProductionPlanTasksSchema.safeParse(data);
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

export const TaskOperationDateSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    working: z.boolean(),
    finished: z.boolean(),
    total_lbs: z.number(),
    destination: z.string(),
    status: z.string(),
    status_id: z.string(),
    color: z.string(),
    box: z.string(),
    bag: z.string(),
    bag_inner: z.string().nullable(),
    recipe: z.array(z.object({
        packing_material_id: z.string(),
        name: z.string(),
        quantity: z.number(),
        lote: z.string(),
        destination: z.string().nullable()
    }))
});

export const TasksOperationDateSchema = z.object({
    data: z.array(TaskOperationDateSchema)
});

export type TaskOperationDate = z.infer<typeof TaskOperationDateSchema>;

export async function getTasksOperationDate(date: string): Promise<TaskOperationDate[]> {
    try {
        const url = `/api/weekly-production-plans/tasks/programed?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = TasksOperationDateSchema.safeParse(data);
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
    code: z.string(),
    id: z.string(),
    line: z.string(),
    product: z.string(),
    operation_date: z.string()
});

export const TasksProductionSchema = z.object({
    data: z.array(TaskProductionSchema)
});

export type TaskProduction = z.infer<typeof TaskProductionSchema>;

export async function getTasksProduction() : Promise<TaskProduction[]> {
    try {
        const url = '/api/tasks-production';
        const { data } = await clienteAxios(url);
        const result = TasksProductionSchema.safeParse(data);
        if(result.success){
            return result.data.data;
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
