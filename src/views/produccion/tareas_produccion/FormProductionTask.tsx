import { DraftNewTaskProduction } from "@/components/modals/ModalCrearTareaProduccion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLinesBySkuId } from "@/api/LinesAPI";
import { getSkus } from "@/api/SkusAPI";
import { Control, FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { getCurrentDate } from "@/helpers";
import { FiltersSkuInitialValues } from "../sku/IndexSKU";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Error from "@/components/utilities-components/Error";

type Props = {
    control: Control<DraftNewTaskProduction>;
    errors: FieldErrors<DraftNewTaskProduction>;
    register: UseFormRegister<DraftNewTaskProduction>;
    getValues?: UseFormGetValues<DraftNewTaskProduction>;
}

export default function FormProductionTask({ control, errors, register, getValues }: Props) {
    const initialSkuId = getValues ? getValues('sku_id') : '';
    const [skuId, setSkuId] = useState<string>(initialSkuId ?? '');

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', skuId],
        queryFn: () => getLinesBySkuId(skuId),
        enabled: !!skuId
    });

    const { data: skus } = useQuery({
        queryKey: ['getSkus'],
        queryFn: () => getSkus({ page: 1, paginated: '', filters: FiltersSkuInitialValues })
    });

    const skuOptions = skus?.data?.map((sku) => ({
        value: sku.id,
        label: `${sku.code} - ${sku.product_name}`,
    }));

    return (
        <>
            <InputSelectSearchComponent<DraftNewTaskProduction>
                label="SKU"
                id="sku_id"
                name="sku_id"
                options={skuOptions ?? []}
                control={control}
                rules={{ required: 'Seleccione un SKU' }}
                errors={errors}
                onChange={(value) => setSkuId(value ?? '')}
            >
                {errors.sku_id && <Error>{errors.sku_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>


            <InputSelectSearchComponent<DraftNewTaskProduction>
                label="Linea"
                id="line_id"
                name="line_id"
                options={lineas || []}
                control={control}
                rules={{ required: 'Seleccione una linea' }}
                errors={errors}
            >
                {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>

            <InputComponent<DraftNewTaskProduction>
                label="Total de Libras"
                id="total_lbs"
                name="total_lbs"
                placeholder="Total de Libras"
                register={register}
                validation={{ required: 'Las libras totales son obligatorias' }}
                errors={errors}
                type={'number'}
            >
                {errors.total_lbs && <Error>{errors.total_lbs?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftNewTaskProduction>
                label="Destino"
                id="destination"
                name="destination"
                placeholder="Nombre del Destino"
                register={register}
                validation={{ required: 'El destino es requerido' }}
                errors={errors}
                type={'text'}
            >
                {errors.destination && <Error>{errors.destination?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftNewTaskProduction>
                label="Fecha de Operación"
                id="operation_date"
                name="operation_date"
                placeholder=""
                register={register}
                validation={{}}
                errors={errors}
                type={'date'}
                min={getCurrentDate()}
            >
                {errors.operation_date && <Error>{errors.operation_date?.message?.toString()}</Error>}
            </InputComponent>


        </>
    )
}
