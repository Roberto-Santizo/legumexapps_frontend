import { Controller, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@mui/material";
import { Basket, DraftBoletaRMP, Producer, Product } from "@/types";
import Error from "@/components/Error";
import Spinner from "@/components/Spinner";

export default function Boleta_form1() {
  const getProducts = useAppStore((state) => state.getProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorsCreate, setErrorsCreate] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const navigate = useNavigate();
  const inspector_signature = useRef({} as SignatureCanvas);
  const prod_signature = useRef({} as SignatureCanvas);
  const createBoletaRMP = useAppStore((state) => state.createBoletaRMP);
  const getAllBaskets = useAppStore((state) => state.getAllBaskets);
  const getAllProducers = useAppStore((state) => state.getAllProducers)

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

  const handleGetInfo = async () => {
    try {
      const data = await getProducts();
      const producers = await getAllProducers();
      const data2 = await getAllBaskets();
      setProducers(producers);
      setProducts(data);
      setBaskets(data2);
    } catch (error) {
      toast.error('Hubo un error al traer los productos');
    } finally {
      setLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftBoletaRMP>();

  const onSubmit = async (data: DraftBoletaRMP) => {
    setLoading(true);
    try {
      const errors = await createBoletaRMP(data);
      if (errors.length > 0) {
        setErrorsCreate(errors);
        return;
      }
      toast.success('Boleta Registrada Correctamente');
      navigate('/rmp');
    } catch (error) {
      toast.error('Hubo un error al guardar la información, intentelo de nuevo más tarde');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Boleta de Recepcion de Materia Prima </h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {(errors.prod_signature || errors.inspector_signature) && <Error>{'Asegurese de haber firmado'}</Error>}
          {errorsCreate.length > 0
            ? errorsCreate.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))
            : null}

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

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2 text-center">
              <Controller
                name="inspector_signature"
                control={control}
                rules={{ required: 'La firma del Inspector Agrícola es Obligatoria' }}
                render={({ field }) => (
                  <div className="p-2">
                    <SignatureCanvas
                      ref={inspector_signature}
                      penColor="black"
                      canvasProps={{ className: "w-full h-40 border" }}
                      onEnd={() => {
                        field.onChange(inspector_signature.current.toDataURL());
                      }}
                    />
                    <button
                      type="button"
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                      onClick={() => {
                        inspector_signature.current.clear();
                        field.onChange("");
                      }}
                    >
                      Limpiar Firma
                    </button>
                  </div>
                )}
              />
              <label className="block font-medium text-xl">
                Firma Inspector agrícola
              </label>
            </div>

            <div className="space-y-2 text-center">
              <Controller
                name="prod_signature"
                control={control}
                rules={{ required: 'La firma del productor es obligatoria' }}
                render={({ field }) => (
                  <div className="p-2">
                    <SignatureCanvas
                      ref={prod_signature}
                      penColor="black"
                      canvasProps={{ className: "w-full h-40 border" }}
                      onEnd={() => {
                        field.onChange(prod_signature.current.toDataURL());
                      }}
                    />
                    <button
                      type="button"
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                      onClick={() => {
                        prod_signature.current.clear();
                        field.onChange("");
                      }}
                    >
                      Limpiar Firma
                    </button>
                  </div>
                )}
              />
              <label className="block font-medium text-xl">
                Firma De Productor
              </label>
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
              <p className="font-bold text-lg">Crear Boleta</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
