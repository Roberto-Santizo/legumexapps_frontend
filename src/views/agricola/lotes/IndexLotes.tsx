import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPaginatedLotes } from "@/api/LotesAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexLotes() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: lotes, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedLotes', currentPage],
    queryFn: () => getPaginatedLotes(currentPage)
  });

  useEffect(() => {
    if (lotes) {
      setPageCount(lotes.meta.last_page);
      setPageCount(lotes.meta.current_page);
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
    </>
  );
}
