import { NavLink } from "react-router-dom";
import { HomeIcon, UsersIcon } from "@heroicons/react/16/solid";

export default function AdminNavegation() {
  return (
    <>
      <nav className="gap-5 p-4 flex flex-col items-center justify-center w-full">
        <NavLink
          to={"/dashboard/administracion"}
          className={({ isActive }) =>
            `flex justify-center items-center flex-col p-2 rounded transition-colors w-20 ${
              isActive ? "bg-gray-500" : "hover:bg-gray-500"
            }`
          }
        >
          <HomeIcon className="w-8" />
          <p className="text-sm font-bold">Dashboard</p>
        </NavLink>

        <NavLink
          to={"/administracion/usuarios"}
          className={({ isActive }) =>
            `flex justify-center items-center flex-col p-2 rounded transition-colors w-20 ${
              isActive ? "bg-gray-500" : "hover:bg-gray-500"
            }`
          }
        >
          <UsersIcon className="w-8" />
          <p className="text-sm font-bold">Usuarios</p>
        </NavLink>
      </nav>
    </>
  );
}
