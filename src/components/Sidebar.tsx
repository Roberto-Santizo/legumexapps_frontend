import { NavLink } from "react-router-dom";
import AdminNavegation from "./menus-navegations/AdminNavegation";
import AgricolaNavegation from "./menus-navegations/AgricolaNavegation";
import { HomeIcon } from "lucide-react";
import BoletaRMPNavigation from "./menus-navegations/BoletaRMPNavigation";
import ProduccionNavigation from "./menus-navegations/ProduccionNavegation";
import RecursosNavegation from "./menus-navegations/RecursosNavegation";


type Props = {
  role: string
}

export function Sidebar({ role }: Props) {
  return (
    <div className="pb-12 h-screen w-64 bg-gray-100 ">
      <div className="space-y-4 py-4 max-h-screen  overflow-y-auto scrollbar-hide">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Menu
          </h2>
          <nav className="gap-2 py-2 flex flex-col w-full">
            <NavLink
              to={"/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                }`
              }
            >
              <HomeIcon className="w-8" />
              <p className="text-sm font-bold">Dashboard</p>
            </NavLink>

            {['admin'].includes(role) && (
              <>
                <AdminNavegation /> <AgricolaNavegation role={role} /> <BoletaRMPNavigation role={role} /> <ProduccionNavigation /> <RecursosNavegation />
              </>
            )}

            {['auxagricola', 'adminagricola'].includes(role) && (
              <AgricolaNavegation role={role} />
            )}

            {['pprod', 'admincalidad', 'auxcalidad', 'pprod', 'pcostos', 'pcalidad'].includes(role) && (
              <BoletaRMPNavigation role={role} />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
