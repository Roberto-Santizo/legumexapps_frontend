import { useEffect, useRef, useState } from 'react';
import { getAllPlantas, Planta } from '@/api/PlantasAPI';
import { useQueries } from '@tanstack/react-query';
import { Boleta, getBoletasRMP } from '@/api/ReceptionsDocAPI';
import { getProducts, Product } from '@/api/ProductsAPI';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createBoletaTransporte, DraftBoletaTransporte, getCondicionesTransporte, TransporteCondition } from '@/api/BoletaTransporteAPI';
import { FiletrsBoletaRMPInitialValues } from '@/components/filters/FiletrsRMP';
import SignatureCanvas from "react-signature-canvas";
import Swal from 'sweetalert2';
import Error from '@/components/utilities-components/Error';
import Spinner from '@/components/utilities-components/Spinner';
import InputComponent from '@/components/form/InputComponent';
import InputSelectComponent from '@/components/form/InputSelectComponent';

const BoletaCamion = () => {

  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBoletas, setSelectedBoletas] = useState<Boleta[]>([]);
  const [conditions, setConditions] = useState<TransporteCondition[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<{ [key: string]: boolean }>({});
  const verify_by_signature = useRef({} as SignatureCanvas);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm<DraftBoletaTransporte>();

  const results = useQueries({
    queries: [
      { queryKey: ['getAllPlantas'], queryFn: getAllPlantas },
      { queryKey: ['getAllBoletasRMP'], queryFn: () => getBoletasRMP({ page: 1, filters: FiletrsBoletaRMPInitialValues, paginated: '', transport_doc_create:'true'}) },
      { queryKey: ['getProducts'], queryFn: () => getProducts({ page: 1, paginated: '' }) },
      { queryKey: ['getTransporteCondiciones'], queryFn: () => getCondicionesTransporte({ page: 1, paginated: '' }) }
    ]
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBoletaTransporte,
    onError: () => {
      toast.error('Hubo un error al crear la boleta');
    },
    onSuccess: () => {
      toast.success('Boleta creada correctamente');
      navigate('/transporte-boleta');

    }
  });

  useEffect(() => {
    if (results.every(result => result.data)) {
      if (results[0].data) setPlantas(results[0].data);
      if (results[1].data) setBoletas(results[1].data.data);
      if (results[2].data) setProducts(results[2].data.data);
      if (results[3].data) setConditions(results[3].data.data);
    }
  }, [results]);

  const plantasOptions = plantas.map((planta) => ({
    value: planta.id.toString(),
    label: planta.name,
  }));

  const productsOptions = products.map((product) => ({
    value: product.id.toString(),
    label: `${product.product} - ${product.variety}`,
  }));


  const handleChangeCondition = (id: string) => {
    setSelectedConditions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleChangeInputBoleta = (id: string) => {
    setSelectedBoletas((prevBoletas) => {
      if (prevBoletas.some((boleta) => boleta.id === id)) {
        return prevBoletas.filter((boleta) => boleta.id !== id);
      }

      if (prevBoletas.length === 0) {
        const boleta = boletas.find((boleta) => boleta.id === id);
        if (boleta) {
          setValue('pilot_name', boleta.pilot_name);
          setValue('product_id', boleta.product_id);
          setValue('plate', boleta.plate);
          return [...prevBoletas, boleta];
        }
      } else {
        const newBoleta = boletas.find((boleta) => boleta.id === id);

        if (newBoleta) {
          const isValid = prevBoletas.every((boleta) =>
            boleta.coordinator === newBoleta.coordinator &&
            boleta.pilot_name === newBoleta.pilot_name &&
            boleta.plate === newBoleta.plate
          );

          if (!isValid) {
            Swal.fire({
              icon: 'error',
              title: 'Datos incorrectos',
              text: 'Los datos de la boleta no coinciden con los seleccionados previamente.',
            });
            return prevBoletas;
          }

          return [...prevBoletas, newBoleta];
        }
      }

      return prevBoletas;
    });
  };

  useEffect(() => {
    if (selectedBoletas.length === 0) {
      setValue('pilot_name', '');
      setValue('product_id', '');
      setValue('plate', '');
    }
  }, [selectedBoletas]);



  const onSubmit = (data: DraftBoletaTransporte) => {
    const transformedData = {
      ...data,
      conditions: conditions.map(condicion => ({
        id: condicion.id,
        value: selectedConditions[condicion.id] || false
      })),
      boletas: selectedBoletas.map(boleta => ({
        id: boleta.id,
      })),
    };

    mutate(transformedData);
  };

  return (
    <>
      <h2 className="text-4xl font-bold flex items-center gap-3">
        Inspección de Transporte
      </h2>

      <form className="mt-10 w-2/3 mx-auto bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl p-8 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>

        <InputSelectComponent<DraftBoletaTransporte>
          label="Planta"
          id="planta_id"
          name="planta_id"
          options={plantasOptions}
          register={register}
          validation={{ required: 'La planta es obligatoria' }}
          errors={errors}
        >
          {errors.planta_id && <Error>{errors.planta_id?.message?.toString()}</Error>}
        </InputSelectComponent>

        <div className="w-full overflow-x-auto mt-8 scrollbar-hide">
          <div className="min-w-max overflow-hidden rounded-xl border border-black bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="thead-tr">
                  <th className="tbody-th px-4 py-3">Finca</th>
                  <th className="tbody-th px-4 py-3">Productor</th>
                  <th className="tbody-th px-4 py-3">Placa</th>
                  <th className="tbody-th px-4 py-3">Piloto</th>
                  <th className="tbody-th px-4 py-3">Fecha</th>
                  <th className="tbody-th px-4 py-3">Producto</th>
                  <th className="tbody-th px-4 py-3">Variedad</th>
                  <th className="tbody-th px-4 py-3 text-center">Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {boletas.map((boleta) => (
                  <tr key={boleta.id} className="tbody-tr">
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.finca}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.coordinator}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.plate}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.pilot_name}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.date}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.product}</td>
                    <td className="tbody-td whitespace-nowrap px-4 py-3">{boleta.variety}</td>
                    <td className="tbody-td flex justify-center px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedBoletas.some(selectedBoleta => selectedBoleta.id === boleta.id)}
                        onChange={() => handleChangeInputBoleta(boleta.id)}
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InputComponent<DraftBoletaTransporte>
          label="Tipo de Camión"
          id="truck_type"
          name="truck_type"
          placeholder="Tipo de Camión"
          register={register}
          validation={{ required: 'El tipo de camión es requerido' }}
          errors={errors}
          type={'text'}
        >
          {errors.truck_type && <Error>{errors.truck_type?.message?.toString()}</Error>}
        </InputComponent>


        <InputSelectComponent<DraftBoletaTransporte>
          label="Producto"
          id="product_id"
          name="product_id"
          options={productsOptions}
          register={register}
          validation={{ required: 'El producto es requerido' }}
          errors={errors}
        >
          {errors.product_id && <Error>{errors.product_id?.message?.toString()}</Error>}
        </InputSelectComponent>

        <InputComponent<DraftBoletaTransporte>
          label="Piloto"
          id="pilot_name"
          name="pilot_name"
          placeholder="Nombre del piloto"
          register={register}
          validation={{ required: 'El nombre del piloto es requerido' }}
          errors={errors}
          type={'text'}
        >
          {errors.pilot_name && <Error>{errors.pilot_name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftBoletaTransporte>
          label="Placa"
          id="plate"
          name="plate"
          placeholder="Placa. Ej: C123ABC"
          register={register}
          validation={{ required: 'La placa es obligatoria' }}
          errors={errors}
          type={'text'}
        >
          {errors.plate && <Error>{errors.plate?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftBoletaTransporte>
          label="Observaciones Generales"
          id="observations"
          name="observations"
          placeholder="Observaciones generales"
          register={register}
          validation={{}}
          errors={errors}
          type={'text'}
        >
          {errors.observations && <Error>{errors.observations?.message?.toString()}</Error>}
        </InputComponent>

        <div className="overflow-hidden bg-white mt-8">
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th className="thead-tr">Codición</th>
                <th className="thead-tr">Estado</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((condicion) => (
                <tr
                  key={condicion.id}
                  className="tbody-tr">
                  <td className="tbody-td">
                    <label
                      className="text-base text-gray-700 font-medium cursor-pointer hover:text-gray-900 flex items-center gap-2"
                    >
                      {condicion.name}
                    </label>
                  </td>
                  <td className='tbody-td'>
                    <input
                      type="checkbox"
                      checked={selectedConditions[condicion.id] || false}
                      onChange={() => handleChangeCondition(condicion.id)}
                      className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <fieldset className='grid grid-cols-1 mx-auto '>

          <div className="space-y-2 text-center">
            <Controller
              name="verify_by_signature"
              control={control}
              rules={{ required: 'Asegurese de haber firmado' }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={verify_by_signature}
                    penColor="black"
                    canvasProps={{ className: "w-3/6 h-40 border mx-auto" }}
                    onEnd={() => {
                      field.onChange(verify_by_signature.current.toDataURL());
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                    onClick={() => {
                      verify_by_signature.current.clear();
                      field.onChange("");
                    }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Inspeccionado por:
            </label>

            {(errors.verify_by_signature) && <Error>{'Asegurese de haber firmado'}</Error>}
          </div>
        </fieldset>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Boleta</p>}
        </button>
      </form>
    </>
  );
};

export default BoletaCamion;