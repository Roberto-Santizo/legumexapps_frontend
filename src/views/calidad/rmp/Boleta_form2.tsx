import { Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

import { createProdData } from "@/api/ReceptionsDocAPI";

import Error from "@/components/Error";
import { Basket, BoletaDetail, DraftFormProd } from "@/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";

import { getAllBaskets } from "@/api/BasketsAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "@/components/ShowErrorAPI";

type Props = {
  boleta: BoletaDetail
}

export default function Boleta_form2({ boleta }: Props) {
  const [loading, setLoading] = useState<boolean>()
  const receptor_signature = useRef({} as SignatureCanvas);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const navigate = useNavigate();
  
  const { data,isLoading,isError } = useQuery({
    queryKey:['getAllBaskets'],
    queryFn: getAllBaskets
  });
  
  useEffect(()=>{
    if(data){
      setBaskets(data);
    }
  },[data])

  const basketsOptions = baskets.map((basket) => ({
    value: basket.id,
    label: `${basket.code} - ${basket.weight}lbs`,
  }));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftFormProd>();

  const onSubmit = async (data: DraftFormProd) => {
    setLoading(true);
    try {
      await createProdData(data, boleta.id);
      toast.success('Información actualizada correctamente');
      navigate('/rmp');
    } catch (error) {
      toast.error('Hubo un error al actualizar la información, intentelo de nuevo más tarde');
    } finally {
      setLoading(false);
    }
  }

  if(isError) return <ShowErrorAPI />
  if(isLoading) return <Spinner />
  return (
    <>
      {loading ? <Spinner /> : (
        <>
          <div>
            <div className="space-y-10">
              <div className="mt-5 shadow-xl p-5 space-y-5">
                <p className="font-bold text-xl uppercase">Información de Campo</p>
                <div className="grid grid-cols-4 gap-2 text-xl">
                  <p className="bg-gray-200 p-5"><span className="font-bold">Producto: </span>{boleta.product}</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Variedad: </span>{boleta.variety}</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">CDP: </span>{boleta.cdp}</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Peso Bruto: </span>{boleta.gross_weight} lbs</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Cantidad de canastas: </span>{boleta.total_baskets}</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Tara: </span>{boleta.weight_baskets} lbs</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Peso Materia Prima: </span>{boleta.net_weight} lbs</p>
                  <p className="bg-gray-200 p-5"><span className="font-bold">Porcentaje de Campo: </span>{boleta.percentage_field} %</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-xl uppercase">Información de Planta</p>
              </div>
            </div>
          </div>

          <div>
            <form className="mt-10 w-1/2 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                      placeholder={"--SELECCIONE UNA OPCION--"}
                      className="border border-black"
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={basketsOptions.find(
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

              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="font-bold text-lg">Actualizar</p>
                )}
              </Button>
            </form>
          </div>
        </>
      )}

    </>
  );
}
