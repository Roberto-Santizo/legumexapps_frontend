import { FieldErrors, UseFormRegister } from "react-hook-form";
import {  } from "./CreatePackingMaterialDispatch";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import { DraftDispatchPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";

type Props = {
  errors: FieldErrors<DraftDispatchPackingMaterial>;
  register: UseFormRegister<DraftDispatchPackingMaterial>;
};

export default function FormPackingMaterialDispatch({ errors, register, }: Props) {
  return (
    <>
      <InputComponent<DraftDispatchPackingMaterial>
        label="Referencia"
        id="reference"
        name="reference"
        placeholder="Ingrese la referencia"
        register={register}
        validation={{ required: "La referencia es obligatoria" }}
        errors={errors}
        type={"text"}
      >
        {errors.reference && (
          <Error>{errors.reference?.message?.toString()}</Error>
        )}
      </InputComponent>

      <InputComponent<DraftDispatchPackingMaterial>
        label="Responsable"
        id="responsable"
        name="responsable"
        placeholder="Ingrese el responsable de cajas"
        register={register}
        validation={{ required: "El nombre del responsable es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.responsable && (
          <Error>{errors.responsable?.message?.toString()}</Error>
        )}
      </InputComponent>
      <InputComponent<DraftDispatchPackingMaterial>
        label="observaciones"
        id="observations"
        name="observations"
        placeholder="Ingrese el responsable de bolsas"
        register={register}
        validation={{}}
        errors={errors}
        type={"text"}
      >
        {errors.observations && (
          <Error>{errors.observations?.message?.toString()}</Error>
        )}
      </InputComponent>
    </>
  );
}
