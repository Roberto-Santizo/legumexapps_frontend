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
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

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

          <InputComponent<DraftBoletaRMP>
            label="No. DOC"
            id="ref_doc"
            name="ref_doc"
            placeholder="Número de referencia fisica"
            register={register}
            validation={{ required: 'La referencia del documento es necesaria' }}
            errors={errors}
            type={'text'}
          >
            {errors.ref_doc && <Error>{errors.ref_doc?.message?.toString()}</Error>}
          </InputComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Productor"
            id="producer_id"
            name="producer_id"
            options={producersOptions}
            control={control}
            rules={{ required: 'El productor es obligatorio' }}
            errors={errors}
          >
            {errors.producer_id && <Error>{errors.producer_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>


          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Tipo de Producto"
            id="product_id"
            name="product_id"
            options={productsOptions}
            control={control}
            rules={{ required: 'El producto es obligatorio' }}
            errors={errors}
          >
            {errors.product_id && <Error>{errors.product_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Finca"
            id="finca_id"
            name="finca_id"
            options={fincasOptions}
            control={control}
            rules={{ required: 'La finca es obligatoria' }}
            errors={errors}
          >
            {errors.finca_id && <Error>{errors.finca_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>


          <InputComponent<DraftBoletaRMP>
            label="Fecha de Boleta"
            id="date"
            name="date"
            placeholder=""
            register={register}
            validation={{ required: 'La fecha es obligatoria' }}
            errors={errors}
            type={'date'}
          >
            {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
          </InputComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Transportista"
            id="carrier_id"
            name="carrier_id"
            options={transportistasOptions}
            control={control}
            rules={{ required: 'El transportista es requerido' }}
            errors={errors}
            onChange={(value) => setTransportistaId(value ?? '')}
          >
            {errors.carrier_id && <Error>{errors.carrier_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Pilotos"
            id="driver_id"
            name="driver_id"
            options={pilotosOptions}
            control={control}
            rules={{ required: 'El piloto es obligatorio' }}
            errors={errors}
          >
            {errors.driver_id && <Error>{errors.driver_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Placa"
            id="plate_id"
            name="plate_id"
            options={placasOptions}
            control={control}
            rules={{ required: 'La placa es obligatoria' }}
            errors={errors}
          >
            {errors.plate_id && <Error>{errors.plate_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftBoletaRMP>
            label="CDP"
            id="productor_plantation_control_id"
            name="productor_plantation_control_id"
            options={cdpsOptions}
            control={control}
            rules={{ required: 'El CDP es obligatorio' }}
            errors={errors}
          >
            {errors.productor_plantation_control_id && <Error>{errors.productor_plantation_control_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputComponent<DraftBoletaRMP>
            label="Nombre del Inspector"
            id="inspector_name"
            name="inspector_name"
            placeholder="Nombre del inspector"
            register={register}
            validation={{ required: 'El nombre del inspector es obligatorio' }}
            errors={errors}
            type={'text'}
          >
            {errors.inspector_name && <Error>{errors.inspector_name?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftBoletaRMP>
            label="Peso Bruto"
            id="weight"
            name="weight"
            placeholder="Peso Bruto"
            register={register}
            validation={{
              required: "El peso bruto es obligatorio", min: { value: 0.1, message: 'La cantidad minima es 0.1' }
            }}
            errors={errors}
            type={'number'}
          >
            {errors.weight && <Error>{errors.weight?.message?.toString()}</Error>}
          </InputComponent>
          
          <InputSelectSearchComponent<DraftBoletaRMP>
            label="Tipo de Canasta"
            id="basket_id"
            name="basket_id"
            options={basketsOptions}
            control={control}
            rules={{required: 'El tipo de canasta es obligatorio'}}
            errors={errors}
          >
              {errors.basket_id && <Error>{errors.basket_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>
         

          <InputComponent<DraftBoletaRMP>
              label="Cantidad de Canastas"
              id="total_baskets"
              name="total_baskets"
              placeholder="Cantidad de Canastas"
              register={register}
              validation={{required: "La cantidad de canastas es obligatoria", min: { value: 1, message: 'La cantidad minima de canstas es 1' }}}
              errors={errors}
              type={'number'}
          >
              {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
          </InputComponent>
       
          
          <InputComponent<DraftBoletaRMP>
              label="Porcentaje de Calidad"
              id="quality_percentage"
              name="quality_percentage"
              placeholder="Porcentaje de Calidad"
              register={register}
              validation={{required: "El porcentaje de calidad es obligatorio", min: { value: 1, message: 'La cantidad minima es 1' }}}
              errors={errors}
              type={'number'}
          >
              {errors.quality_percentage && <Error>{errors.quality_percentage?.message?.toString()}</Error>}
          </InputComponent>

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
