import { getLinesBySkuId } from "@/api/LinesAPI";
import { getSkus } from "@/api/SkusAPI";
import { NewTaskProductionDraft } from "@/components/modals/ModalAddNewDraftProductionTask";
import { useQuery } from "@tanstack/react-query";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { FiltersSkuInitialValues } from "../stock-keeping-units/Index";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Error from "@/components/utilities-components/Error";

type Props = {
    control: Control<NewTaskProductionDraft>;
    errors: FieldErrors<NewTaskProductionDraft>;
    register: UseFormRegister<NewTaskProductionDraft>;
    skuId: string;
    setSkuId: Dispatch<SetStateAction<string>>;
}

export default function FormNewDraftTaskProduction({ register, errors, control, skuId, setSkuId }: Props) {

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

    if (skus) return (
        <>
            <InputSelectSearchComponent<NewTaskProductionDraft>
                label="SKU"
                id="stock_keeping_unit_id"
                name="stock_keeping_unit_id"
                options={skuOptions ?? []}
                control={control}
                rules={{ required: 'Seleccione un SKU' }}
                errors={errors}
                onChange={(value) => setSkuId(value ?? '')}
            >
                {errors.stock_keeping_unit_id && <Error>{errors.stock_keeping_unit_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>


            <InputSelectSearchComponent<NewTaskProductionDraft>
                label="Linea"
                id="line_id"
                name="line_id"
                options={lineas || []}
                control={control}
                rules={{}}
                errors={errors}
            >
                {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>

            <InputComponent<NewTaskProductionDraft>
                label="Total de Libras"
                id="total_lbs"
                name="total_lbs"
                placeholder="Total de Libras"
                register={register}
                validation={{ required: 'El total de libras es requerida' }}
                errors={errors}
                type={'number'}
            >
                {errors.total_lbs && <Error>{errors.total_lbs?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<NewTaskProductionDraft>
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
        </>
    )
}
