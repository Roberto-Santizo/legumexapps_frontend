//HOOKS
import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { Link } from "react-router-dom";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Edit, PlusIcon } from "lucide-react";

export default function IndexTareas() {
  const fetchTareas = useAppStore((state) => state.fetchTareas);
  const loadingTareas = useAppStore((state) => state.loadingTareas);
  const errorTareas = useAppStore((state) => state.errorFetchTareas);
  const tareas = useAppStore((state) => state.tareas);

  useEffect(() => {
    fetchTareas();
  }, []);

  return (
    <>
      <h2 className="font-bold text-4xl">Tareas Generales</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/tareas/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Tarea</p>
        </Link>
      </div>

      <div className="mt-10">
        {loadingTareas && <Spinner />}
        {!loadingTareas && errorTareas && <ShowErrorAPI />}
        {!loadingTareas && !errorTareas && (
          <table className="table">
            <thead className="bg-gray-400">
              <tr className="text-xs md:text-sm rounded">
                <th scope="col" className="table-header">
                  ID
                </th>
                <th scope="col" className="table-header">
                  Tarea
                </th>
                <th scope="col" className="table-header">
                  Codigo
                </th>
                <th scope="col" className="table-header">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {tareas.map((tarea) => (
                <tr className="text-xl" key={tarea.id}>
                  <td className="record">
                    <p>{tarea.id}</p>
                  </td>
                  <td className="record">
                    <p>{tarea.name}</p>
                  </td>
                  <td className="record">
                    <p>{tarea.code}</p>
                  </td>
                  <td className="record flex gap-2">
                    <Link
                      to={`/tareas/edit/${tarea.id}`}
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
      </div>
    </>
  );
}
