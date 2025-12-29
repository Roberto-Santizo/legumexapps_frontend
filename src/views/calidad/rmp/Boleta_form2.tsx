import { Controller, useForm } from "react-hook-form";
import { createProdData } from "@/api/ReceptionsDocAPI";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBaskets } from "@/api/BasketsAPI";
import { BoletaRmpDetail } from "@/types/rmpDocTypes";
import SignatureCanvas from "react-signature-canvas";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import { useNotification } from "../../../core/notifications/NotificationContext";

type Props = {
  boleta: BoletaRmpDetail
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
  const notify = useNotification();

  const { data: baskets, isLoading, isError } = useQuery({
    queryKey: ['getAllBaskets'],
    queryFn: getBaskets
  });

  const basketsOptions = baskets?.map((basket) => ({
    value: basket.id,
    label: `${basket.code} - ${basket.weight}lbs`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createProdData,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
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

        <InputComponent<DraftFormProd>
          label="Cantidad de Canastas"
          id="total_baskets"
          name="total_baskets"
          placeholder="Cantidad de canastas recepción"
          register={register}
          validation={{
            required: "La cantidad de canastas es obligatoria",
            min: { value: 1, message: 'La cantidad minima de canastas es 1' }
          }}
          errors={errors}
          type={'number'}
        >
          {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectSearchComponent<DraftFormProd>
          label="Tipo de Canasta"
          id="basket_id"
          name="basket_id"
          options={basketsOptions || []}
          control={control}
          rules={{ required: 'El tipo de canasta es obligatoria' }}
          errors={errors}
        >
          {errors.basket_id && <Error>{errors.basket_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputComponent<DraftFormProd>
          label="Peso Bruto"
          id="gross_weight"
          name="gross_weight"
          placeholder="Peso Bruto"
          register={register}
          validation={{
            required: "El peso bruto es obligatorio",
            min: {
              value: 1,
              message: 'La cantidad minima es de 1'
            }
          }}
          errors={errors}
          type={'number'}
        >
          {errors.gross_weight && <Error>{errors.gross_weight?.message?.toString()}</Error>}
        </InputComponent>


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
