import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { getTasks } from "@/api/TasksAPI";
import { TaskGeneral } from "types/taskGeneralType";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import FiltersTareas from "@/components/filters/FiltersTareas";


export type FiltersTareasType = {
  name: string;
  code: string;
}

export const FiltersTasksInitialValues: FiltersTareasType = {
  name: "",
  code: ""
}

export default function Index() {
  const [tareas, setTareas] = useState<TaskGeneral[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersTareasType>(FiltersTasksInitialValues);
  const [tempFilters, setTempFilters] = useState<FiltersTareasType>(FiltersTasksInitialValues);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedTasks', currentPage, filters],
    queryFn: () => getTasks({ page: currentPage, filters, paginated: 'true' }),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setTareas(data.data);
    }

    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />
  return (
    <>
      <h2 className="font-bold text-center text-xl xl:text-left xl:text-4xl">Tareas Generales</h2>

      <div className="flex flex-col xl:flex-row justify-end gap-2 mt-5">
        <Link
          to="/tareas/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Tarea</p>
        </Link>

        <Link
          to="/tareas/carga-masiva"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Carga Masiva de Tareas</p>
        </Link>

        <div className="flex justify-end mt-5">
          <Bars3Icon
            className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <div className="mt-10 table-wrapper">
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
              <th scope="col" className="thead-th">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => (
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
                <td className="tbody-td flex gap-2">
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
      </div>

      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>

      {isOpen && (
        <FiltersTareas isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}
    </>
  );
}
