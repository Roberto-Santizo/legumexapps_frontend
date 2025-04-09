import { PlusCircle, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-5 xl:grid xl:grid-cols-8 mt-10 px-4 md:px-8">
      <div className="col-start-1 col-span-8 xl:col-span-5 bg-gray-200 rounded-2xl shadow-xl">
        <div className="bg-gray-300 w-full p-4 flex items-center gap-3 text-gray-600 rounded-t-2xl">
          <UserIcon className="w-6 md:w-8 lg:w-9" />
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            Manejo de Usuarios
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:flex-wrap gap-4 p-4">
          {[
            { to: "/administracion/usuarios/crear", text: "Crear un Usuario" },
            { to: "/administracion/usuarios/crear", text: "Crear Rol" },
            { to: "/administracion/permisos/crear", text: "Crear Permiso" },
            {
              to: "/administracion/supervisores/crear",
              text: "Crear un Supervisor",
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex flex-col items-center hover:bg-gray-300 rounded-xl p-4 grow-animation-sm text-center"
            >
              <PlusCircle className="w-6 md:w-8 lg:w-9" />
              <p className="text-xs md:text-sm lg:text-base font-bold uppercase">
                {item.text}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Últimos Logeos */}
      <div className="col-start-1 col-span-8 bg-gray-200 rounded-2xl shadow-xl mt-5">
        <div className="bg-gray-300 w-full p-4 flex items-center gap-3 text-gray-600 rounded-t-2xl">
          <i className="fa-solid fa-user text-lg md:text-xl"></i>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            Últimos Logeos
          </h1>
        </div>

        <div className="p-4 h-64 md:h-80 lg:h-96 overflow-y-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-400">
              <tr className="rounded">
                <th className="text-white text-left p-2">Nombre</th>
                <th className="text-white text-left p-2">
                  Última versión vista
                </th>
                <th className="text-white text-left p-2">Fecha de logueo</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Aquí puedes iterar sobre datos dinámicos */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
