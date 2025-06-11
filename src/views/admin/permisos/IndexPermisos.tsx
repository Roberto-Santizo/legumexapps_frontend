import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { getPermissions } from "@/api/PermissionsAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexPermisos() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data: permissions, isLoading, isError } = useQuery({
    queryKey: ['getPermissions', currentPage],
    queryFn: () => getPermissions({ paginated: 'true', currentPage })
  });

  useEffect(() => {
    if (permissions?.meta) {
      setPageCount(permissions.meta.last_page);
      setCurrentPage(permissions.meta.current_page);
    }
  }, [permissions]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  if (permissions) return (
    <>
      <h2 className="font-bold text-4xl">Administración de Permisos</h2>
      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/permisos/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Permiso</p>
        </Link>
      </div>
      <div className="p-2 mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                Permiso
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.data.map((permission) => (
              <tr className="tbody-tr" key={permission.id}>
                <td className="tbody-td">
                  <p>{permission.name}</p>
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
