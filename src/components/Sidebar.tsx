import { NavLink } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import AdminNavegation from "./menus-navegations/AdminNavegation";
import AgricolaNavegation from "./menus-navegations/AgricolaNavegation";
import MantoNavegation from "./menus-navegations/MantoNavegation";
import { HomeIcon } from "lucide-react";
import Spinner from "./Spinner";

export function Sidebar() {
  
  const userRole = useAppStore((state) => state.userRole);
  const loadingGetRole = useAppStore((state) => state.loadingGetRole);

  return (
    <div className="pb-12 h-screen w-64 bg-gray-100 dark:bg-gray-800">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Menu
          </h2>
          <nav className="gap-2 py-2 flex flex-col w-full">
            <NavLink
              to={"/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-200"
                }`
              }
            >
              <HomeIcon className="w-8" />
              <p className="text-sm font-bold">Dashboard</p>
            </NavLink>

            {loadingGetRole && <Spinner />}
            
            {userRole === "admin" && <AdminNavegation />}
            {(userRole === "adminagricola" || 
              userRole === "auxagricola" || userRole === 'admin') && <AgricolaNavegation />}
            {(userRole === "adminmanto" || userRole === "auxmanto" || userRole==="admin") && (
              <MantoNavegation />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
