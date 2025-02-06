//HOOKS
import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { Link } from "react-router-dom";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Edit, PlusIcon } from "lucide-react";
import { TareasPaginate } from "../../../types";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

export default function IndexTareas() {
  const [tareas, setTareas] = useState<TareasPaginate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);
  const getAllTareas = useAppStore((state) => state.getAllTareasPaginate);
  const [role, setRole] = useState<string>("");
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);


  const handleGetUserRole = async () => {
    setLoading(true);
    try {
      const role = await getUserRoleByToken();
      setRole(role);
    } catch (error) {
      toast.error("Error al cargar el contenido");
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllTareas = async (page: number) => {
    setLoading(true);
    setError(false);

    try {
      const tareas = await getAllTareas(page);
      setTareas(tareas);
      setPageCount(tareas.meta.last_page);
      setCurrentPage(tareas.meta.current_page);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    handleGetAllTareas(currentPage);
    handleGetUserRole();
  }, [currentPage]);

  return (
    <>
      <h2 className="font-bold text-4xl">Tareas Generales</h2>

      {(role === "admin" || role === "adminagricola") && (
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/tareas/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Tarea</p>
          </Link>

          <Link
            to="/tareas/carga-masiva"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Carga Masiva de Tareas</p>
          </Link>
        </div>
      )}

      <div className="mt-10">
        {loading && <Spinner />}
        {!loading && error && <ShowErrorAPI />}
        {!loading && !error && tareas && (
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">
                  ID
                </th>
                <th scope="col" className="thead-th">
                  Tarea
                </th>
                <th scope="col" className="thead-th">
                  Codigo
                </th>
                {role === "admin" && (
                  <th scope="col" className="thead-th">
                    Acción
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tareas.data.map((tarea) => (
                <tr className="tbody-tr" key={tarea.id}>
                  <td className="tbody-td">
                    <p>{tarea.id}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{tarea.name}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{tarea.code}</p>
                  </td>
                  {role === "admin" && (
                    <td className="tbody-td flex gap-2">
                      <Link
                        to={`/tareas/edit/${tarea.id}`}
                        className="hover:text-gray-400"
                      >
                        <Edit />
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mb-10 flex justify-end">
        {!loading && (
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
