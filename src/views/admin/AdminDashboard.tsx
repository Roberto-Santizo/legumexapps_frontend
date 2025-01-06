//EXTERNAS
import { UserIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-5 xl:grid xl:grid-cols-8 mt-10">
      <div className="col-start-1 col-span-5 bg-gray-200 rounded-2xl shadow-xl">
        <div className="bg-gray-300 w-full p-5 flex flex-row gap-2 items-center text-gray-600 rounded-t-2xl">
          <UserIcon className="w-9" />
          <h1 className="text-2xl font-bold">Manejo de Usuarios</h1>
        </div>

        <div className="grid grid-cols-3 lg:flex lg:flex-row lg:items-center lg:flex-wrap gap-5 p-5">
          <Link
            to={"/administracion/usuarios/crear"}
            className="flex flex-col justify-between items-center hover:bg-gray-300 rounded-xl lg:p-5 grow-animation-sm"
          >
            <PlusCircleIcon className="w-9" />
            <p className="text-sm text-center font-bold uppercase">
              Crear un Usuario
            </p>
          </Link>

          <Link
            to={"/administracion/usuarios/crear"}
            className="flex flex-col justify-between items-center hover:bg-gray-300 rounded-xl lg:p-5 grow-animation-sm"
          >
            <PlusCircleIcon className="w-9" />
            <p className="text-sm text-center font-bold uppercase">Crear Rol</p>
          </Link>

          <Link
            to={"/administracion/permisos/crear"}
            className="flex flex-col justify-between items-center hover:bg-gray-300 rounded-xl lg:p-5 grow-animation-sm"
          >
            <PlusCircleIcon className="w-9" />
            <p className="text-sm text-center font-bold uppercase">
              Crear Permiso
            </p>
          </Link>

          <Link
            to={"/administracion/supervisores/crear"}
            className="flex flex-col justify-between items-center hover:bg-gray-300 rounded-xl lg:p-5 grow-animation-sm"
          >
            <PlusCircleIcon className="w-9" />
            <p className="text-sm text-center font-bold uppercase">
              Crear un Supervisor
            </p>
          </Link>
        </div>
      </div>

      <div className=" col-start-1 col-span-8 bg-gray-200 rounded-2xl shadow-xl mt-5">
        <div className="bg-gray-300 w-full p-5 flex flex-row gap-2 items-center text-gray-600 rounded-t-2xl">
          <i className="fa-solid fa-user text-2xl"></i>
          <h1 className="text-2xl font-bold">Ultimos logeos</h1>
        </div>

        <div className="p-2 h-96 overflow-y-auto">
          <table className="table">
            <thead className="bg-gray-400">
              <tr className="text-xs md:text-sm rounded">
                <th scope="col" className="text-white">
                  Nombre
                </th>
                <th scope="col" className="text-white">
                  Ultima versión vista
                </th>
                <th scope="col" className="text-white">
                  Fecha de logueo
                </th>
              </tr>
            </thead>
            <tbody className="table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
