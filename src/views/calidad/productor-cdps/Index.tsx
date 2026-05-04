import { getAllProductorCDPS } from "@/api/ProductorPlantationAPI";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";

export default function Index() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useQuery({
    queryKey: ["getAllProductorCDPS", currentPage], queryFn: () => getAllProductorCDPS({ page: currentPage, paginated: 'true' }),
  });

  useEffect(() => {
    if (data?.meta) {
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return (
    <div>
      <h2 className="font-bold md:text-4xl text-xl text-center md:text-left">CDPS de Productores</h2>

      <div className="flex md:flex-row flex-col justify-end md:gap-5">
        <Link
          to="/productor-cdps/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear CDP</p>
        </Link>
      </div>


      {data ? (
        <table className="table mt-5">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th uppercase">CDP</th>
              <th scope="col" className="thead-th uppercase">Finca</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(cdp => (
              <tr key={cdp.id} className="tbody-tr">
                <td className="tbody-td">{cdp.name}</td>
                <td className="tbody-td">{cdp.finca}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <Spinner />}


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
