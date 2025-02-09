import { NavLink, useNavigate } from "react-router-dom";
import { BookCheck, BookXIcon, ListCheck, Map, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";

export default function AgricolaNavegation() {
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
      }
    };

    handleGetUserRoleByToken();
  }, []);
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

      {(role === "admin" || role === "adminagricola") && (
        <>
          {" "}
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
            to={"/cdps"}
            className={({ isActive }) =>
              `flex items-center gap-2 flex-row rounded transition-colors w-full p-2 ${
                isActive ? "bg-gray-200" : "hover:bg-gray-200"
              }`
            }
          >
            <BookXIcon className="w-8" />
            <p className="text-sm font-bold">Control Plantación</p>
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
      )}
    </>
  );
}
