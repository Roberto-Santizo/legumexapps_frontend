import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { getCondicionesTransporte } from "@/api/BoletaTransporteAPI";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

type Condition = {
  id: string;
  name: string;
}

export default function Index() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPaginatedTransporteCondiciones', currentPage],
    queryFn: () => getCondicionesTransporte({ page: currentPage, paginated: '' }),
  });

  useEffect(() => {
    if (data) {
      setConditions(data.data);
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
  return (
    <>
      <h1 className="font-bold text-3xl">Condiciones a Evaluar Transporte</h1>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/transporte-boleta/condiciones/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear condición</p>
        </Link>
      </div>
      <div className="p-2 mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">ID</th>
              <th scope="col" className="thead-th">Condición</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map(condition => (
              <tr key={condition.id} className="tbody-tr">
                <td className="tbody-td">{condition.id}</td>
                <td className="tbody-td">{condition.name}</td>
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
    </>
  )
}
