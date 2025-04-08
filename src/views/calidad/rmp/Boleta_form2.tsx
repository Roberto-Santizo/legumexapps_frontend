import { Controller, useForm } from "react-hook-form";
import { BoletaDetail, createProdData } from "@/api/ReceptionsDocAPI";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBaskets } from "@/api/BasketsAPI";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Select from "react-select";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

type Props = {
  boleta: BoletaDetail
}

export type DraftFormProd = {
  total_baskets: number,
  basket_id: string,
  gross_weight: number,
  receptor_signature: string
}

export default function Boleta_form2({ boleta }: Props) {
  const receptor_signature = useRef({} as SignatureCanvas);
  const navigate = useNavigate();

  const { data: baskets, isLoading, isError } = useQuery({
    queryKey: ['getAllBaskets'],
    queryFn: getAllBaskets
  });

  const basketsOptions = baskets?.map((basket) => ({
    value: basket.id,
    label: `${basket.code} - ${basket.weight}lbs`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createProdData,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/rmp');
    }
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftFormProd>();

  const onSubmit = async (data: DraftFormProd) => mutate({ FormData: data, id: boleta.id });

  if (isError) return <ShowErrorAPI />
  if (isLoading) return <Spinner />
  return (
    <div>
      <form className="mt-10 w-full md:w-1/2 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label
            className="text-lg font-bold uppercase"
            htmlFor="total_baskets"
          >
            Cantidad de Canastas:
          </label>
          <input
            autoComplete="off"
            id="total_baskets"
            type="number"
            placeholder="Cantidad de Canastas"
            className="border border-black p-3"
            {...register("total_baskets", {
              required: "La cantidad de canastas es obligatoria",
              min: { value: 1, message: 'La cantidad minima de canastas es 1' }
            })}
          />
          {errors.total_baskets && (
            <Error>{errors.total_baskets?.message?.toString()}</Error>
          )}
        </div>

        <div>
          <label className="text-lg font-bold uppercase" htmlFor="coordinador">
            TIPO DE CANASTA:
          </label>
          <Controller
            name="basket_id"
            control={control}
            rules={{ required: "Seleccione un tipo de canasta" }}
            render={({ field }) => (
              <Select
                {...field}
                options={basketsOptions}
                id="basket_id"
                placeholder={"SELECCIONE UNA OPCION"}
                className="border border-black"
                onChange={(selected) => field.onChange(selected?.value)}
                value={basketsOptions?.find(
                  (option) => option.value === field.value
                )}
              />
            )}
          />
          {errors.basket_id && <Error>{errors.basket_id?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="gross_weight">
            Peso Bruto:
          </label>
          <input
            autoComplete="off"
            id="gross_weight"
            type="text"
            placeholder="Peso bruto del producto"
            className="border border-black p-3"
            {...register("gross_weight", {
              required: "El peso bruto es obligatorio",
              min: {
                value: 1,
                message: 'La cantidad minima es de 1'
              }
            })}
          />
          {errors.gross_weight && (
            <Error>{errors.gross_weight?.message?.toString()}</Error>
          )}
        </div>

        <div className="space-y-2">
          <div className="space-y-2 text-center">
            <Controller
              name="receptor_signature"
              control={control}
              rules={{ required: 'La firma del receptor es obligatoria' }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={receptor_signature}
                    penColor="black"
                    canvasProps={{ className: "w-full h-40 border" }}
                    onEnd={() => {
                      field.onChange(receptor_signature.current.toDataURL());
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                    onClick={() => {
                      receptor_signature.current.clear();
                      field.onChange("");
                    }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Firma De Receptor
            </label>
            {(errors.receptor_signature) && <Error>{'Asegurese de haber firmado'}</Error>}
          </div>
        </div>


        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Boleta</p>}
        </button>
      </form>
    </div>
  )
}
