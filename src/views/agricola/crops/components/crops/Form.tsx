import { DraftCrop } from "../../types";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";

type Props = {
    register: UseFormRegister<DraftCrop>;
    errors: FieldErrors<DraftCrop>;
}

export default function Form({ register, errors }: Props) {
    return (
        <>
            <InputComponent<DraftCrop>
                label="Nombre"
                id="name"
                name="name"
                placeholder="Nombre del cultivo"
                register={register}
                validation={{ required: 'El campo es obligatorio' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftCrop>
                label="Código"
                id="code"
                name="code"
                placeholder="Código del cultivo"
                register={register}
                validation={{ required: 'El campo es obligatorio' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>
        </>
    )
}
