import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftRole } from "@/types/rolesTypes";
import Error from "@/components/utilities-components/Error";
import InputTextComponent from "@/components/form/InputComponent";

type Props = {
    register: UseFormRegister<DraftRole>;
    errors: FieldErrors<DraftRole>;
}

export default function RolesForm({ register, errors }: Props) {
    return (
        <InputTextComponent<DraftRole>
            label="Nombre del Rol"
            id="name"
            name="name"
            placeholder="Nombre del Rol"
            register={register}
            validation={{ required: "El nombre del rol es obligatorio" }}
            errors={errors}
        >
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}

        </InputTextComponent>
    )
}
