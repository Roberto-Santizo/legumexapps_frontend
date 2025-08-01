import { DraftMateriaPrimaItem } from "types/materiaPrimaTypes";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectComponent from "@/components/form/InputSelectComponent";

type Props = {
  register: UseFormRegister<DraftMateriaPrimaItem>;
  errors: FieldErrors<DraftMateriaPrimaItem>;
};

export default function FormMateriaPrima({ register, errors }: Props) {

  const options = [
    {
      value: 'imported',
      label: 'Importado'
    },
    {
      value: 'legumex',
      label: 'Legumex'
    }
  ];

  return (
    <>
      <InputComponent<DraftMateriaPrimaItem>
        label="Código"
        id="code"
        name="code"
        placeholder="Código del Item"
        register={register}
        validation={{ required: 'El código del item es requerido' }}
        errors={errors}
        type={'text'}
      >
        {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
      </InputComponent>

      <InputComponent<DraftMateriaPrimaItem>
        label="Nombre del producto"
        id="product_name"
        name="product_name"
        placeholder="Nombre del producto"
        register={register}
        validation={{ required: 'El nombre del producto es requerido' }}
        errors={errors}
        type={'text'}
      >
        {errors.product_name && <Error>{errors.product_name?.message?.toString()}</Error>}
      </InputComponent>


      <InputSelectComponent<DraftMateriaPrimaItem>
        label="Tipo"
        id="type"
        name="type"
        options={options}
        register={register}
        validation={{ required: 'El tipo es requerido' }}
        errors={errors}
      >
        {errors.type && <Error>{errors.type?.message?.toString()}</Error>}
      </InputSelectComponent>

    </>
  )
}
