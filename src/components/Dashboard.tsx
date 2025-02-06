//HOOKS
import { useEffect, useState } from "react";
import { useAppStore } from "../stores/useAppStore";

//COMPONENTES
import AdminDashboard from "../views/admin/AdminDashboard";
import AgricolaDashboard from "../views/agricola/AgricolaDashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export default function Dashboard() {
  const dashboards = {
    'admin': (<AdminDashboard />),
    'adminagricola':  (<AgricolaDashboard />),
    'auxagricola': (<AgricolaDashboard />)
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
    <>
      {loading && <Spinner />}
      {!loading && dashboards[role as keyof typeof dashboards]}
    </>
  );
}
