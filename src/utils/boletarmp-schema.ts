import { z } from "zod";


export const DraftBoletaSchema = z.object({
    producer_id: z.string(),
    product_id: z.string(),
    transport: z.string(),
    pilot_name: z.string(),
    inspector_name: z.string(),
    cdp: z.string(),
    transport_plate: z.string(),
    weight: z.number(),
    total_baskets: z.number(),
    quality_percentage: z.number(),
    inspector_signature: z.string(),
    prod_signature: z.string(),
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
    status: z.number(),
    minimun_percentage: z.number(),
    total_baskets: z.number(),
});

export const BoletaSchema = z.object({
    id: z.string(),
    plate: z.string(),
    product: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    cdp: z.string(),
    transport: z.string(),
    status: z.number()
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
  status: z.number(),
  minimun_percentage: z.number(),
  total_baskets: z.number(),
  inspector_agricola_signature: z.string(),
  producer_signature: z.string(),
});

export const prodDataSchema = z.object({
  id: z.number(),
  total_baskets: z.number(),
  weight_baskets: z.number(),
  gross_weight: z.number(),
  tara: z.number(),
  net_weight: z.number(),
  receptor_signature: z.string()
});

export const qualityDocDataSchema = z.object({
  id: z.number(),
  percentage: z.number(),
  valid_pounds: z.number(),
  inspector_planta_signaure: z.string(),
  date: z.string(), 
  time: z.string(),
  producer_name: z.string(),
  variety: z.string(),
  grn: z.string(),
  net_weight: z.number(),
  no_hoja_cosechero: z.nullable(z.string()),
  sample_units: z.string(),
  total_baskets: z.number(),
  producer_code: z.number(),
  ph: z.number(),
  brix: z.number(),
  observations: z.string(),
  inspector_planta_name: z.string(),
  defects: z.array(defectSchema),
  total_defects_evaluation: z.number(),
});

export const BoletaInfoAllSchema = z.object({
  status: z.number(),
  grn: z.string(),
  field_data: fieldDataSchema,
  prod_data: prodDataSchema,
  quality_doc_data: qualityDocDataSchema,
});


