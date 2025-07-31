import { getMateriaPrimaItems } from "@/api/MateriaPrimaAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Pagination from "@/components/utilities-components/Pagination";
import { Link } from "react-router-dom";
import { EditIcon, PlusIcon } from "lucide-react";

export default function IndexMateriaPrima() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useQuery({
    queryKey: ['getMateriaPrimaItems'],
    queryFn: () => getMateriaPrimaItems({ paginated: 'true', currentPage })
  });

  useEffect(() => {
    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (data) return (
    <>
      <h1 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Items Materia Prima</h1>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/materia-prima/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-4 xl:w-8" />
          <p className="text-xs xl:text-base">Crear Item</p>
        </Link>
      </div>


      <div className="table-wrapper">
        <table className="table mt-10">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Codigo</th>
              <th className="thead-th">Producto</th>
              <th className="thead-th">Tipo</th>
              <th className="thead-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(item => (
              <tr className="tbody-tr" key={item.id}>
                <td className="tbody-td">{item.code}</td>
                <td className="tbody-td">{item.product_name}</td>
                <td className="tbody-td">{item.type}</td>
                <td className="tbody-td">
                  <Link to={`/materia-prima/${item.id}/editar`}>
                    <EditIcon className="w-12 hover:text-gray-500" />
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
    </>
  )
}
