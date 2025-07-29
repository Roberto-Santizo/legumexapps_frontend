import { getLinesBySkuId } from "@/api/LineasAPI";
import { getSkus } from "@/api/SkusAPI";
import { NewTaskProductionDraft } from "@/components/modals/ModalAddNewDraftProductionTask";
import { useQuery } from "@tanstack/react-query";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Error from "@/components/utilities-components/Error";
import { Dispatch, SetStateAction } from "react";

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
        queryFn: () => getSkus({ page: 1, paginated: '' })
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
                rules={{ required: 'Seleccione una linea' }}
                errors={errors}
            >
                {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>

            <InputComponent<NewTaskProductionDraft>
                label="Total de Cajas"
                id="total_boxes"
                name="total_boxes"
                placeholder="Total de Libras"
                register={register}
                validation={{ required: 'El total de cajas es requerida' }}
                errors={errors}
                type={'number'}
            >
                {errors.total_boxes && <Error>{errors.total_boxes?.message?.toString()}</Error>}
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
