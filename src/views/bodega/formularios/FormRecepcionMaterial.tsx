import Error from "@/components/utilities-components/Error";
import {DraftMaterialReception} from "../recepcion-material-empaque/CrearRecepcionMaterial";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";

type Props = {
  errors: FieldErrors<DraftMaterialReception>;
  register: UseFormRegister<DraftMaterialReception>;
};

export default function FormRecepcionMaterial ({ errors, register }: Props){
  return (
    <>
      <InputComponent<DraftMaterialReception>
        label="Lote"
        id="lote"
        name="lote"
        placeholder="Ingrese el lote"
        register={register}
        validation={{ required: "El dato del lote es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.lote && <Error>{errors.lote?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftMaterialReception>
        label="Cantidad"
        id="quantity"
        name="quantity"
        placeholder="Ingrese la cantidad"
        register={register}
        validation={{ required: "El el dato de la cantidad es obligatoria" }}
        errors={errors}
        type={"text"}
      >
        {errors.quantity && <Error> {errors.quantity?.message?.toString()} </Error>}
      </InputComponent>

      <InputComponent<DraftMaterialReception>
        label="Fecha de factura"
        id="invoice_date"
        name="invoice_date"
        placeholder="Ingrese la fecha de recepcion"
        register={register}
        validation={{ required: "La fecha de factura es obligatoria" }}
        errors={errors}
        type={"date"}
      >
        {errors.invoice_date && <Error> {errors.invoice_date?.message?.toString()} </Error>}
      </InputComponent>
    </>
  );
}
