import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftMaterialEmpaque } from "../types/types";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

type Props = {
  errors: FieldErrors<DraftMaterialEmpaque>;
  register: UseFormRegister<DraftMaterialEmpaque>;
  control: Control<DraftMaterialEmpaque, any>;
};

export default function Form({ errors, register }: Props) {

  return (
    <>
      <InputComponent<DraftMaterialEmpaque>
        label="Nombre"
        id="name"
        name="name"
        placeholder="Nombre del item"
        register={register}
        validation={{ required: 'El nombre del item es requerido' }}
        errors={errors}
        type={'text'}
      >
        {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftMaterialEmpaque>
        label="Descripción"
        id="description"
        name="description"
        placeholder="Descripción del Item"
        register={register}
        validation={{ required: 'La descripción del item es requerida' }}
        errors={errors}
        type={'text'}
      >
        {errors.description && <Error>{errors.description?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftMaterialEmpaque>
        label="Código del Item"
        id="code"
        name="code"
        placeholder="Código del Item Material Empaque"
        register={register}
        validation={{ required: 'El código del item es requerido' }}
        errors={errors}
        type={'text'}
      >
        {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
      </InputComponent>
    </>
  );
}
