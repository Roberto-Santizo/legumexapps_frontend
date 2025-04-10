import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftDefecto } from "../modals/ModalCrearDefecto";
import Error from "@/components/utilities-components/Error";
import InputComponent from "../form/InputComponent";

type Props = {
    register: UseFormRegister<DraftDefecto>;
    errors: FieldErrors<DraftDefecto>;
}

export default function DefectForm({ register, errors }: Props) {
    return (
        <>
            <InputComponent<DraftDefecto>
                label="Nombre del  Defecto"
                id="name"
                name="name"
                placeholder="Nombre del Defecto"
                register={register}
                validation={{ required: 'El nombre del defecto es obligatorio' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftDefecto>
                label="Porcentaje de Tolerancia"
                id="tolerance_percentage"
                name="tolerance_percentage"
                placeholder="Porcentaje de Toleracia"
                register={register}
                validation={{ required: 'El porcentaje de tolerancia es obligatoria' }}
                errors={errors}
                type={'number'}
            >
                {errors.tolerance_percentage && <Error>{errors.tolerance_percentage?.message?.toString()}</Error>}
            </InputComponent>
        </>
    )
}
