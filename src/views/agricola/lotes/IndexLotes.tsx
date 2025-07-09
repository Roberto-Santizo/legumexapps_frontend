import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { getLotes } from "@/api/LotesAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import FiltersLotes from "@/components/filters/FiltersLotes";

export type FiltersLotesType = {
  name: string;
  cdp: string;
  finca_id: string;
}

export const FiltersLoteInitialValues: FiltersLotesType = {
  name: "",
  cdp: "",
  finca_id: ""
}

export default function IndexLotes() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersLotesType>(FiltersLoteInitialValues);
  const [tempFilters, setTempFilters] = useState<FiltersLotesType>(FiltersLoteInitialValues);


  const { data: lotes, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedLotes', currentPage, filters],
    queryFn: () => getLotes({ page: currentPage, filters: filters, paginated: 'true' }),
  });

  useEffect(() => {
    if (lotes?.meta) {
      setPageCount(lotes.meta.last_page);
      setCurrentPage(lotes.meta.current_page);
    }
  }, [lotes]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />;
  if (lotes) return (
    <>
      <h2 className="font-bold text-4xl">Lotes</h2>

      <div className="flex flex-row justify-end gap-10 mb-10">
        <Link
          to="/lotes/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Lote</p>
        </Link>

        <Link
          to="/lotes/consulta"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <p>Consulta de Información de Lote</p>
        </Link>

        <Link
          to="/lotes/actualizacion"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <p>Actualización masiva de lotes</p>
        </Link>

        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th scope="col" className="thead-th">
              ID
            </th>
            <th scope="col" className="thead-th">
              Nombre
            </th>
            <th scope="col" className="thead-th">
              Finca
            </th>
            <th scope="col" className="thead-th">
              CDP Activo
            </th>
          </tr>
        </thead>
        <tbody>
          {lotes?.data.map((lote) => (
            <tr className="tbody-tr" key={lote.id}>
              <td className="tbody-td">{lote.id}</td>
              <td className="tbody-td">{lote.name}</td>
              <td className="tbody-td">{lote.finca}</td>
              <td className="tbody-td">{lote.cdp}</td>
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

      {isOpen && (
        <FiltersLotes isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}
    </>
  );
}
