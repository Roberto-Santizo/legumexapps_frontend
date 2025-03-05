import { useEffect, useRef, useState } from 'react';
import { getAllPlantas } from '@/api/PlantasAPI';
import { useQueries } from '@tanstack/react-query';
import { Boleta, DraftBoletaTransporte, Planta, Product, TransporteCondition } from '@/types';
import { getAllBoletasRMP } from '@/api/ReceptionsDocAPI';
import { getProducts } from '@/api/ProductsAPI';
import { Controller, useForm } from 'react-hook-form';
import Error from '@/components/Error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createBoletaTransporte, getTransporteCondiciones } from '@/api/BoletaTransporteAPI';
import { Button } from '@mui/material';
import Spinner from '@/components/Spinner';
import SignatureCanvas from "react-signature-canvas";
import Swal from 'sweetalert2';

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
      { queryKey: ['getAllBoletasRMP'], queryFn: getAllBoletasRMP },
      { queryKey: ['getProducts'], queryFn: getProducts },
      { queryKey: ['getTransporteCondiciones'], queryFn: getTransporteCondiciones }
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
      if (results[1].data) setBoletas(results[1].data);
      if (results[2].data) setProducts(results[2].data);
      if (results[3].data) setConditions(results[3].data);
    }
  }, [results]);

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

      <div>
        <form className="mt-10 w-2/3 mx-auto bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl p-8 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="planta_id">
                Planta:
              </label>
              <select className='border border-black p-3' {...register('planta_id', { required: 'Seleccione una planta' })}>
                <option value="">--SELECCIONE UNA OPCIÓN--</option>
                {plantas.map(planta => (
                  <option key={planta.id} value={planta.id}>{planta.name}</option>
                ))}
              </select>
              {errors.planta_id?.message && <Error >{errors.planta_id.message}</Error>}
            </div>

            <div className="w-full overflow-x-auto mt-8">
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

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="truck_type">
                Tipo de Camión:
              </label>
              <input
                autoComplete="off"
                id="truck_type"
                type="text"
                placeholder="Tipo de camión"
                className="border border-black p-3 "
                {...register('truck_type', { required: 'El tipo de camión es requerido' })}
              />
              {errors.truck_type?.message && <Error >{errors.truck_type.message}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="product_id">
                Producto:
              </label>
              <select className='border border-black p-3' {...register('product_id', { required: 'El tipo de producto es requerido' })}>
                <option value="">--SELECCIONE UNA OPCIÓN--</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{`${product.product} - ${product.variety}`}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="pilot_name">
                Piloto:
              </label>
              <input
                autoComplete="off"
                id="pilot_name"
                type="text"
                placeholder="Placa"
                className="border border-black p-3 "
                {...register('pilot_name', { required: 'El nombre del piloto es requerido' })}
              />
              {errors.pilot_name?.message && <Error >{errors.pilot_name.message}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="plate">
                Placa:
              </label>
              <input
                autoComplete="off"
                id="plate"
                type="text"
                placeholder="Placa"
                className="border border-black p-3 "
                {...register('plate', { required: 'La placa es requierida' })}
              />
              {errors.plate?.message && <Error >{errors.plate.message}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="observations">
                Obsevaciones:
              </label>
              <input
                autoComplete="off"
                id="observations"
                type="text"
                placeholder="Observaciones"
                className="border border-black p-3 "
                {...register('observations')}
              />
              {errors.observations?.message && <Error >{errors.observations.message}</Error>}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-black bg-white mt-8">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-black">
                  <th className="bg-gray-50 p-4 text-lg font-semibold text-gray-900">Condición</th>
                  <th className="bg-gray-50 p-4 text-lg font-semibold text-gray-900 w-24 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((condicion) => (
                  <tr
                    key={condicion.id}
                    className="border-b border-black last:border-0 transition-colors duration-150">
                    <td className="p-4">
                      <label
                        className="text-base text-gray-700 font-medium cursor-pointer hover:text-gray-900 flex items-center gap-2"
                      >
                        {condicion.name}
                      </label>
                    </td>
                    <td className='flex justify-center p-5'>
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
};

export default BoletaCamion;