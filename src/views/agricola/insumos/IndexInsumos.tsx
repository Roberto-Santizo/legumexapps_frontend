import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { getPaginatedInsumos } from "@/api/InsumosAPI";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function IndexInsumos() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: insumos, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedInsumos', currentPage],
    queryFn: () => getPaginatedInsumos(currentPage)
  });
  
  useEffect(()=>{
    if(insumos){
      setPageCount(insumos.meta.last_page);
      setCurrentPage(insumos.meta.current_page);
    }
  },[insumos]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (insumos) return (
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
      </div>

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
