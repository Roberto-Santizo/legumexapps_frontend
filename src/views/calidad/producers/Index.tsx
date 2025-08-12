import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducers, Producer } from "@/api/ProducersAPI";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function Index() {
  const [producers, setProducers] = useState<Producer[]>([]);

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPaginatedProducers', currentPage],
    queryFn: () => getProducers({ page: currentPage, paginated: '' }),
  });

  useEffect(() => {
    if (data) {
      setProducers(data.data);
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
  if (isError) return <ShowErrorAPI />

  return (
    <>
      <h2 className="font-bold md:text-4xl text-xl text-center md:text-left">Productores</h2>
      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/productores/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center text-xs md:text-base"
          >
            <PlusIcon className="w-8" />
            <p>Crear Productor</p>
          </Link>
        </div>
      </div>


      <div className="mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">ID</th>
              <th scope="col" className="thead-th">Codigo</th>
              <th scope="col" className="thead-th">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {producers.map(producer => (
              <tr key={producer.id} className="tbody-tr">
                <td className="tbody-td">{producer.id}</td>
                <td className="tbody-td">{producer.code}</td>
                <td className="tbody-td">{producer.name}</td>
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
