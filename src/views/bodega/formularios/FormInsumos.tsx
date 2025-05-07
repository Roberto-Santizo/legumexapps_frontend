
import Error from "@/components/utilities-components/Error";
import {DraftInputs} from "./CrearInsumo"
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";

type Props = {
  errors: FieldErrors<DraftInputs>;
  register: UseFormRegister<DraftInputs>;
};

export default function FormInsumos ({ errors, register }: Props){
  return (
    <>
      <InputComponent<DraftInputs>
        label="Unidades"
        id="units"
        name="units"
        placeholder="Ingrese las unidades"
        register={register}
        validation={{ required: "El dato del unidades es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.units && <Error>{errors.units?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftInputs>
        label="Valor unitario"
        id="unit_value"
        name="unit_value"
        placeholder="Ingrese el valor unitario"
        register={register}
        validation={{ required: "El el dato de valor unitario es obligatoria" }}
        errors={errors}
        type={"text"}
      >
        {errors.unit_value && <Error> {errors.unit_value?.message?.toString()} </Error>}
      </InputComponent>

      <InputComponent<DraftInputs>
        label="Valor total"
        id="total_value"
        name="total_value"
        placeholder="Ingrese el valor total"
        register={register}
        validation={{ required: "El valor total es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.total_value && <Error> {errors.total_value?.message?.toString()} </Error>}
      </InputComponent>

      <InputComponent<DraftInputs>
        label="Factura"
        id="invoice"
        name="invoice"
        placeholder="Ingrese el dato de la factura"
        register={register}
        validation={{ required: "El dato de la factura es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.invoice && <Error> {errors.invoice?.message?.toString()} </Error>}
      </InputComponent>

      <InputComponent<DraftInputs>
        label="Fecha Factura"
        id="invoice_date"
        name="invoice_date"
        placeholder="Ingrese la fecha de la factura"
        register={register}
        validation={{ required: "La fecha de la factura es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.invoice_date && <Error> {errors.invoice_date?.message?.toString()} </Error>}
      </InputComponent>
      
      <InputComponent<DraftInputs>
        label="Fecha de Recepción"
        id="receipt_date"
        name="receipt_date"
        placeholder="Ingrese la fecha de recepcion"
        register={register}
        validation={{ required: "El dato de la fecha de recepción es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.receipt_date && <Error> {errors.receipt_date?.message?.toString()} </Error>}
      </InputComponent>
    </>
  );
}
