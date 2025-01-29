//EXTERNOS
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";

//LOCAL
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { User } from "../../../types";

export default function IndexUsers() {
  const fetchUsers = useAppStore((state) => state.fetchUsers);
  const changeActiveUser = useAppStore((state) => state.changeActiveUser);
  const loadingChangeStatus = useAppStore((state) => state.loadingChangeStatus);
  const updatingId = useAppStore((state) => state.updatingId);
  const users = useAppStore((state) => state.users);
  const loading = useAppStore((state) => state.loadingUser);
  const error = useAppStore((state) => state.UserError);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeUserStatus = (id: User["id"]) => {
    changeActiveUser(id);
  };

  return (
    <>
      <h2 className="font-bold text-4xl">Administración de Usuarios</h2>
      <div>
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/usuarios/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Usuario</p>
          </Link>
        </div>

        <div className="p-2 h-96 overflow-y-auto mt-10">
          {loading && <Spinner />}
          {error && <ShowErrorAPI />}
          {!loading && !error && (
            <table className="table">
              <thead>
                <tr className="thead-tr">
                  <th scope="col" className="thead-th">
                    Nombre
                  </th>
                  <th scope="col" className="thead-th">
                    Nombre de Usuario
                  </th>
                  <th scope="col" className="thead-th">
                    Correo
                  </th>
                  <th scope="col" className="thead-th">
                    Rol
                  </th>
                  <th scope="col" className="thead-th">
                    Estado
                  </th>
                  <th scope="col" className="thead-th">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="tbody-tr" key={user.id}>
                    <td className="tbody-td">
                      <p>{user.name}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{user.username}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{user.email}</p>
                    </td>
                    <td className="tbody-td">
                      <p>{user.roles}</p>
                    </td>
                    <td className="tbody-td"  onClick={() => handleChangeUserStatus(user.id)}>
                      <span
                        className={
                          user.status
                            ? "bg-green-500 button"
                            : "bg-red-500 button"
                        }
                      >
                        <button
                          disabled={loadingChangeStatus} 
                          className={`w-24 ${
                            loadingChangeStatus
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {(loadingChangeStatus && updatingId === user.id) ? (
                            <Spinner />
                          ) : user.status ? (
                            "ACTIVO"
                          ) : (
                            "INACTIVO"
                          )}
                        </button>
                      </span>
                    </td>
                    <td className="tbody-td">
                      <Link to={`/usuarios/editar/${user.id}`}>
                        <PencilIcon className="w-8 cursor-pointer hover:text-gray-500" />
                      </Link>
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
