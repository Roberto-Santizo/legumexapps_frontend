import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Basket, getAllBaskets } from "@/api/BasketsAPI";
import { createBoletaRMP, DraftBoletaRMP } from "@/api/ReceptionsDocAPI";
import { getAllProducers, Producer } from "@/api/ProducersAPI";
import { getProducts, Product } from "@/api/ProductsAPI";
import { Finca, getAllFincas } from "@/api/FincasAPI";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { getPilotosByTransportistaId, Piloto } from "@/api/PilotosAPI";
import { getAllTransportistas, Transportista } from "@/api/TransportistasAPI";
import { getPlacasByCarrierId, Placa } from "@/api/PlacasAPI";
import { getAllProductorCDPS, ProductorCDP } from "@/api/ProductorPlantationAPI";
import SignatureCanvas from "react-signature-canvas";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import Select from "react-select";

export default function Boleta_form1() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [placas, setPlacas] = useState<Placa[]>([]);
  const [cdps, setCDPS] = useState<ProductorCDP[]>([]);
  const [transportistaId, setTransportistaId] = useState<string>('');
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
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
      { queryKey: ['getAllFincas'], queryFn: getAllFincas },
      { queryKey: ['getAllTransportistas'], queryFn: getAllTransportistas },
      { queryKey: ['getAllProductorCDPS'], queryFn: getAllProductorCDPS }
    ]
  });

  const { data: pilotosData } = useQuery({
    queryKey: ['getPilotosByTransportistaId', transportistaId],
    queryFn: () => getPilotosByTransportistaId(transportistaId),
    enabled: !!transportistaId
  });


  const { data: placasData } = useQuery({
    queryKey: ['getPlacasByCarrierId', transportistaId],
    queryFn: () => getPlacasByCarrierId(transportistaId),
    enabled: !!transportistaId
  });

  useEffect(() => {
    if (results[0].data) setProducts(results[0].data);
    if (results[1].data) setProducers(results[1].data);
    if (results[2].data) setBaskets(results[2].data);
    if (results[3].data) setFincas(results[3].data);
    if (results[4].data) setTransportistas(results[4].data);
    if (results[5].data) setCDPS(results[5].data);
  }, [results]);

  useEffect(() => {
    if (pilotosData) {
      setPilotos(pilotosData)
    }
  }, [pilotosData])

  useEffect(() => {
    if (placasData) {
      setPlacas(placasData)
    }
  }, [placasData])

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

  const transportistasOptions = transportistas.map((transportista) => ({
    value: transportista.id,
    label: `${transportista.code} - ${transportista.name}`,
  }));

  const pilotosOptions = pilotos.map((piloto) => ({
    value: piloto.id,
    label: `${piloto.name}`,
  }));

  const placasOptions = placas.map((placa) => ({
    value: placa.id,
    label: `${placa.name}`,
  }));

  const cdpsOptions = cdps.map((cdp) => ({
    value: cdp.id,
    label: `${cdp.name}`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createBoletaRMP,
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
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftBoletaRMP>();

  const onSubmit = async (data: DraftBoletaRMP) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Boleta de Recepcion de Materia Prima </h2>

      <div>
        <form
          className="mt-10 md:w-2/3 w-full mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="ref_doc">
              No. DOC:
            </label>
            <input
              autoComplete="off"
              id="ref_doc"
              type="text"
              placeholder={"Número de referencia fisica"}
              className="border border-black p-3"
              {...register("ref_doc", {
                required: "La referencia de documento es necesaria",
              })}
            />
            {errors.ref_doc && <Error>{errors.ref_doc?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="producer_id">
              PRODUCTOR:
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
                  placeholder={"SELECCIONE UNA OPCION"}
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
                  placeholder={"SELECCIONE UNA OPCION"}
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
                  placeholder={"SELECCIONE UNA OPCION"}
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
            <label className="text-lg font-bold uppercase" htmlFor="date">
              FECHA DE BOLETA:
            </label>
            <input
              autoComplete="off"
              id="date"
              type="date"
              className="border border-black p-3"
              {...register("date", { required: "La fecha es obligatoria" })}
            />
            {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="carrier_id">
              TRANSPORTISTA:
            </label>
            <Controller
              name="carrier_id"
              control={control}
              rules={{ required: "Seleccione un transportista" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={transportistasOptions}
                  id="carrier_id"
                  placeholder={"SELECCIONE UNA OPCION"}
                  className="border border-black"
                  onChange={(selected) => {
                    field.onChange(selected?.value)
                    setTransportistaId(selected?.value ?? '')
                  }}
                  value={transportistasOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.carrier_id && <Error>{errors.carrier_id?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="driver_id">
              PILOTOS:
            </label>
            <Controller
              name="driver_id"
              control={control}
              rules={{ required: "Seleccione un piloto" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={pilotosOptions}
                  id="driver_id"
                  placeholder={"SELECCIONE UNA OPCION"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={pilotosOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.driver_id && <Error>{errors.driver_id?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="plate_id">
              PLACA:
            </label>
            <Controller
              name="plate_id"
              control={control}
              rules={{ required: "Seleccione una placa" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={placasOptions}
                  id="plate_id"
                  placeholder={"SELECCIONE UNA OPCION"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={placasOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.plate_id && <Error>{errors.plate_id?.message?.toString()}</Error>}
          </div>

          <div>
            <label className="text-lg font-bold uppercase" htmlFor="productor_plantation_control_id">
              CDP:
            </label>
            <Controller
              name="productor_plantation_control_id"
              control={control}
              rules={{ required: "Seleccione un CDP" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cdpsOptions}
                  id="productor_plantation_control_id"
                  placeholder={"SELECCIONE UNA OPCION"}
                  className="border border-black"
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={cdpsOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.productor_plantation_control_id && <Error>{errors.productor_plantation_control_id?.message?.toString()}</Error>}
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
                  placeholder={"SELECCIONE UNA OPCION"}
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
              Firma
            </label>

            {(errors.calidad_signature) && <Error>{'Asegurese de haber firmado'}</Error>}
          </div>

          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear Boleta</p>}
          </button>
        </form>
      </div>
    </>
  );
}
