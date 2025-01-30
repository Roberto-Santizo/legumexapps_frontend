import { PencilIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Lote } from "../../../types";
import Pagination from "../../../components/Pagination";

export default function IndexLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLotes = useAppStore((state) => state.fetchLotes);

  const handleGetLotes = async (page: number) => {
    setLoading(true);

    try {
      const lotes = await fetchLotes(page);
      setLotes(lotes.data);
      setPageCount(lotes.meta.last_page);
      setCurrentPage(lotes.meta.current_page);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    handleGetLotes(currentPage);
  }, [currentPage]);

  return (
    <>
      <h2 className="font-bold text-4xl">Lotes</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/lotes/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Lote</p>
        </Link>
      </div>

      {loading && <Spinner />}
      {!loading && error && <ShowErrorAPI />}
      {!loading && !error && (
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
              <th scope="col" className="thead-th">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr className="tbody-tr" key={lote.id}>
                <td className="tbody-td">{lote.id}</td>
                <td className="tbody-td">{lote.name}</td>
                <td className="tbody-td">{lote.finca}</td>
                <td className="tbody-td">{lote.cdp}</td>
                <td className="tbody-td">
                  <Link to={`/`}>
                    <PencilIcon className="w-8 cursor-pointer hover:text-gray-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mb-10 flex justify-end">
        {!loading && (
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
