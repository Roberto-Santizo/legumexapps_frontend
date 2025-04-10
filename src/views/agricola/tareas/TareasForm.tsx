import Error from "@/components/utilities-components/Error";
import { DraftTarea } from "./CreateTarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";

type Props = {
    errors: FieldErrors<DraftTarea>;
    register: UseFormRegister<DraftTarea>;
}

export default function TareasForm({ errors, register }: Props) {
    return (
        <>
            <InputComponent<DraftTarea>
                label="Nombre de la tarea"
                id="name"
                name="name"
                placeholder="Nombre de la tarea"
                register={register}
                validation={{ required: 'El nombre de la tarea es requerido' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftTarea>
                label="Codigo"
                id="code"
                name="code"
                placeholder="Codigo de la tarea"
                register={register}
                validation={{ required: 'El codigo de la tarea es requerida' }}
                errors={errors}
                type={'text'}
            >
                {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftTarea>
                label="Descripción"
                id="description"
                name="description"
                placeholder="Descripción de la tarea"
                register={register}
                validation={{}}
                errors={errors}
                type={'text'}
            >
                {errors.description && <Error>{errors.description?.message?.toString()}</Error>}
            </InputComponent>
        </>
    )
}
