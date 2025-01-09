import { NavLink } from "react-router-dom";
import { BookCheck, ListCheck, Map, Warehouse } from "lucide-react";

export default function AgricolaNavegation() {
  return (
    <>
      <NavLink
        to={"/planes-semanales"}
        className={({ isActive }) =>
          `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
            isActive ? "bg-gray-200" : "hover:bg-gray-200"
          }`
        }
      >
        <BookCheck className="w-8" />
        <p className="text-sm font-bold">Planes Semanales</p>
      </NavLink>

      <NavLink
        to={"/tareas"}
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
        to={"/lotes"}
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
        to={"/insumos"}
        className={({ isActive }) =>
          `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
            isActive ? "bg-gray-200" : "hover:bg-gray-200"
          }`
        }
      >
        <Warehouse className="w-8" />
        <p className="text-sm font-bold">Insumos</p>
      </NavLink>
    </>
  );
}
