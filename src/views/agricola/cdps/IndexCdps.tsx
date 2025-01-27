import { Edit, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexCdps() {
  const fetchControlPlantations = useAppStore(
    (state) => state.fetchControlPlantations
  );
  const loading = useAppStore((state) => state.loadingfetchControlPlantations);
  const error = useAppStore((state) => state.errorFetchControlPlantations);
  const cdps = useAppStore((state) => state.plantations);

  useEffect(() => {
    fetchControlPlantations();
  }, []);

  return (
    <>
      <h2 className="font-bold text-4xl">Control de Plantaciones</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/cdps/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear CDP</p>
        </Link>
      </div>

      {loading && <Spinner />}
      {!loading && error && <ShowErrorAPI />}
      {!loading && !error && (
        <table className="table mt-10">
          <thead className="bg-gray-400">
            <tr className="text-xs md:text-sm rounded">
              <th scope="col" className="table-header">
                ID
              </th>
              <th scope="col" className="table-header">
                CDP
              </th>
              <th scope="col" className="table-header">
                Cultivo
              </th>
              <th scope="col" className="table-header">
                Receta
              </th>
              <th scope="col" className="table-header">
                Densidad
              </th>
              <th scope="col" className="table-header">
                Tamaño
              </th>
              <th scope="col" className="table-header">
                Fecha de Inicio
              </th>
              <th scope="col" className="table-header">
                Fecha Final
              </th>
              <th scope="col" className="table-header">
                Semanas de Aplicación
              </th>
              <th scope="col" className="table-header">
                Estado
              </th>
              <th scope="col" className="table-header">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {cdps.map((cdp) => (
              <tr className="text-xl" key={cdp.id}>
                <td className="record">
                  <p>{cdp.id}</p>
                </td>
                <td className="record">
                  <p>{cdp.name}</p>
                </td>
                <td className="record">
                  <p>{cdp.crop}</p>
                </td>
                <td className="record">
                  <p>{cdp.recipe}</p>
                </td>
                <td className="record">
                  <p>{cdp.density}</p>
                </td>
                <td className="record">
                  <p>{cdp.size}</p>
                </td>
                <td className="record">
                  <p>{cdp.start_date}</p>
                </td>
                <td className="record">
                  <p>{cdp.end_date}</p>
                </td>
                <td className="record">
                  <p>{(cdp.aplication_week > 0) ? cdp.aplication_week  : 'SIN INCIO' }</p>
                </td>
                <td className="record">
                  <p className={`button text-center ${cdp.status ? 'bg-red-500' : ' bg-green-500'}`}>{cdp.status ? 'CERRADO' : 'ACTIVO'}</p>
                </td>
                <td className="record flex gap-2">
                  <Link
                    to={`/cdps/edit/${cdp.id}`}
                    className="hover:text-gray-400"
                  >
                    <Edit />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
