import { FileSpreadsheet, FilePlus } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CalidadNavegation() {
    return (
        <>
        
            <NavLink
                to={"/rmp"} className={({ isActive }) =>
                    `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                    }`
                }
            >
                <FileSpreadsheet className="w-8" />
                <p className="text-sm font-bold">Boleta RMP</p>
            </NavLink>

            <NavLink
                to={"/products-info/index"} className={({ isActive }) =>
                    `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                    }`
                }
            >
                < FilePlus className="w-8" />
                <p className="text-sm font-bold">Crear Variedad Producto</p>
            </NavLink>
        
        </>
    )
}


