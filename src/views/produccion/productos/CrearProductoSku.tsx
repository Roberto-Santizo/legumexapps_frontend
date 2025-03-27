import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Error from "@/components/Error";
import { createProductSKU } from "@/api/ProductsSkuAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

export type DraftProductoSKU = {
  name: string;
  presentation: string;
  box_weight: string;
}

export default function CrearCliente() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftProductoSKU>();

  const { mutate, isPending } = useMutation({
    mutationFn: createProductSKU,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/productos-sku');
    }
  });

  const onSubmit = (data: DraftProductoSKU) => mutate(data);
  return (
    <div>
      <h2 className="font-bold text-4xl">Crear Producto</h2>

      <form className="mt-10 w-2/3 mx-auto space-y-5 shadow-xl p-10 rounded" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre del Producto:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder="Nombre del producto"
            className="border border-black p-3"
            {...register("name", { required: "El nombre del cliente es requerido" })}
          />
          {errors.name?.message && <Error>{String(errors.name.message)}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="presentation">
            Presentación del Producto:
          </label>
          <input
            autoComplete="off"
            id="presentation"
            type="text"
            placeholder="Ej. LBS, 12 X 2  24LBS"
            className="border border-black p-3"
            {...register("presentation", { required: "La presentación del producto es requerida" })}
          />
          {errors.presentation?.message && <Error>{String(errors.presentation.message)}</Error>}
        </div>


        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="box_weight">
            Peso de Caja:
          </label>
          <input
            autoComplete="off"
            id="box_weight"
            type="number"
            placeholder="Ej. lbs"
            className="border border-black p-3"
            {...register("box_weight",{min:{value:0, message:"El peso no puede ser negativo"}})}
          />
          {errors.box_weight?.message && <Error>{String(errors.box_weight.message)}</Error>}
        </div>

        <button disabled={isPending} type="submit" className="button w-full bg-indigo-500 hover:bg-indigo-600">
          {isPending ? <Spinner /> : <p>Crear Producto</p>}
        </button>
      </form>
    </div>
  )
}
