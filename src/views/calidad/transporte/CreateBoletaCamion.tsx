import { ChangeEvent, useEffect, useState } from 'react';
import { getAllPlantas } from '@/api/PlantasAPI';
import { useQueries } from '@tanstack/react-query';
import { Boleta, DraftBoletaTransporte, Planta, Product, TransporteCondition } from '@/types';
import { getAllBoletasRMP } from '@/api/ReceptionsDocAPI';
import { getProducts } from '@/api/ProductsAPI';
import { useForm } from 'react-hook-form';
import Error from '@/components/Error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createBoletaTransporte, getTransporteCondiciones } from '@/api/BoletaTransporteAPI';
import { Button } from '@mui/material';
import Spinner from '@/components/Spinner';

const BoletaCamion = () => {

  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [conditions, setConditions] = useState<TransporteCondition[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
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

  const handleChangeBoleta = (e: ChangeEvent<HTMLSelectElement>) => {
    const boleta = boletas.find(boleta => boleta.id === e.target.value);
    if (boleta) {
      setValue('pilot_name', boleta.pilot_name)
      setValue('product_id', boleta.product_id)
      setValue('plate', boleta.plate)
    }
  }


  const handleChangeCondition = (id: string) => {
    setSelectedConditions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onSubmit = (data: DraftBoletaTransporte) => {
    const transformedData = {
      ...data,
      conditions: conditions.map(condicion => ({
        id: condicion.id,
        value: selectedConditions[condicion.id] || false 
      }))
    };

    mutate(transformedData)
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

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="rm_reception_id">
                Boleta Relacionada:
              </label>
              <select className='border border-black p-3' {...register('rm_reception_id', { required: 'Seleccione una boleta', onChange: handleChangeBoleta })}>
                <option value="">--SELECCIONE UNA OPCIÓN--</option>
                {boletas.map(boleta => (
                  <option key={boleta.id} value={boleta.id}>{`${boleta.finca} | ${boleta.coordinator} | ${boleta.date} | ${boleta.product} ${boleta.variety}`}</option>
                ))}
              </select>
              {errors.rm_reception_id?.message && <Error >{errors.rm_reception_id.message}</Error>}
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