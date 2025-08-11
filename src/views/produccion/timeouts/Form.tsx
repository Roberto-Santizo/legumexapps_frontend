import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form"
import { DraftTiempoMuerto } from "./Create";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";

type Props = {
    register: UseFormRegister<DraftTiempoMuerto>;
    errors: FieldErrors<FieldValues>
}

export default function Form({ register, errors }: Props) {
    return (
        <>
            <InputComponent<DraftTiempoMuerto>
                label="Descripción"
                id="name"
                name="name"
                placeholder="Descripcioón del tiempo muerto"
                register={register}
                validation={{ required: 'La descripción del tiempo muerto es obligatoria' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>
        </>
    )
}
