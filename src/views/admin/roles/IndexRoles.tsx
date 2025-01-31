import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { formatDate } from "../../../helpers";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Role } from "../../../types";

export default function IndexRoles() {
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const fetchRoles = useAppStore((state) => state.fetchRoles);


  const handleGetRoles = async () => {
    setLoading(true);
    try {
      const roles = await fetchRoles();
      setRoles(roles);
    } catch (error) {
      setError(true);
    }finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    handleGetRoles();
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
          {loading && <Spinner />}
          {(!loading && error) && <ShowErrorAPI />}
          {!loading && !error && (
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
                {roles.map((role) => (
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
          )}
        </div>
      </div>
    </>
  );
}
