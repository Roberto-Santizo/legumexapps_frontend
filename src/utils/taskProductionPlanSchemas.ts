import { PositionSchema } from "@/api/LineasAPI";
import { SKUSchema } from "@/api/SkusAPI";
import { z } from "zod";

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
    bitacoras: z.array(BitacoraTaskProductionEmployeeSchema).optional()
});

export const TaskProductionChange = z.array(
    z.object({
        new_employee: TaskProductionEmployeeSchema,
        old_employee: TaskProductionEmployeeSchema
    })
);

export const EmployeesComodinesSchema = z.object({
    data: z.array(TaskProductionEmployeeSchema)
});

export const TaskProductionTimeOutSchema = z.object({
    id: z.string(),
    name: z.string(),
    start_date: z.string(),
    end_date: z.string().nullable(),
    total_hours: z.number().nullable()
});

export const TaskProductionPerformanceSchema = z.object({
    id: z.string(),
    take_date: z.string(),
    tarimas_produced: z.number().nullable(),
    lbs_bascula: z.number(),
});

export const TaskProductionSchema = z.object({
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
    is_justified: z.boolean().nullable(),
    status: z.number()
});

export const TaskProductionDetailsSchema = TaskProductionSchema.pick({ id: true, line: true, operation_date: true, start_date: true, total_lbs: true }).extend({
    sku: SKUSchema,
    filtered_employees: z.array(TaskProductionEmployeeSchema),
    all_employees: z.array(TaskProductionEmployeeSchema),
    positions: z.array(PositionSchema),
    exists_previuos_config: z.boolean(),
    flag: z.boolean()
});

export const TasksByLineSchema = z.object({
    data: z.array(TaskProductionSchema)
});

export const TaskProductionInProgressSchema = TaskProductionSchema.pick({ line: true, sku: true, start_date: true }).extend({
    HPlan: z.number(),
    HLinea: z.number(),
    HRendimiento: z.number(),
    HTiemposMuertos: z.number(),
    employees: z.array(TaskProductionEmployeeSchema),
    performances: z.array(TaskProductionPerformanceSchema),
    timeouts: z.array(TaskProductionTimeOutSchema),
    percentage: z.number(),
    total_produced: z.number(),
    total_lbs: z.number(),
    total_tarimas: z.number()
})


//TAREA FINALIZADA
export const SummaryGraphHoursByTaskProductionSchema = TaskProductionInProgressSchema.pick({ HPlan: true, HLinea: true, HRendimiento: true, HTiemposMuertos: true });

export const NoteTaskProductionSchema = z.object({
    reason: z.string(),
    action: z.string(),
    user: z.string(),
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
    timeouts: z.array(TaskProductionTimeOutSchema),
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

export const TaskProductionNoOperationDateSchema = TaskProductionSchema.pick({ id: true, line: true, sku: true, total_lbs: true }).extend({
    destination: z.string(),
    product_name: z.string()
});

export const TaskProductionEventSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string()
});

export const TaskProductionPackingMaterialRecipeSchema = z.object({
    packing_material_id: z.string(),
    name: z.string(),
    code: z.string(),
    quantity: z.number(),
    lote: z.string(),
    destination: z.string()
});

export const TaskProductionOperationDateSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    product: z.string(),
    working: z.boolean(),
    finished: z.boolean(),
    total_lbs: z.number(),
    destination: z.string(),
    status: z.string(),
    status_id: z.string(),
    color: z.string(),
    recipe: z.array(TaskProductionPackingMaterialRecipeSchema)
});

export const TasksProductionSelectSchema = z.object({
    data: z.array(TaskProductionOperationDateSchema.pick({
        id: true, line: true, product: true
    }).extend({
        code: z.string(),
        operation_date: z.string()
    }))
});

export const TaskProductionItemSchema = z.object({
    name: z.string(),
    packing_material_id: z.string(),
    quantity: z.number(),
    lote: z.string(),
    destination: z.string(),
    code: z.string()
});

export const TaskProductionItemsSchema = z.object({
    data: z.object({
        available: z.boolean(),
        items: z.array(TaskProductionPackingMaterialRecipeSchema.pick({
            name: true, packing_material_id: true, quantity: true, lote: true, destination: true, code: true
        }))
    })
})

export const TaskProductionReprogramDetailsSchema = TaskProductionOperationDateSchema.pick({ id: true, total_lbs: true, destination: true, line: true, sku: true }).extend({
    line_id: z.string(),
    sku_id: z.string()
});;

