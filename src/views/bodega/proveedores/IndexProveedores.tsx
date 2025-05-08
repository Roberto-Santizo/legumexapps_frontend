import { PlusIcon, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPaginatedProveedor, Supplier } from "@/api/BodegaProveedoresAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexProveedores() {
  const [proveedores, setProveedores] = useState<Supplier[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedProveedor", currentPage],
    queryFn: () => getPaginatedProveedor(currentPage),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setProveedores(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <h1 className="font-bold text-3xl">Proveedores</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/proveedores/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">código</th>
            <th className="thead-th">Nombre</th>
            <th className="thead-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr className="tbody-tr" key={proveedor.id}>
              <td className="tbody-td">{proveedor.code} </td>
              <td className="tbody-td">{proveedor.name} </td>
              <td className="tbody-td">
                <Link
                  to={`/proveedor/editar/${proveedor.id}`}
                  className="hover:text-gray-400"
                >
                  <Edit />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 mb-10 flex justify-center md:justify-end">
        {
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        }
      </div>
    </>
  );
}
