import { DraftRecepcionInsumos } from "./CrearRecepcionInsumos";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllProveedores } from "@/api/BodegaProveedoresAPI";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

type Props = {
  errors: FieldErrors<DraftRecepcionInsumos>;
  register: UseFormRegister<DraftRecepcionInsumos>;
  control: Control<DraftRecepcionInsumos, any>;
};

export default function FormRecepcionInsumos({ errors, register, control }: Props) {

  const { data: suppliers, isLoading, isError } = useQuery({
    queryKey: ['getAllProveedores'],
    queryFn: getAllProveedores
  });

  const options = suppliers?.map((supplier) => ({
    value: supplier.id,
    label: `${supplier.name}`,
  }));

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (options) return (
    <>
      <InputComponent<DraftRecepcionInsumos>
        label="Factura"
        id="invoice"
        name="invoice"
        placeholder="No. de factura"
        register={register}
        validation={{ required: "El número de factura es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.invoice && <Error>{errors.invoice?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftRecepcionInsumos>
        label="Fecha de Factura"
        id="invoice_date"
        name="invoice_date"
        placeholder=""
        register={register}
        validation={{ required: "La fecha de la factura es obligatoria" }}
        errors={errors}
        type={"date"}
      >
        {errors.invoice_date && <Error>{errors.invoice_date?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftRecepcionInsumos>
        label="Nombre del Supervisor"
        id="supervisor_name"
        name="supervisor_name"
        placeholder="Nombre del supervisor"
        register={register}
        validation={{ required: "El nombre del supervisor es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.supervisor_name && <Error>{errors.supervisor_name?.message?.toString()}</Error>}
      </InputComponent>

      <InputSelectSearchComponent<DraftRecepcionInsumos>
        label="Proveedor"
        id="supplier_id"
        name="supplier_id"
        options={options}
        control={control}
        rules={{ required: 'El proveedor es requerido' }}
        errors={errors}
      >
        {errors.supplier_id && <Error>{errors.supplier_id?.message?.toString()}</Error>}
      </InputSelectSearchComponent>
    </>
  );
}
