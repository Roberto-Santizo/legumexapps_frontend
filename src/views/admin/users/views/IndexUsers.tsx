import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { getUsers, changeActiveUser } from "@/views/admin/users/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/views/admin/users/types";
import { useEffect, useState } from "react";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexUsers() {
  const queryClient = useQueryClient();
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const notify = useNotification();

  const { data: users, isLoading } = useQuery({
    queryKey: ['getUsers', currentPage],
    queryFn: () => getUsers({ paginated: 'true', currentPage })
  });

  useEffect(() => {
    if (users && users.meta) {
      setPageCount(users.meta.last_page);
      setCurrentPage(users.meta.current_page);
    }
  }, [users]);

  const { mutate, isPending } = useMutation({
    mutationFn: (id: User['id']) => changeActiveUser(id),
    onError: (error) => {
      notify.error(error.message)
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getUsers', currentPage] });
    }
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleChangeUserStatus = async (id: User["id"]) => mutate(id);

  if (isLoading) return <Spinner />
  if (users) return (
    <>
      <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Administración de Usuarios</h2>
      <div>
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/usuarios/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-4 xl:w-8" />
            <p className="text-xs xl:text-base">Crear Usuario</p>
          </Link>
        </div>

        <div className="p-2 mt-10 table-wrapper">
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
              {users.data.map((user) => (
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
                    <p>{user.role}</p>
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
