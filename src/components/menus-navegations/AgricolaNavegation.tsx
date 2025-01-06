import { NavLink } from "react-router-dom";
import { BookCheck, ListCheck, Map, Warehouse } from "lucide-react";

export default function AgricolaNavegation() {
  return (
    <>
      <nav className="gap-5 p-4 flex flex-col items-center justify-center w-full">
        <NavLink
          to={"/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
              isActive ? "bg-gray-200" : "hover:bg-gray-200"
            }`
          }
        >
          <BookCheck className="w-8" />
          <p className="text-sm font-bold">Tareas Finca</p>
        </NavLink>

        <NavLink
          to={"/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
              isActive ? "bg-gray-200" : "hover:bg-gray-200"
            }`
          }
        >
          <ListCheck className="w-8" />
          <p className="text-sm font-bold">Tareas</p>
        </NavLink>

        <NavLink
          to={"/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
              isActive ? "bg-gray-200" : "hover:bg-gray-200"
            }`
          }
        >
          <Map className="w-8" />
          <p className="text-sm font-bold">Lotes</p>
        </NavLink>

        <NavLink
          to={"/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
              isActive ? "bg-gray-200" : "hover:bg-gray-200"
            }`
          }
        >
          <Warehouse className="w-8" />
          <p className="text-sm font-bold">Insumos</p>
        </NavLink>
      </nav>
    </>
  );
}
