import { useForm } from "react-hook-form";
import { createSKU } from "@/api/SkusAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";

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
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="code">
              Código:
            </label>
            <input
              autoComplete="off"
              id="code"
              type="text"
              placeholder="Ingrese el código del SKU"
              className="border border-black p-3"
              {...register("code", { required: "El código del SKU es requerido" })}
            />
            {errors.code?.message && <Error>{String(errors.code.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="product_name">
              Nombre del Producto:
            </label>
            <input
              autoComplete="off"
              id="product_name"
              type="text"
              placeholder="Ingrese el nombre del producto"
              className="border border-black p-3"
              {...register("product_name", { required: "El nombre del producto es requerido" })}
            />
            {errors.product_name?.message && <Error>{String(errors.product_name.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="presentation">
              Presentación:
            </label>
            <input
              autoComplete="off"
              id="presentation"
              type="number"
              placeholder="Presentación del producto, ej: 24lbs"
              className="border border-black p-3"
              {...register("presentation", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.presentation?.message && <Error>{String(errors.presentation.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="boxes_pallet">
              Cajas por Pallet:
            </label>
            <input
              autoComplete="off"
              id="boxes_pallet"
              type="number"
              placeholder="Número de cajas por pallet"
              className="border border-black p-3"
              {...register("boxes_pallet", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.boxes_pallet?.message && <Error>{String(errors.boxes_pallet.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="config_box">
              Configuración de Caja:
            </label>
            <input
              autoComplete="off"
              id="config_box"
              type="number"
              placeholder="Configuración de caja"
              className="border border-black p-3"
              {...register("config_box", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.config_box?.message && <Error>{String(errors.config_box.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="config_bag">
              Configuración de Bolsa:
            </label>
            <input
              autoComplete="off"
              id="config_bag"
              type="number"
              placeholder="Configuración de bolsa"
              className="border border-black p-3"
              {...register("config_bag", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.config_bag?.message && <Error>{String(errors.config_bag.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="config_inner_bag">
              Configuración de Inner Bolsa:
            </label>
            <input
              autoComplete="off"
              id="config_inner_bag"
              type="number"
              placeholder="Configuración de inner bolsa"
              className="border border-black p-3"
              {...register("config_inner_bag", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.config_inner_bag?.message && <Error>{String(errors.config_inner_bag.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="pallets_container">
              Pallets Por Contenedor:
            </label>
            <input
              autoComplete="off"
              id="pallets_container"
              type="number"
              placeholder="Cantidad de Pallets por Contenedor"
              className="border border-black p-3"
              {...register("pallets_container", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.pallets_container?.message && <Error>{String(errors.pallets_container.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="hours_container">
              Horas Por Contenedor:
            </label>
            <input
              autoComplete="off"
              id="hours_container"
              type="number"
              placeholder="Horas por contenedor"
              className="border border-black p-3"
              {...register("hours_container", { min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } })}
            />
            {errors.hours_container?.message && <Error>{String(errors.hours_container.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="client_name">
              Nombre del Cliente:
            </label>
            <input
              autoComplete="off"
              id="client_name"
              type="text"
              placeholder="Ingrese nombre del cliente"
              className="border border-black p-3"
              {...register("client_name", { required: "El nombre del cliente es requerido" })}
            />
            {errors.client_name?.message && <Error>{String(errors.client_name.message)}</Error>}
          </div>

          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear SKU</p>}
          </button>
        </form>
      </div>
    </>
  );
}