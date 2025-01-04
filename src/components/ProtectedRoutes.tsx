import { Navigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore"; // Hook de Zustand

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const logedIn = useAppStore((state) => state.logedIn); 

  if (!logedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
