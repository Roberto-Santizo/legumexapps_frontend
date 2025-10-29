import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftPermiso } from "@/views/admin/permisos/types";
import Error from "@/components/utilities-components/Error";
import InputTextComponent from "@/components/form/InputComponent";

type Props = {
    errors: FieldErrors<DraftPermiso>;
    register: UseFormRegister<DraftPermiso>;
}

export default function PermisosForm({ errors, register }: Props) {
    return (
        <InputTextComponent<DraftPermiso>
            label="Nombre del permiso"
            id="name"
            name="name"
            placeholder="Nombre del Permiso"
            register={register}
            validation={{ required: "El nombre del permiso es obligatorio" }}
            errors={errors}
        >
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputTextComponent>
    )
}
