import { FiltersBoletaRMP } from "@/components/filters/FiletrsRMP";
import clienteAxios from "@/config/axios";
import { DraftFormProd } from "@/views/calidad/rmp/Boleta_form2";
import { DraftBoletaControlCalidad } from "@/views/calidad/rmp/Boleta_form3";
import { isAxiosError } from "axios";
import { z } from "zod";

export type DraftBoletaRMP = {
    producer_id: string,
    product_id: string,
    finca_id: string,
    transport: string,
    pilot_name: string,
    inspector_name: string,
    cdp: string,
    transport_plate: string,
    weight: number,
    total_baskets: number,
    quality_percentage: number,
    calidad_signature: string,
    basket_id: string,
    date: string,
    carrier_id: string,
    productor_plantation_control_id: string,
    driver_id: string,
    plate_id: string,
    ref_doc: string
}

export const fieldDataSchema = z.object({
    id: z.string(),
    ref_doc: z.string(),
    producer_id: z.string(),
    producer_code: z.string(),
    product_id: z.string(),
    plate: z.string(),
    product: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    inspector: z.string(),
    pilot_name: z.string(),
    doc_date: z.string(),
    cdp: z.string(),
    transport: z.string(),
    baskets: z.number(),
    weight_basket: z.number(),
    gross_weight: z.number(),
    weight_baskets: z.number(),
    net_weight: z.number(),
    percentage_field: z.number(),
    valid_pounds: z.number(),
    status: z.string(),
    quality_status_id: z.number(),
    minimun_percentage: z.number(),
    total_baskets: z.number(),
    calidad_signature: z.string(),
    calidad_pdf_signature: z.string()
});

export const prodDataSchema = z.object({
    id: z.number(),
    total_baskets: z.number(),
    weight_baskets: z.number(),
    gross_weight: z.number(),
    tara: z.number(),
    net_weight: z.number(),
    receptor_signature: z.string(),
    receptor_pdf_signature: z.string()
});

export const defectSchema = z.object({
    id: z.number(),
    name: z.string(),
    input_percentage: z.number(),
    tolerace_percentage: z.number(),
    result: z.number(),
});

export const qualityDocDataSchema = z.object({
    id: z.number(),
    percentage: z.number(),
    valid_pounds: z.number(),
    inspector_planta_signature: z.string(),
    inspector_pdf_planta_signature: z.string(),
    date: z.string(),
    producer_name: z.string(),
    variety: z.string(),
    grn: z.string().nullable(),
    net_weight: z.number(),
    no_hoja_cosechero: z.nullable(z.string()),
    sample_units: z.string(),
    total_baskets: z.number(),
    producer_code: z.string(),
    ph: z.number().nullable(),
    brix: z.number().nullable(),
    observations: z.string().nullable(),
    inspector_planta_name: z.string(),
    defects: z.array(defectSchema),
    total_defects_evaluation: z.number(),
});

export const TransportDocConditionSchema = z.object({
    id: z.number(),
    condition: z.string(),
    status: z.boolean()
});

export const TransportDocSchema = z.object({
    id: z.number(),
    verify_by: z.string(),
    planta: z.string(),
    pilot_name: z.string(),
    product: z.string(),
    truck_type: z.string(),
    date: z.string(),
    plate: z.string(),
    observations: z.string(),
    quality_manager_signature: z.string(),
    verify_by_signature: z.string(),
    conditions: z.array(TransportDocConditionSchema)
})



export const BoletaInfoAllSchema = z.object({
    status: z.number(),
    finca: z.string(),
    consignacion: z.boolean(),
    grn: z.string().nullable(),
    field_data: fieldDataSchema,
    prod_data: prodDataSchema.nullable(),
    quality_doc_data: qualityDocDataSchema.nullable(),
    transport_data: TransportDocSchema.nullable()
});

export const DraftBoletaRMPSchema = z.object({
    doc: BoletaInfoAllSchema,
    msg: z.string()
})
export type BoletaInfoAll = z.infer<typeof BoletaInfoAllSchema>;

export async function createBoletaRMP(FormData: DraftBoletaRMP) {
    try {
        const url = '/api/boleta-rmp';
        const { data } = await clienteAxios.post(url, FormData);
        const result = BoletaInfoAllSchema.safeParse(data);
        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const BoletaSchema = z.object({
    id: z.string(),
    finca: z.string(),
    grn: z.string().nullable(),
    date: z.string(),
    plate: z.string(),
    product: z.string(),
    product_id: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    cdp: z.string(),
    transport: z.string(),
    status: z.string(),
    quality_status_id: z.number(),
    pilot_name: z.string(),
    consignacion: z.boolean()
});

export type Boleta = z.infer<typeof BoletaSchema>

export const BoletasPaginateSchema = z.object({
    data: z.array(BoletaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional(),
});

export type BoletasPaginate = z.infer<typeof BoletasPaginateSchema>


export async function getBoletasRMP({ page, filters, paginated, transport_doc_create }: { page: number, filters: FiltersBoletaRMP, paginated: string, transport_doc_create: string }): Promise<BoletasPaginate> {
    try {
        const params = new URLSearchParams({ ...filters });
        const url = `/api/boleta-rmp?paginated=${paginated}&page=${page}&${params.toString()}&transport_doc_create=${transport_doc_create}`;
        const { data } = await clienteAxios(url);
        const result = BoletasPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const BoletaRMPDetailSchema = z.object({
    id: z.string(),
    producer_id: z.string(),
    producer_code: z.string(),
    product_id: z.string(),
    plate: z.string(),
    product: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    cdp: z.string(),
    transport: z.string(),
    baskets: z.number(),
    gross_weight: z.number(),
    weight_baskets: z.number(),
    net_weight: z.number(),
    percentage_field: z.number(),
    valid_pounds: z.number(),
    status: z.string(),
    quality_status_id: z.number(),
    minimun_percentage: z.number(),
    total_baskets: z.number(),
    prod_net_weight: z.number().nullable(),
});

export type BoletaDetail = z.infer<typeof BoletaRMPDetailSchema>


export async function getBoletaRMPDetail(id: Boleta['id']): Promise<BoletaDetail> {
    try {
        const url = `/api/boleta-rmp/${id}`;
        const { data } = await clienteAxios(url);
        const result = BoletaRMPDetailSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}


export async function createProdData({ FormData, id }: { FormData: DraftFormProd, id: Boleta['id'] }) {
    try {
        const url = `/api/boleta-rmp/prod/${id}`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}
export const ResultsQualityControlDocSchema = z.object({
    id: z.string(),
    result: z.number(),
    tolerance_percentage: z.number(),
    input: z.number(),
});

export type ResultBoletaCalidad = z.infer<typeof ResultsQualityControlDocSchema>

export async function createQualityDoc({ FormData, id, results }: { FormData: DraftBoletaControlCalidad, id: Boleta['id'], results: ResultBoletaCalidad[] }) {
    try {
        const url = `/api/boleta-rmp/calidad/${id}`;
        const { data } = await clienteAxios.post<string>(url, { data: FormData, results });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updateGRN({ grn, id }: { grn: string, id: Boleta['id'] }) {
    try {
        const url = `/api/boleta-rmp/generate-grn/${id}`;
        const { data } = await clienteAxios.post<string>(url, { grn });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}


export async function getBoletaInfoAll(id: Boleta['id']) {
    try {
        const url = `/api/boleta-rmp-info-doc/${id}`;
        const { data } = await clienteAxios(url);
        const result = BoletaInfoAllSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function rejectBoleta(id: Boleta['id']) {
    try {
        const url = `/api/boleta-rmp/${id}/reject`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const QualityStatusSchema = z.object({
    id: z.string(),
    name: z.string()
});

export type QualityStatus = z.infer<typeof QualityStatusSchema>

export const QualityStatusesSchema = z.object({
    data: z.array(QualityStatusSchema)
});

export async function getQualityStatuses(): Promise<QualityStatus[]> {
    try {
        const url = `/api/quality-statuses`;
        const { data } = await clienteAxios(url);
        const result = QualityStatusesSchema.safeParse(data);
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