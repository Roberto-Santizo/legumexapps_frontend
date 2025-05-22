import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { getUsers, changeActiveUser, User } from "@/api/UsersAPI";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function IndexUsers() {
  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: User['id']) => changeActiveUser(id),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      refetch();
    }
  });

  const handleChangeUserStatus = async (id: User["id"]) => mutate(id);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (users) return (
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

        <div className="p-2 h-96 overflow-y-auto mt-10 scrollbar-hide">
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
                        disabled={isPending}
                        className={`w-24 ${isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                          }`}
                      >
                        {isPending ? (
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
        </div>
      </div>
    </>
  );
}
