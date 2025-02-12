import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import AdminNavegation from "./menus-navegations/AdminNavegation";
import AgricolaNavegation from "./menus-navegations/AgricolaNavegation";
import { HomeIcon } from "lucide-react";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CalidadNavegation from "./menus-navegations/CalidadNavegation";

export function Sidebar() {
  const navigations = {
    admin: (
      <>
        <AdminNavegation /> <AgricolaNavegation /> <CalidadNavegation />
      </>
    ),
    adminagricola: <AgricolaNavegation />,
    auxagricola: <AgricolaNavegation />,
    pprod: <CalidadNavegation />
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  useEffect(() => {
    const handleGetUserRoleByToken = async () => {
      try {
        const userRole = await getUserRoleByToken();
        setRole(userRole);
      } catch (error) {
        toast.error("Hubo un error al cargar el contenido");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleGetUserRoleByToken();
  }, []);
  return (
    <div className="pb-12 h-screen w-64 bg-gray-100 ">
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

            {loading && <Spinner />}

            {!loading && navigations[role as keyof typeof navigations]}
          </nav>
        </div>
      </div>
    </div>
  );
}
