//HOOKS
import { useAppStore } from "../stores/useAppStore"

//COMPONENTES
import AdminDashboard from "../views/admin/AdminDashboard";
import AgricolaDashboard from "../views/agricola/AgricolaDashboard";
import MantoDashboard from "../views/mantenimiento/MantoDashboard";

 export default function Dashboard() {
    const user = useAppStore((state) => state.AuthUser);

   return (
     <>
        {user.roles==='admin' && <AdminDashboard/>}
        {(user.roles==='adminagricola' || user.roles==='auxagricola') && <AgricolaDashboard/>}
        {(user.roles==='adminmanto' || user.roles==='auxmanto') && <MantoDashboard/>}
     </>
   )
 }
 