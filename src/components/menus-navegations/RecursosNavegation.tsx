import { FileUser } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function RecursosNavegation() {
    return (
        <>
            <NavLink
                to={"/permisos-empleados"}
                className={({ isActive }) =>
                    `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                    }`
                }
            >
                <FileUser />
                <p className="text-sm font-bold">Permisos</p>
            </NavLink>
        </>
    )
}
