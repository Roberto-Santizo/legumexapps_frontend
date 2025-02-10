import { Navigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore"; 
interface ProtectedAdminRoutesProps {
  children: JSX.Element;
}

export default function ProtectedAdminRoutes({ children }: ProtectedAdminRoutesProps) {
  const logedIn = useAppStore((state) => state.logedIn);
  const loadingGetRole = useAppStore((state) => state.loadingGetRole);


  if(!loadingGetRole){
    if (!logedIn) {
      return <Navigate to="/login" replace />;
    }

  }

  return children;
}
