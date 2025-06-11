import { formatDate } from "@/helpers";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getRoles } from "@/api/RolesAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexRoles() {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data: roles, isLoading, isError } = useQuery({
    queryKey: ['getRoles', currentPage],
    queryFn: () => getRoles({ paginated: 'true', currentPage })
  });

  useEffect(() => {
    if (roles?.meta) {
      setPageCount(roles.meta?.last_page);
      setCurrentPage(roles.meta?.current_page);
    }
  }, [roles]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (roles) return (
    <>
      <div>
        <h2 className="font-bold text-4xl">Administración de Roles</h2>

        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/roles/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Rol</p>
          </Link>
        </div>


        <div className="p-2 mt-10">
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">
                  No.
                </th>
                <th scope="col" className="thead-th">
                  Rol
                </th>
                <th scope="col" className="thead-th">
                  Fecha de Creación
                </th>
                <th scope="col" className="thead-th">
                  Fecha de Creación
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.data.map((role) => (
                <tr className="tbody-tr" key={role.id}>
                  <td className="tbody-td">
                    <p>{role.id}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{role.name}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{formatDate(role.created_at)}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{formatDate(role.updated_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
