import Error from "@/components/utilities-components/Error";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import { DraftTask } from "types/taskGeneralType";

type Props = {
    errors: FieldErrors<DraftTask>;
    register: UseFormRegister<DraftTask>;
}

export default function Form({ errors, register }: Props) {
    return (
        <>
            <InputComponent<DraftTask>
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

            <InputComponent<DraftTask>
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

            <InputComponent<DraftTask>
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
