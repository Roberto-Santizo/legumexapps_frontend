import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon, CheckBadgeIcon } from "@heroicons/react/16/solid";
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

export default function Index() {
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
      <h2 className="font-bold text-center xl:text-left text-4xl">Lotes</h2>

      <div className="flex xl:flex-row flex-col justify-end gap-3 mb-10 mt-5">
        <Link
          to="/lotes/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Lote</p>
        </Link>

        <Link
          to="/lotes/consulta"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <p>Consulta de Información de Lote</p>
        </Link>

        <div className="flex justify-end">
          <Bars3Icon
            className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <div className="table-wrapper">
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
                Tamaño en Manzanas
              </th>
              <th scope="col" className="thead-th">
                Total de Plantas
              </th>
              <th scope="col" className="thead-th">
                Ultima Validación
              </th>
              <th scope="col" className="thead-th">

              </th>
            </tr>
          </thead>
          <tbody>
            {lotes?.data.map((lote) => (
              <tr className="tbody-tr" key={lote.id}>
                <td className="tbody-td">{lote.id}</td>
                <td className="tbody-td">{lote.name}</td>
                <td className="tbody-td">{lote.finca}</td>
                <td className="tbody-td">{lote.size}</td>
                <td className="tbody-td">{lote.total_plants}</td>
                <td className="tbody-td">{lote.date}</td>
                <td className="tbody-td">
                  {lote.flag ? (
                    <div className="flex justify-center">
                      <span className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                        <CheckBadgeIcon className="w-5" />
                        Completo
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Link
                        className="button bg-indigo-500 hover:bg-indigo-600 transition duration-200 shadow-sm"
                        to={`/lotes/checklist/${lote.id}`}
                      >
                        Crear Checklist
                      </Link>
                    </div>
                  )}
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
        <FiltersLotes isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}
    </>
  );
}
