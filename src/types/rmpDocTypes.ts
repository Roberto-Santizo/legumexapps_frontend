import { BoletaInfoAllSchema, BoletaRMPDetailSchema, BoletaSchema, BoletasPaginateSchema, QualityStatusSchema, ResultsQualityControlDocSchema } from "@/utils/rmpDocSchemas";
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

export type BoletaRmpAllInfo = z.infer<typeof BoletaInfoAllSchema>;
export type BoletaRMP = z.infer<typeof BoletaSchema>;
export type BoletasRmpPaginate = z.infer<typeof BoletasPaginateSchema>;
export type BoletaRmpDetail = z.infer<typeof BoletaRMPDetailSchema>;
export type QualityStatus = z.infer<typeof QualityStatusSchema>;

export type ResultBoletaRmpCalidad = z.infer<typeof ResultsQualityControlDocSchema>



