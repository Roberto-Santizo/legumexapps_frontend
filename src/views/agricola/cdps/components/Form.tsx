import { DraftCDP } from "../types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

interface Props {
    errors: FieldErrors<DraftCDP>;
    register: UseFormRegister<DraftCDP>;
}

export default function Form({ register, errors } : Props) {
    return (
        <>
            <InputComponent<DraftCDP>
                label="Control de plantación"
                id="name"
                name="name"
                placeholder="Nombre del CDP"
                register={register}
                validation={{ required: 'El nombre del CDP es obligatorio' }}
                errors={errors}
                type={'text'}
            >
                {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftCDP>
                label="Fecha de Inicio del CDP"
                id="start_date"
                name="start_date"
                placeholder=""
                register={register}
                validation={{ required: 'Fecha de inicio del CDP es obligatorio' }}
                errors={errors}
                type={'date'}
            >
                {errors.start_date && <Error>{errors.start_date?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftCDP>
                label="Fecha Final del CDP"
                id="end_date"
                name="end_date"
                placeholder=""
                register={register}
                validation={{ required: 'Fecha final del CDP es obligatoria' }}
                errors={errors}
                type={'date'}
            >
                {errors.end_date && <Error>{errors.end_date?.message?.toString()}</Error>}
            </InputComponent>
        </>
    )
}
