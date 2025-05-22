import Pagination from "@/components/utilities-components/Pagination";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import { getPlacas, Placa } from "@/api/PlacasAPI";

export default function IndexPlacas() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [placas,setPlacas] = useState<Placa[]>([]);


  const { data, isLoading, isError } = useQuery({
      queryKey: ['getPlacasPaginated',currentPage],
      queryFn: () => getPlacas({page: currentPage, paginated: 'true'}),
  });

  useEffect(() => {
    if (data) {
      setPlacas(data.data);
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }
  }, [data]);
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if(isLoading) return <Spinner />;
  if(isError) return <ShowErrorAPI />;
  return (
    <>
      <h1 className="font-bold text-3xl">Placas</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/transportistas/placas/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <Plus className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear Placa</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Placa</th>
            <th className="thead-th">Transportista</th>
          </tr>
        </thead>
        <tbody>
          {placas.map(placa => (
            <tr key={placa.id} className="tbody-tr">
              <td className="tbody-td">{placa.name}</td>
              <td className="tbody-td">{placa.carrier}</td>
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
