import Error from "@/components/utilities-components/Error";
import { DraftMaterialReception } from "../recepcion-material-empaque/CrearRecepcionMaterial";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import { getPackingMaterials } from "@/api/MaterialEmpaqueAPI";
import { useQuery } from "@tanstack/react-query";
// import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

type Props = {
  errors: FieldErrors<DraftMaterialReception>;
  register: UseFormRegister<DraftMaterialReception>;
};

export default function FormRecepcionMaterial({ errors, register }: Props) {
  const { data } = useQuery({
    queryKey: ['getPackingMaterials'],
    queryFn: getPackingMaterials
  });

  const options = data?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  console.log(options);

  return (
    <>
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

      {/* <InputSelectSearchComponent<DraftMaterialReception>
        label=""
        id=""
        name=""
        options={}
        control={control}
        rules={}
        errors={errors}
      >
          {errors. && <Error>{errors.?.message?.toString()}</Error>}
      </InputSelectSearchComponent> */}

      <table className="table">
        <thead>
          <tr className="thead-tr">
            <th className="thead-tr"></th>
            <th className="thead-tr">Item</th>
            <th className="thead-tr">Lote</th>
            <th className="thead-tr">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí puedes mapear los datos */}
        </tbody>
      </table>
    </>
  );
}
