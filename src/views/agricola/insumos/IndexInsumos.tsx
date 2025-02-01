import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";
import { Insumos } from "../../../types";
import Pagination from "../../../components/Pagination";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export default function IndexInsumos() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [insumos, setInsumos] = useState<Insumos>({} as Insumos);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getInsumosPaginate = useAppStore((state) => state.getInsumosPaginate);

  const handleGetInsumos = async (page: number) => {
    setLoading(true);
    try {
      const insumos = await getInsumosPaginate(page);
      setInsumos(insumos);
      setPageCount(insumos.meta.last_page);
      setCurrentPage(insumos.meta.current_page);
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
    handleGetInsumos(currentPage);
  }, [currentPage]);

  return (
    <>
      <h2 className="font-bold text-4xl">Insumos</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/insumos/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Insumo</p>
        </Link>

        <Link
          to="/insumos/carga-masiva"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Carga Masiva de Insumos</p>
        </Link>
      </div>


      <div className="mt-10">
        {loading && <Spinner />}
        {!loading && error && <ShowErrorAPI />}
        {(!loading && !error && insumos.data) && (
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">
                  ID
                </th>
                <th scope="col" className="thead-th">
                  Insumo
                </th>
                <th scope="col" className="thead-th">
                  Codigo
                </th>
                <th scope="col" className="thead-th">
                  Unidad de Medida
                </th>
              </tr>
            </thead>
            <tbody>
              {insumos.data.map((insumo) => (
                <tr className="tbody-tr" key={insumo.id}>
                  <td className="tbody-td">
                    <p>{insumo.id}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{insumo.name}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{insumo.code}</p>
                  </td>
                  <td className="tbody-td flex gap-2">
                    <p>{insumo.measure}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
