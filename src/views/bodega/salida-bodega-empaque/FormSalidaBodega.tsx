import InputComponent from "@/components/form/InputComponent";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftBodegaSalida } from "./CreateBodegaSalida-empaque";
import Error from "@/components/utilities-components/Error";

type Props = {
  errors: FieldErrors<DraftBodegaSalida>;
  register: UseFormRegister<DraftBodegaSalida>;
};

export default function FormSalidaBodega({
  errors,
  register,
}: Props): JSX.Element {
  return (
    <>
      <InputComponent<DraftBodegaSalida>
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
      <InputComponent<DraftBodegaSalida>
        label="Responsable de bolsas"
        id="responsable_bags"
        name="responsable_bags"
        placeholder="Ingrese el responsable de bolsas"
        register={register}
        validation={{ required: "La el responsable de bolsa es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.responsable_bags && (
          <Error>{errors.responsable_bags?.message?.toString()}</Error>
        )}
      </InputComponent>
      <InputComponent<DraftBodegaSalida>
        label="Responsable de cajas"
        id="responsable_boxes"
        name="responsable_boxes"
        placeholder="Ingrese el responsable de cajas"
        register={register}
        validation={{ required: "La el responsable de bolsa es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.responsable_boxes && (
          <Error>{errors.responsable_boxes?.message?.toString()}</Error>
        )}
      </InputComponent>
      <InputComponent<DraftBodegaSalida>
        label="observaciones"
        id="observations"
        name="observations"
        placeholder="Ingrese el responsable de bolsas"
        register={register}
        validation={{ required: "La el responsable de bolsa es obligatorio" }}
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
