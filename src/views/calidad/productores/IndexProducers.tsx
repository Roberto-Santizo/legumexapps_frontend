import { useEffect, useState } from "react";
import { Producer } from "@/types";
import Spinner from "@/components/Spinner";
import { PlusIcon } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";

import { getPaginatedProducers } from "@/api/ProducersAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function IndexProducers() {
  const [producers, setProducers] = useState<Producer[]>([]);

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPaginatedProducers', currentPage],
    queryFn: () => getPaginatedProducers(currentPage)
  });

  useEffect(() => {
    if (data) {
      setProducers(data.data);
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
      <h2 className="font-bold text-4xl">Productores</h2>
      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/productores/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
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
