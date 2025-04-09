import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { getUserRoleByToken } from "@/api/LoginAPI";
import Spinner from "./utilities-components/Spinner";
import GeneralDashboard from "./dashboards/GeneralDashboards";
import AgricolaDashboard from "./dashboards/AgricolaDashboard";
import PersonalCalidadDashboard from "./dashboards/PersonalCalidadDashboard";
import CalidadDashboard from "./dashboards/CalidadDashboard";
import ProduccionCDashboard from "./dashboards/ProduccionCDashboard";
import CostosDashboard from "./dashboards/CostosDashboard";
import RecursosDashboard from "./dashboards/RecursosDashboard";
import LogisticsDashboard from "./dashboards/LogisticsDashboard";
import GerenciaDashboard from "./dashboards/GerenciaDashboard";

export default function Dashboard() {
  const dashboards = {
    'admin': (<GeneralDashboard />),
    'adminagricola': (<AgricolaDashboard />),
    'auxagricola': (<AgricolaDashboard />),
    'pcalidad': (<PersonalCalidadDashboard />),
    'auxcalidad': (<CalidadDashboard />),
    'admincalidad': (<CalidadDashboard />),
    'pprod': (<ProduccionCDashboard />),
    'pcostos': (<CostosDashboard />),
    'auxrrhh': (<RecursosDashboard />),
    'logistics': (<LogisticsDashboard />),
    'gerencia': (<GerenciaDashboard />),
  };

  const { data: role, isLoading, isError, error } = useQuery({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRoleByToken,
    retry: false
  });

  if (isError) {
    toast.error(error.message, { toastId: 'loginError' });
    return <Navigate to={'/'} />
  }

  if (isLoading) return <Spinner />;
  if (role) return (
    <>
      {dashboards[role as keyof typeof dashboards]}
    </>
  );
}
