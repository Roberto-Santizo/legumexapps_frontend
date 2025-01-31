//EXTERNOS
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

//LOCAL
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { User, Users } from "../../../types";
import { toast } from "react-toastify";

export default function IndexUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdateStatus,setLoadingUpdateStatus] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [users, setUsers] = useState<Users>();

  const fetchUsers = useAppStore((state) => state.fetchUsers);
  const changeActiveUser = useAppStore((state) => state.changeActiveUser);

  const handleGetUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleChangeUserStatus = async (id: User["id"]) => {
    setUpdatingId(id);
    setLoadingUpdateStatus(true);
    try {
      await changeActiveUser(id);
      const users = await fetchUsers();
      setUsers(users);
    } catch (error) {
      setError(true);
    } finally {
      setLoadingUpdateStatus(false);
      setUpdatingId('');
      toast.success("Estatus actualizado correctamente");
    }
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
          {(!loading && error) && <ShowErrorAPI />}
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
                {users?.data.map((user) => (
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
                    <td
                      className="tbody-td"
                      onClick={() => handleChangeUserStatus(user.id)}
                    >
                      <span
                        className={
                          user.status
                            ? "bg-green-500 button"
                            : "bg-red-500 button"
                        }
                      >
                        <button
                          disabled={loadingUpdateStatus}
                          className={`w-24 ${
                            loadingUpdateStatus
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {loadingUpdateStatus && updatingId == user.id ? (
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
