//HOOKS
import { useAppStore } from "../stores/useAppStore";

//COMPONENTES
import AdminDashboard from "../views/admin/AdminDashboard";
import AgricolaDashboard from "../views/agricola/AgricolaDashboard";
import MantoDashboard from "../views/mantenimiento/MantoDashboard";

export default function Dashboard() {
  const userRole = useAppStore((state) => state.userRole);
 
  return (
    <>
      {userRole === "admin" && <AdminDashboard />}
      {(userRole === "adminagricola" || userRole === "auxagricola") && (
        <AgricolaDashboard />
      )}
      {(userRole === "adminmanto" || userRole === "auxmanto") && (
        <MantoDashboard />
      )}
    </>
  );
}
