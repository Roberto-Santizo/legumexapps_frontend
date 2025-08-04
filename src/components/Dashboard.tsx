import { useRole } from "@/hooks/useRole";
import Spinner from "./utilities-components/Spinner";
import GeneralDashboard from "./dashboards/GeneralDashboards";
import AgricolaDashboard from "./dashboards/AgricolaDashboard";
import PersonalCalidadDashboard from "./dashboards/PersonalCalidadDashboard";
import CalidadDashboard from "./dashboards/CalidadDashboard";
import CostosDashboard from "./dashboards/CostosDashboard";
import RecursosDashboard from "./dashboards/RecursosDashboard";
import ProductionDashboard from "./dashboards/ProductionDashboard";

export default function Dashboard() {
  const dashboards = {
    'admin': (<GeneralDashboard />),
    'adminagricola': (<AgricolaDashboard />),
    'alameda': (<AgricolaDashboard />),
    'tehuya': (<AgricolaDashboard />),
    'linda': (<AgricolaDashboard />),
    'auxagricola': (<AgricolaDashboard />),
    'pcalidad': (<PersonalCalidadDashboard />),
    'auxcalidad': (<CalidadDashboard />),
    'admincalidad': (<CalidadDashboard />),
    'pprod': (<ProductionDashboard />),
    'pcostos': (<CostosDashboard />),
    'auxrrhh': (<RecursosDashboard />),
    'logistics': (<ProductionDashboard />),
    'gerencia': (<ProductionDashboard />),
    'adminprod': (<ProductionDashboard />),
    'audiproceso': (<ProductionDashboard />),
    'costosuser': (<ProductionDashboard />),
    'exportuser': (<ProductionDashboard />),
  };

  const { data: role, isLoading } = useRole();
  if (isLoading) return <Spinner />;
  return (
    <>
      {dashboards[role as keyof typeof dashboards]}
    </>
  );
}
