import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPilotosPaginated, Piloto } from "@/api/PilotosAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexPilotos() {
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPilotosPaginated', currentPage],
    queryFn: () => getPilotosPaginated(currentPage)
  });

  useEffect(() => {
    if (data) {
      setPilotos(data.data);
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  return (
    <>
      <h1 className="font-bold text-3xl">Pilotos</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/transportistas/pilotos/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear Piloto</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Piloto</th>
            <th className="thead-th">Transportista</th>
            <th className="thead-th">Licencia</th>
            <th className="thead-th">DPI</th>
          </tr>
        </thead>
        <tbody>
          {pilotos.map(piloto => (
            <tr className="tbody-tr">
              <td className="tbody-td">{piloto.name}</td>
              <td className="tbody-td">{piloto.carrier}</td>
              <td className="tbody-td">{piloto.dpi ?? 'SIN DPI'}</td>
              <td className="tbody-td">{piloto.license ?? 'SIN LICENCIA'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 mb-10 flex justify-center md:justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  )
}
