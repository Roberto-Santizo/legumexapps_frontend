import { FileSpreadsheet, ChartBarIncreasing, Truck, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

type Props = {
    role: string
}

export default function BoletaRMPNavigation({ role }: Props) {
    return (
        <>
            <NavLink
                to={"/rmp"} className={({ isActive }) =>
                    `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                    }`
                }
            >
                <FileSpreadsheet className="w-8" />
                <p className="text-sm font-bold">Boleta Materia Prima</p>
            </NavLink>


            {['pcalidad', 'admin'].includes(role) && (
                <>
                    <NavLink
                        to={"/transporte-boleta"} className={({ isActive }) =>
                            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <Truck className="w-8" />
                        <p className="text-sm font-bold">Inspeccion de transporte</p>
                    </NavLink>
                </>
            )}

            {(['auxcalidad', 'admin', 'admincalidad'].includes(role)) && (
                <>
                    <NavLink
                        to={"/productos"} className={({ isActive }) =>
                            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <ChartBarIncreasing className="w-8" />
                        <p className="text-sm font-bold">Productos y Variedades</p>
                    </NavLink>
                </>
            )}

            {['admin', 'admincalidad'].includes(role) && (
                <>
                    <NavLink
                        to={"/productores"} className={({ isActive }) =>
                            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <User className="w-8" />
                        <p className="text-sm font-bold">Productores</p>
                    </NavLink>

                    <NavLink
                        to={"/transportistas"} className={({ isActive }) =>
                            `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <Users className="w-8" />
                        <p className="text-sm font-bold">Transportistas y Pilotos</p>
                    </NavLink>
                </>
            )
            }
        </>
    )
}


