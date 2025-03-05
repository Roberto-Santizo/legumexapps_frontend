import { NavLink } from "react-router-dom";
import { BookOpenCheck } from "lucide-react";

export default function ProduccionNavigation() {
  return (
    <>
      <NavLink
        to={"/plan-semana-produccion"}
        className={({ isActive }) =>
          `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
            isActive ? "bg-gray-200" : "hover:bg-gray-200"
          }`
        }
      >
        <BookOpenCheck className="w-8" />
        <p className="text-sm font-bold">Plan Semanal Producción</p>
      </NavLink>

      <NavLink
        to={"/sku/IndexSKU"}
        className={({ isActive }) =>
          `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
            isActive ? "bg-gray-200" : "hover:bg-gray-200"
          }`
        }
      >
        <BookOpenCheck className="w-8" />
        <p className="text-sm font-bold">Sku</p>
      </NavLink>

      <NavLink
        to={"/lineas/IndexLineas"}
        className={({ isActive }) =>
          `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
            isActive ? "bg-gray-200" : "hover:bg-gray-200"
          }`
        }
      >
        <BookOpenCheck className="w-8" />
        <p className="text-sm font-bold">Linea</p>
      </NavLink>
    </>
  );
}



