//HOOKS
import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { formatDate } from "../../../helpers";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { Permission } from "../../../types";

export default function IndexPermisos() {
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);

  const [permissions,setPermissions] = useState<Permission[]>([]);

  const fetchPermissions = useAppStore((state) => state.fetchPermissions);

  const handleGetPermissions = async () => {
    setLoading(true);
    try {
      const permissions = await fetchPermissions();
      setPermissions(permissions);
    } catch (error) {
      setError(true);
    }finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    handleGetPermissions();
  }, []);

  return (
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

      <div className="mt-10">
        {loading && <Spinner />}
        {!loading && error && <ShowErrorAPI />}
        {!loading && !error && (
          <table className="table">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">
                  No.
                </th>
                <th scope="col" className="thead-th">
                  Permiso
                </th>
                <th scope="col" className="thead-th">
                  Fecha de Creación
                </th>
                <th scope="col" className="thead-th">
                  Última fecha de Modificación
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr className="tbody-tr" key={permission.id}>
                  <td className="tbody-td">
                    <p>{permission.id}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{permission.name}</p>
                  </td>
                  <td className="tbody-td">
                    <p>{formatDate(permission.created_at)}</p>
                  </td>
                  <td className="tbody-td">
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
