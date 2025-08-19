import { DraftNewTaskProduction } from "@/components/modals/ModalCrearTareaProduccion";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { getCurrentDate } from "@/helpers";
import { Dispatch, SetStateAction } from "react";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

type Props = {
    control: Control<DraftNewTaskProduction>;
    errors: FieldErrors<DraftNewTaskProduction>;
    register: UseFormRegister<DraftNewTaskProduction>;
    skus: { value: string; label: string }[];
    lines: { value: string; label: string }[];
    disabled?: boolean;
    setSkuId?: Dispatch<SetStateAction<string>>;
}

export default function FormProductionTask({ control, errors, register, skus, lines, disabled = false, setSkuId }: Props) {
    return (
        <>
            <InputSelectSearchComponent<DraftNewTaskProduction>
                label="SKU"
                id="sku_id"
                name="sku_id"
                options={skus}
                control={control}
                rules={{ required: 'Seleccione un SKU' }}
                errors={errors}
                onChange={(e) => setSkuId && setSkuId(e ?? '')}
                disabled={disabled}
            >
                {errors.sku_id && <Error>{errors.sku_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>


            <InputSelectSearchComponent<DraftNewTaskProduction>
                label="Linea"
                id="line_id"
                name="line_id"
                options={lines}
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
