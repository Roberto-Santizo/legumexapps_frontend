import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftTransactionPackingMaterial } from "../types/types";
import InputSelectComponent from "@/components/form/InputSelectComponent";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

type Props = {
  errors: FieldErrors<DraftTransactionPackingMaterial>;
  register: UseFormRegister<DraftTransactionPackingMaterial>;
  control: Control<DraftTransactionPackingMaterial, any>
};

export default function Form({ errors, register }: Props) {

  const optionsType = [
    { value: "1", label: "ENTREGA" },
    { value: "2", label: "DEVOLUCIÓN" },
  ]

  return (
    <>
      <InputComponent<DraftTransactionPackingMaterial>
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

      <InputComponent<DraftTransactionPackingMaterial>
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
      <InputComponent<DraftTransactionPackingMaterial>
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

      <InputSelectComponent<DraftTransactionPackingMaterial>
        label="Tipo de transacción"
        id="type"
        name="type"
        options={optionsType}
        register={register}
        validation={{ required: "El tipo de transacción es obligatorio" }}
        errors={errors}
      >
        {errors.type && <Error>{errors.type?.message?.toString()}</Error>}
      </InputSelectComponent>
    </>
  );
}
