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
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                ID
              </th>
              <th scope="col" className="thead-th">
                CDP
              </th>
              <th scope="col" className="thead-th">
                Cultivo
              </th>
              <th scope="col" className="thead-th">
                Receta
              </th>
              <th scope="col" className="thead-th">
                Densidad
              </th>
              <th scope="col" className="thead-th">
                Tamaño
              </th>
              <th scope="col" className="thead-th">
                Fecha de Inicio
              </th>
              <th scope="col" className="thead-th">
                Fecha Final
              </th>
              <th scope="col" className="thead-th">
                Semanas de Aplicación
              </th>
              <th scope="col" className="thead-th">
                Estado
              </th>
              <th scope="col" className="thead-th">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {cdps.map((cdp) => (
              <tr className="tbody-tr" key={cdp.id}>
                <td className="tbody-td">
                  <p>{cdp.id}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.name}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.crop}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.recipe}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.density}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.size}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.start_date}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.end_date}</p>
                </td>
                <td className="tbody-td">
                  <p>{(cdp.aplication_week > 0) ? cdp.aplication_week  : 'SIN INCIO' }</p>
                </td>
                <td className="tbody-td">
                  <p className={`button text-center ${cdp.status ? 'bg-red-500' : ' bg-green-500'}`}>{cdp.status ? 'CERRADO' : 'ACTIVO'}</p>
                </td>
                <td className="tbody-td flex gap-2">
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
