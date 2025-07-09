import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTimeOuts, Timeout } from "@/api/TimeOutsAPI";
import { Edit, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexTiemposMuertos() {
  const [timeouts, setTimeouts] = useState<Timeout[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedTimeouts', currentPage],
    queryFn: () => getTimeOuts({ page: currentPage, paginated: 'true' }),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data) {
      setTimeouts(data.data);
    }
    if (data?.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  if (timeouts) return (
    <div>
      <h2 className="font-bold text-4xl">Tiempos Muertos</h2>
      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/tiempos-muertos/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Tiempo Muerto</p>
        </Link>
      </div>
      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Nombre</th>
            <th className="thead-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {timeouts.map(timeout => (
            <tr key={timeout.id} className="tbody-tr">
              <td className="tbody-td">{timeout.name}</td>
              <td>
                <Link to={`/tiempos-muertos/editar/${timeout.id}`}>
                  <Edit />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
