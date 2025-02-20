import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import { Variety } from "../../../types";
import { PlusIcon } from "lucide-react";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";

export default function IndexVariedades() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [variedades, setVariedades] = useState<Variety[]>([]);
  const getVarietiesPaginate = useAppStore((state) => state.getVarietiesPaginate);

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleGetInfo = async (page: number) => {
    setLoading(true);
    try {
      const data = await getVarietiesPaginate(page);
      setVariedades(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    } catch (error) {
      toast.error('Hubo un error al traer la información');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    handleGetInfo(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getVarietiesPaginate(1)
  }, []);
  return (
    <>
      <h2 className="font-bold text-3xl">Variedades</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/productos/variedades/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Variedad</p>
        </Link>
      </div>

      {error && <ShowErrorAPI />}
      {(loading && !error) ? <Spinner /> : (
        <div className="p-2 h-96 overflow-y-auto mt-10">
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">ID</th>
                <th scope="col" className="thead-th">Variedad</th>
              </tr>
            </thead>
            <tbody>
              {variedades.map(variedad => (
                <tr key={variedad.id} className="tbody-tr">
                  <td className="tbody-td">{variedad.id}</td>
                  <td className="tbody-td">{variedad.name}</td>
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
      )}
    </>
  )
}
