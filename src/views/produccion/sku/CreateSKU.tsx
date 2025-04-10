import { useForm } from "react-hook-form";
import { createSKU } from "@/api/SkusAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";

export type DraftSku = {
  code: string;
  product_name: string;
  presentation: number;
  boxes_pallet: number;
  config_box: number;
  config_bag: number;
  config_inner_bag: number;
  pallets_container: number;
  hours_container: number;
  client_name: string;
}

export default function CreateSKU() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createSKU,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/skus');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftSku>();

  const onSubmit = (data: DraftSku) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear SKU</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputComponent<DraftSku>
            label="Código del SKU"
            id="code"
            name="code"
            placeholder="Código del SKU"
            register={register}
            validation={{ required: 'El código del SKU es requerido' }}
            errors={errors}
            type={'text'}
          >
            {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Nombre del Producto"
            id="product_name"
            name="product_name"
            placeholder="Nombre del producto del SKU"
            register={register}
            validation={{ required: 'El nombre del producto es obligatorio' }}
            errors={errors}
            type={'text'}
          >
            {errors.product_name && <Error>{errors.product_name?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Presentación"
            id="presentation"
            name="presentation"
            placeholder="Presentación del producto. Ej: 24LBS"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.presentation && <Error>{errors.presentation?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Cajas por Pallet"
            id="boxes_pallet"
            name="boxes_pallet"
            placeholder="Número de cajas que componen un pallet"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.boxes_pallet && <Error>{errors.boxes_pallet?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Configuración de Caja"
            id="config_box"
            name="config_box"
            placeholder="Configuración de caja"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.config_box && <Error>{errors.config_box?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Configuración de Bolsa"
            id="config_bag"
            name="config_bag"
            placeholder="Configuración de Bolsa"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.config_bag && <Error>{errors.config_bag?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Configuración de Inner Bolsa"
            id="config_inner_bag"
            name="config_inner_bag"
            placeholder="Configuración de Inner Bolsa"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.config_inner_bag && <Error>{errors.config_inner_bag?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Pallets por Contenedor"
            id="pallets_container"
            name="pallets_container"
            placeholder="Cantidad de Pallets por Contenedor"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.pallets_container && <Error>{errors.pallets_container?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
              label="Horas Por Contenedor"
              id="hours_container"
              name="hours_container"
              placeholder="Horas Por Contenedor"
              register={register}
              validation={{min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' }}}
              errors={errors}
              type={'number'}
          >
              {errors.hours_container && <Error>{errors.hours_container?.message?.toString()}</Error>}
          </InputComponent>
        

          <InputComponent<DraftSku>
              label="Nombre del Cliente"
              id="client_name"
              name="client_name"
              placeholder="Nombre del Cliente"
              register={register}
              validation={{required: 'El nombre del cliente es obligatorio'}}
              errors={errors}
              type={'text'}
          >
              {errors.client_name && <Error>{errors.client_name?.message?.toString()}</Error>}
          </InputComponent>
       
          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear SKU</p>}
          </button>
        </form>
      </div>
    </>
  );
}