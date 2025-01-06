import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { PencilIcon } from "@heroicons/react/16/solid";
import { formatDate } from "../../../helpers";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function IndexRoles() {
  const fetchRoles = useAppStore((state) => state.fetchRoles);
  const loadingRoles = useAppStore((state) => state.loadingRoles);
  const rolesError = useAppStore((state) => state.rolesError);
  const roles = useAppStore((state) => state.roles);

  useEffect(() => {
    fetchRoles();
  }, []);
  return (
    <>
      <div>
        <h2 className="font-bold text-4xl">Administración de Roles</h2>

        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/roles/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Rol</p>
          </Link>
        </div>


        <div className="p-2 h-96 overflow-y-auto mt-10">
          {loadingRoles && <Spinner />}
          {rolesError && <ShowErrorAPI />}
          {!loadingRoles && !rolesError && (
            <table className="table">
              <thead className="bg-gray-400">
                <tr className="text-xs md:text-sm rounded">
                  <th scope="col" className="table-header">
                    No.
                  </th>
                  <th scope="col" className="table-header">
                    Rol
                  </th>
                  <th scope="col" className="table-header">
                    Fecha de Creación
                  </th>
                  <th scope="col" className="table-header">
                    Última fecha de Modificación
                  </th>
                  <th scope="col" className="table-header">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {roles.map((role) => (
                  <tr className="text-xl" key={role.id}>
                    <td className="record">
                      <p>{role.id}</p>
                    </td>
                    <td className="record">
                      <p>{role.name}</p>
                    </td>
                    <td className="record">
                      <p>{formatDate(role.created_at)}</p>
                    </td>
                    <td className="record">
                      <p>{formatDate(role.updated_at)}</p>
                    </td>
                    <td className="record">
                      <PencilIcon className="w-8 cursor-pointer hover:text-gray-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
