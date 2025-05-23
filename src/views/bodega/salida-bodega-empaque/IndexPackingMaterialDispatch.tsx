import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPackingMaterialDispatches, PackingMaterialDispatch } from "@/api/PackingMaterialDispatches";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function IndexInsumos() {

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dispatches, setDispatches] = useState<PackingMaterialDispatch[]>([]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPackingMaterialDispatches', currentPage],
    queryFn: () => getPackingMaterialDispatches({ page: currentPage, paginated: 'true' })
  });

  useEffect(() => {
    if (data) {
      setDispatches(data.data)
    }

    if (data?.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data])

  if (isError) return <ShowErrorAPI />
  if (isLoading) return <Spinner />
  if (data) return (
    <>
      <h1 className="font-bold text-4xl capitalize">
        Salidas Material de Empaque
      </h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/salidas-mp/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear</p>
        </Link>
        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
        // onClick={() => setModal(true)} {/* Agregar la funcion de FilterMaterialSalida.tsx */}
        />
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Referencia</th>
            <th className="thead-th">Responsable</th>
            <th className="thead-th">Entregado Por</th>
            <th className="thead-th">Fecha de Entrega</th>
          </tr>
        </thead>
        <tbody>
          {dispatches.map(dispatch => (
            <tr className="tbody-tr" key={dispatch.id}>
              <td className="tbody-td">{dispatch.reference}</td>
              <td className="tbody-td">{dispatch.responsable}</td>
              <td className="tbody-td">{dispatch.user}</td>
              <td className="tbody-td">{dispatch.dispatch_date}</td>
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
  );
}
