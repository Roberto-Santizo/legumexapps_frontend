import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon } from "@heroicons/react/16/solid";
import { users } from "../../../data/data";


export default function IndexUsers() {
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
            <table className="table">
                <thead className="bg-gray-400">
                    <tr className="text-xs md:text-sm rounded">
                        <th scope="col" className="table-header">Nombre</th>
                        <th scope="col" className="table-header">Nombre de Usuario</th>
                        <th scope="col" className="table-header">Correo</th>
                        <th scope="col" className="table-header">Rol</th>
                        <th scope="col" className="table-header">Estado</th>
                        <th scope="col" className="table-header">Acciones</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {users.map((user) => 
                      <tr className="text-xl" key={user.id}>
                        <td className="record">
                          <span>{user.name}</span>
                        </td>
                        <td className="record">
                          <span>{user.username}</span>
                        </td>
                        <td className="record">
                          <span>{user.email}</span>
                        </td>
                        <td className="record">
                          <span>{user.role.name}</span>
                        </td>
                        <td className="record">
                          <span>{user.estado}</span>
                        </td>
                        <td className="record">
                          <PencilIcon className="w-8 cursor-pointer hover:text-gray-500"/>
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
}
