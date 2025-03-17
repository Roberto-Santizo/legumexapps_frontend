//HOOKS
import { useEffect, useState } from "react";
import { useAppStore } from "../stores/useAppStore";

//COMPONENTES
import AgricolaDashboard from "../views/agricola/AgricolaDashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import GeneralDashboard from "../views/admin/GeneralDashboards";
import CalidadDashboard from "../views/calidad/CalidadDashboard";
import ProduccionCDashboard from "../views/calidad/ProduccionCDashboard";
import CostosDashboard from "../views/calidad/CostosDashboard";
import PersonalCalidadDashboard from "../views/calidad/PersonalCalidadDashboard";

export default function Dashboard() {
  const dashboards = {
    'admin': (<GeneralDashboard />),
    'adminagricola':  (<AgricolaDashboard />),
    'auxagricola': (<AgricolaDashboard />),
    'pcalidad': (<PersonalCalidadDashboard />),
    'auxcalidad': (<CalidadDashboard />),
    'admincalidad': (<CalidadDashboard />),
    'pprod': (<ProduccionCDashboard />),
    'pcostos': (<CostosDashboard />),
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
