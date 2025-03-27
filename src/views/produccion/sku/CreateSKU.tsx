import { Controller, useForm } from "react-hook-form";
import { createSKU } from "@/api/SkusAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "@/api/ProductsSkuAPI";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Select from "react-select";

export type DraftSku = {
  code: string;
  product_id: string;
}

export default function CreateSKU() {
  const navigate = useNavigate();

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['getAllProducts'],
    queryFn: getAllProducts
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createSKU,
    onError: () => {
      toast.error('Hubo un error al crear el SKU');
    },
    onSuccess: () => {
      toast.success('SKU Creado Correctamente');
      navigate('/skus');
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftSku>();

  const onSubmit = (data: DraftSku) => mutate(data);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (products) return (
    <>
      <h2 className="text-4xl font-bold">Crear SKU</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
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
              {...register("code", { required: "El código del SKU es obligatorio" })}
            />
            {errors.code?.message && <Error>{String(errors.code.message)}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="product_id">
              TRANSPORTISTA:
            </label>
            <Controller
              name="product_id"
              control={control}
              rules={{ required: "Seleccione un transportista" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={products}
                  id="product_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={products.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.product_id && <Error>{errors.product_id?.message?.toString()}</Error>}
          </div>
          
          {/* <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="unit_mesurment">
              Porcentaje de calidad:
            </label>
            <input
              autoComplete="off"
              id="unit_mesurment"
              type="number"
              placeholder="Ingrese el porcentaje de calidad del SKU"
              className="border border-black p-3"
              {...register("unit_mesurment", { required: "El porcentaje de calidad es obligatorio" })}
            />
            {errors.unit_mesurment?.message && <Error>{String(errors.unit_mesurment.message)}</Error>}
          </div> */}

          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear SKU</p>}
          </button>
        </form>
      </div>
    </>
  );
}