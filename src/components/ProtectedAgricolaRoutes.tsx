import { Navigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore"; 
interface ProtectedAgricolaRoutesProps {
  children: JSX.Element;
}

export default function ProtectedAgricolaRoutes({ children }: ProtectedAgricolaRoutesProps) {
  const logedIn = useAppStore((state) => state.logedIn);
  const loadingAuth = useAppStore((state) => state.loadingAuth);
  const loadingGetRole = useAppStore((state) => state.loadingGetRole);
  // const userRole = useAppStore((state) => state.userRole);


  if(!loadingAuth && !loadingGetRole){
    if (!logedIn) {
      return <Navigate to="/login" replace />;
    }
  
    // if (userRole !== "adminagricola" && userRole !== "admin") {
    //   return <Navigate to="/dashboard" replace />;
    // }
  }

  return children;
}
