import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexUsers() {
  const fetchUsers = useAppStore((state) => state.fetchUsers);
  const users = useAppStore((state) => state.users);
  const loading = useAppStore((state) => state.loadingUser);
  const error = useAppStore((state) => state.UserError);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h2 className="font-bold text-4xl">Administración de Usuarios</h2>
      <div>
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/administracion/usuarios/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Usuario</p>
          </Link>

          <Link
            to="/administracion/roles"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <p>Roles</p>
          </Link>

          <Link
            to="/administracion/permisos"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <p>Permisos</p>
          </Link>

          <Link
            to="/administracion/supervisores-calidad"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <p>Supervisores - Calidad</p>
          </Link>
        </div>

        <div className="p-2 h-96 overflow-y-auto mt-10">
          {loading && <Spinner />}
          {error && (
            <ShowErrorAPI />
          )} 
          {!loading && !error && (
            <table className="table">
              <thead className="bg-gray-400">
                <tr className="text-xs md:text-sm rounded">
                  <th scope="col" className="table-header">
                    Nombre
                  </th>
                  <th scope="col" className="table-header">
                    Nombre de Usuario
                  </th>
                  <th scope="col" className="table-header">
                    Correo
                  </th>
                  <th scope="col" className="table-header">Rol</th>
                  <th scope="col" className="table-header">
                    Estado
                  </th>
                  <th scope="col" className="table-header">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user) => (
                  <tr className="text-xl" key={user.id}>
                    <td className="record">
                      <p>{user.name}</p>
                    </td>
                    <td className="record">
                      <p>{user.username}</p>
                    </td>
                    <td className="record">
                      <p>{user.email }</p>
                    </td>
                    <td className="record">
                      <p>{user.roles.map((role) => role.name).join(", ")}</p>
                    </td>
                    <td className="record">
                      <span
                        className={
                          user.status
                            ? "bg-green-500 button"
                            : "bg-red-500 button"
                        }
                      >
                        {user.status ? "Activo" : "Inactivo"}
                      </span>
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
