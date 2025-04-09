import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { getPermissions } from "@/api/PermissionsAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function IndexPermisos() {
  const { data: permissions, isLoading, isError } = useQuery({
    queryKey: ['getPermissions'],
    queryFn: getPermissions
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  if (permissions) return (
    <>
      <h2 className="font-bold text-4xl">Administración de Permisos</h2>
      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/permisos/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Permiso</p>
        </Link>
      </div>
      <div className="w-full p-2 h-96 overflow-y-scroll mt-10 scrollbar-hide">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                Permiso
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr className="tbody-tr" key={permission.id}>
                <td className="tbody-td">
                  <p>{permission.name}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
