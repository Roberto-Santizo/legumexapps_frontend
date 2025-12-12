import { NewTaskProductionDraft } from "@/components/modals/ModalAddNewDraftProductionTask";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { useRole } from "@/hooks/useRole";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

type Props = {
    control: Control<NewTaskProductionDraft>;
    errors: FieldErrors<NewTaskProductionDraft>;
    register: UseFormRegister<NewTaskProductionDraft>;
    skus: { value: string; label: string }[];
    lines: { value: string; label: string }[];
    disabled?: boolean;
    setSkuId?: Dispatch<SetStateAction<string>>;
}

export default function FormNewDraftTaskProduction({ register, errors, skus, lines, setSkuId, control, disabled = false }: Props) {
    const { data: role } = useRole();
    if (role) return (
        <>
            <InputSelectSearchComponent<NewTaskProductionDraft>
                label="SKU"
                id="stock_keeping_unit_id"
                name="stock_keeping_unit_id"
                options={skus ?? []}
                control={control}
                rules={{ required: 'Seleccione un SKU' }}
                errors={errors}
                onChange={(value) => setSkuId && setSkuId(value ?? '')}
                disabled={disabled}
            >
                {errors.stock_keeping_unit_id && <Error>{errors.stock_keeping_unit_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>

            {(role == 'logistics' || role == 'admin' || role == 'adminprod') && (
                <>
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
            )}

            <InputSelectSearchComponent<NewTaskProductionDraft>
                label="Linea"
                id="line_id"
                name="line_id"
                options={lines ?? []}
                control={control}
                rules={{}}
                errors={errors}
            >
                {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
            </InputSelectSearchComponent>
        </>
    )
}
