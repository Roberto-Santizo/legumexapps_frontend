import { Controller, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import { getAllBaskets } from "@/api/BasketsAPI";
import { createBoletaRMP } from "@/api/ReceptionsDocAPI";
import { getAllProducers } from "@/api/ProducersAPI";
import { getProducts } from "@/api/ProductsAPI";
import { getAllFincas } from "@/api/FincasAPI";

import { Button } from "@mui/material";
import { Basket, DraftBoletaRMP, Finca, Producer, Product } from "@/types";
import Error from "@/components/Error";
import Spinner from "@/components/Spinner";
import { useMutation, useQueries } from "@tanstack/react-query";

export default function Boleta_form1() {
  const [products, setProducts] = useState<Product[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const navigate = useNavigate();
  const calidad_signature = useRef({} as SignatureCanvas);

  const results = useQueries({
    queries: [
      { queryKey: ['getProducts'], queryFn: getProducts },
      { queryKey: ['getAllProducers'], queryFn: getAllProducers },
      { queryKey: ['getAllBaskets'], queryFn: getAllBaskets },
      { queryKey: ['getAllFincas'], queryFn: getAllFincas }
    ]
  });
  
  useEffect(() => {
    if (results[0].data) setProducts(results[0].data);
    if (results[1].data) setProducers(results[1].data);
    if (results[2].data) setBaskets(results[2].data);
    if (results[3].data) setFincas(results[3].data);
  }, [results]);
  
  const fincasOptions = fincas.map((finca) => ({
    value: finca.id,
    label: `${finca.name}`,
  }));

  const producersOptions = producers.map((producer) => ({
    value: producer.id,
    label: `${producer.name}`,
  }));

  const productsOptions = products.map((product) => ({
    value: product.id,
    label: `${product.product} - ${product.variety}`,
  }));

  const basketsOptions = baskets.map((basket) => ({
    value: basket.id,
    label: `${basket.code} - ${basket.weight}lbs`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createBoletaRMP,
    onError: () => {
      toast.error('Hubo un error al crear la boleta');
    },
    onSuccess: () => {
      toast.success('Boleta creada correctamente');
      navigate('/rmp');
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftBoletaRMP>();

  const onSubmit = async (data: DraftBoletaRMP) => mutate(data)

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Boleta de Recepcion de Materia Prima </h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="producer_id">
              COORDINADOR:
            </label>
            <Controller
              name="producer_id"
              control={control}
              rules={{ required: "Seleccione un productor" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={producersOptions}
                  id="producer_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  className="border border-black"
                  value={producersOptions.find(option => option.value === field.value) || null}
                  onChange={(option) => {
                    if (option) {
                      field.onChange(option.value)
                    }
                  }}
                />
              )}
            />
            {errors.producer_id && <Error>{errors.producer_id?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="coordinador">
              TIPO DE PRODUCTO:
            </label>
            <Controller
              name="product_id"
              control={control}
              rules={{ required: "Seleccione un producto" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={productsOptions}
                  id="product_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={productsOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.product_id && <Error>{errors.product_id?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="finca_id">
              FINCA:
            </label>
            <Controller
              name="finca_id"
              control={control}
              rules={{ required: "Seleccione una finca" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={fincasOptions}
                  id="finca_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={fincasOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.finca_id && <Error>{errors.finca_id?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="transport">
              Transporte:
            </label>
            <input
              autoComplete="off"
              id="transport"
              type="text"
              placeholder={"Nombre de la empresa de transporte"}
              className="border border-black p-3"
              {...register("transport", { required: "El nombre de la empresa de transporte es obligatorio" })}
            />
            {errors.transport && <Error>{errors.transport?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="pilot_name">
              Nombre Piloto:
            </label>
            <input
              autoComplete="off"
              id="pilot_name"
              type="text"
              placeholder={"Nombre del piloto"}
              className="border border-black p-3"
              {...register("pilot_name", { required: "El nombre del piloto es obligatorio" })}
            />
            {errors.pilot_name && <Error>{errors.pilot_name?.message?.toString()}</Error>}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="transport_plate">
              Placa del transporte:
            </label>
            <input
              autoComplete="off"
              id="transport_plate"
              type="text"
              placeholder={"Numero de placa"}
              className="border border-black p-3"
              {...register("transport_plate", {
                required: "La placa es obligatoria", pattern: {
                  value: /^[PCDTOM]-?\d{3}[A-Z]{3}$/,
                  message: "Formato de placa inválido (Ej: P-123ABC o P123ABC)"
                }
              })}
            />
            {errors.transport_plate && <Error>{errors.transport_plate?.message?.toString()}</Error>}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="inspector_name">
              Nombre Inspector:
            </label>
            <input
              autoComplete="off"
              id="inspector_name"
              type="text"
              placeholder={"Nombre del inspector"}
              className="border border-black p-3"
              {...register("inspector_name", { required: "El nombre del inspector es obligatorio" })}
            />
            {errors.inspector_name && <Error>{errors.inspector_name?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="cdp">
              CDP:
            </label>
            <input
              autoComplete="off"
              id="cdp"
              type="text"
              placeholder={"Control de Plantación"}
              className="border border-black p-3"
              {...register("cdp", { required: "El CDP es obligatorio" })}
            />
            {errors.cdp && <Error>{errors.cdp?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="weight">
              Peso Bruto:
            </label>
            <input
              autoComplete="off"
              id="weight"
              type="number"
              placeholder={"Peso bruto"}
              className="border border-black p-3"
              {...register("weight", { required: "El peso bruto es obligatorio", min: { value: 0.1, message: 'La cantidad minima es 0.1' } })}
            />
            {errors.weight && <Error>{errors.weight?.message?.toString()}</Error>}
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
            <label className="text-lg font-bold uppercase" htmlFor="total_baskets">
              Cantidad de Canastas:
            </label>
            <input
              autoComplete="off"
              id="total_baskets"
              type="number"
              placeholder={"Cantidad de canastas"}
              className="border border-black p-3"
              {...register("total_baskets", { required: "La cantidad de canastas es obligatoria", min: { value: 1, message: 'La cantidad minima de canstas es 1' } })}
            />
            {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="quality_percentage">
              Porcentaje De Calidad:
            </label>
            <input
              autoComplete="off"
              id="quality_percentage"
              type="number"
              placeholder={"Porcentaje de calidad"}
              className="border border-black p-3"
              {...register("quality_percentage", { required: "El porcentaje de calidad es obligatorio", min: { value: 1, message: 'La cantidad minima es 1' } })}
            />
            {errors.quality_percentage && <Error>{errors.quality_percentage?.message?.toString()}</Error>}
          </div>

          <div className="space-y-2 text-center">
            <Controller
              name="calidad_signature"
              control={control}
              rules={{ required: 'Asegurese de haber firmado' }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={calidad_signature}
                    penColor="black"
                    canvasProps={{ className: "w-full h-40 border" }}
                    onEnd={() => {
                      field.onChange(calidad_signature.current.toDataURL());
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                    onClick={() => {
                      calidad_signature.current.clear();
                      field.onChange("");
                    }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Firma de Calidad
            </label>

            {(errors.calidad_signature) && <Error>{'Asegurese de haber firmado'}</Error>}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Boleta</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
