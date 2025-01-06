//HOOKS
import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { formatDate } from "../../../helpers";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexPermisos() {
  const fetchPermissions = useAppStore((state) => state.fetchPermissions);
  const loadingPermissions = useAppStore((state) => state.loadingPermissions);
  const permissionsError = useAppStore((state) => state.permissionError);
  const permissions = useAppStore((state) => state.permissions);

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <>
      <h2 className="font-bold text-4xl">Administración de Permisos</h2>

      <div className="mt-10">
        {loadingPermissions && <Spinner />}
        {permissionsError && <ShowErrorAPI />}
        {!loadingPermissions && !permissionsError && (
          <table className="table">
            <thead className="bg-gray-400">
              <tr className="text-xs md:text-sm rounded">
                <th scope="col" className="table-header">
                  No.
                </th>
                <th scope="col" className="table-header">
                  Permiso
                </th>
                <th scope="col" className="table-header">
                  Fecha de Creación
                </th>
                <th scope="col" className="table-header">
                  Última fecha de Modificación
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {permissions.map((permission) => (
                <tr className="text-xl" key={permission.id}>
                  <td className="record">
                    <p>{permission.id}</p>
                  </td>
                  <td className="record">
                    <p>{permission.name}</p>
                  </td>
                  <td className="record">
                    <p>{formatDate(permission.created_at)}</p>
                  </td>
                  <td className="record">
                    <p>{formatDate(permission.updated_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
