import { FileSpreadsheet } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CalidadNavegation() {
    return (
        <>
            <NavLink
                to={"/recepcion-mp"} className={({ isActive }) =>
                    `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                    }`
                }
            >
                <FileSpreadsheet className="w-8" />
                <p className="text-sm font-bold">Boleta RMP</p>
            </NavLink>
        </>
    )
}
