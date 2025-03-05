import { z } from "zod";


export const DraftBoletaSchema = z.object({
    producer_id: z.string(),
    product_id: z.string(),
    finca_id: z.string(),
    transport: z.string(),
    pilot_name: z.string(),
    inspector_name: z.string(),
    cdp: z.string(),
    transport_plate: z.string(),
    weight: z.number(),
    total_baskets: z.number(),
    quality_percentage: z.number(),
    // inspector_signature: z.string(),
    // prod_signature: z.string(),
    calidad_signature: z.string(),
    basket_id: z.string()
});

export const DraftBoletaControlCalidadSchema = z.object({
    producer_id: z.string(),
    net_weight: z.number(),
    no_doc_cosechero: z.string(),
    sample_units: z.number(),
    total_baskets:z.number(),
    ph: z.number(),
    brix: z.number(),
    percentage:z.number(),
    valid_pounds:z.number(),
    observations: z.string(),
    isMinimunRequire: z.boolean(),
    inspector_signature: z.string(),
});

export const DraftFormProdSchema = z.object({
    total_baskets: z.number(),
    basket_id: z.string(),
    gross_weight: z.number(),
    receptor_signature: z.string()
});

export const ResultsQualityControlDocSchema = z.object({
    id: z.string(),
    result: z.number(), 
    tolerance_percentage:z.number(), 
    input: z.number(), 
});

export const BoletaRMPDetailSchema = z.object({
    id: z.string(),
    producer_id: z.string(),
    producer_code: z.number(),
    product_id: z.string(),
    plate:  z.string(),
    product:  z.string(),
    variety:  z.string(),
    coordinator:  z.string(),
    cdp:  z.string(),
    transport: z.string(),
    baskets: z.number(),
    gross_weight:  z.number(),
    weight_baskets: z.number(),
    net_weight:  z.number(),
    percentage_field: z.number(),
    valid_pounds: z.number(),
    status: z.string(),
    quality_status_id: z.number(),
    minimun_percentage: z.number(),
    total_baskets: z.number(),
    prod_net_weight: z.number().nullable(),
});

export const BoletaSchema = z.object({
    id: z.string(),
    finca:z.string(),
    grn: z.string().nullable(),
    date:z.string(),
    plate: z.string(),
    product: z.string(),
    product_id: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    cdp: z.string(),
    transport: z.string(),
    status: z.string(),
    quality_status_id: z.number(),
    pilot_name:z.string(),
    consignacion: z.boolean()
});

export const BoletasSchema = z.object({
  data: z.array(BoletaSchema)
});

export const BoletasPaginateSchema = z.object({
    data: z.array(BoletaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});


export const defectSchema = z.object({
  id: z.number(),
  name: z.string(),
  input_percentage: z.number(),
  tolerace_percentage: z.number(),
  result: z.number(),
});

export const fieldDataSchema = z.object({
  id: z.string(),
  producer_id: z.string(),
  producer_code: z.number(),
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
  // inspector_agricola_signature: z.string(),
  // producer_signature: z.string(),
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
  producer_code: z.number(),
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
    observations:z.string(),
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

export const DraftBoletaTransportSchema = z.object({
    planta_id: z.string(),
    product_id: z.string(),
    rm_reception_id: z.string(),
    pilot_name: z.string(),
    truck_type: z.string(),
    plate: z.string(),
    observations: z.string().nullable(),
    verify_by_signature: z.string(),
    quality_manager_signature: z.string()
});


