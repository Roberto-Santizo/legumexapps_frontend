
import Error from "@/components/utilities-components/Error";
import { DraftSuppliers } from "./CrearProveedor";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";

type Props = {
    errors: FieldErrors<DraftSuppliers>;
    register: UseFormRegister<DraftSuppliers>;
}

export default function FormProveedor({ errors, register }: Props) {
    return (
        <>
        <InputComponent<DraftSuppliers>
          label="Código"
          id="code"
          name="code"
          placeholder="Ingrese el código del proveedor"
          register={register}
          validation={{ required: "El código del proveedor es obligatorio" }}
          errors={errors}
          type={"text"}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftSuppliers>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Ingrese el nombre del proveedor"
          register={register}
          validation={{ required: "El nombre del proveedor es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.name && (
            <Error>{errors.name?.message?.toString()}</Error>
          )}
        </InputComponent>


        </>
    )
}
