import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftMaterialEmpaque } from "./CrearRegistroMaterial";
import { useQuery } from "@tanstack/react-query";
import { getPackingMaterialProveedores } from "@/api/BodegaProveedoresAPI";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";

type Props = {
  errors: FieldErrors<DraftMaterialEmpaque>;
  register: UseFormRegister<DraftMaterialEmpaque>;
  control: Control<DraftMaterialEmpaque, any>;
};

export default function FormRegistroMaterial({ errors, register, control }: Props) {

  const { data, isLoading } = useQuery({
    queryKey: ['getPackingMaterialProveedores'],
    queryFn: () => getPackingMaterialProveedores({ page: 1, paginated: '' })
  });

  const options = data?.data?.map((supplier) => ({
    value: supplier.id,
    label: `${supplier.name}`,
  }));

  if (isLoading) return <Spinner />
  if (options) return (
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

      <InputSelectSearchComponent<DraftMaterialEmpaque>
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
