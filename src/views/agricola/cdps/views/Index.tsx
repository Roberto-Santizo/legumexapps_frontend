import { useEffect, useState } from "react";
import { getCDPS } from "@/api/PlantationControlAPI";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { PlantationControl } from "@/types/plantationControlTypes";
import { EditIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FiltersCDP from "@/components/filters/FiltersCDP";

export type FiltersCDPType = {
  cdp: string;
  start_date: string;
  end_date: string;
}

export const FiltersCdpInitialValues: FiltersCDPType = {
  cdp: "",
  start_date: "",
  end_date: ""
}

export default function Index() {
  const [cdps, setCdps] = useState<PlantationControl[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FiltersCDPType>(FiltersCdpInitialValues);
  const [tempFilters, setTempFilters] = useState<FiltersCDPType>(FiltersCdpInitialValues);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPaginatedCDPS', currentPage, filters],
    queryFn: () => getCDPS({ page: currentPage, filters, paginated: 'true' }),
  });

  useEffect(() => {
    if (data) {
      setCdps(data.data);
    }

    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (cdps) return (
    <>
      <h2 className="font-bold text-center text-xl xl:text-left xl:text-4xl">Control de Plantaciones</h2>

      <div className="flex xl:flex-row flex-col justify-end gap-2 mt-5">
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
                CDP
              </th>
              <th scope="col" className="thead-th">
                Lote
              </th>
              <th scope="col" className="thead-th">
                Fecha de Inicio
              </th>
              <th scope="col" className="thead-th">
                Fecha Final
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
                  <p>{cdp.name}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.lote}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.start_date}</p>
                </td>
                <td className="tbody-td">
                  <p>{cdp.end_date}</p>
                </td>
                <td className="tbody-td">
                  <Link to={`/cdps/editar/${cdp.id}`}>
                    <EditIcon className="hover:text-gray-500" />
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
        <FiltersCDP isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} setTempFilters={setTempFilters} tempFilters={tempFilters} />
      )}
    </>
  );
}
