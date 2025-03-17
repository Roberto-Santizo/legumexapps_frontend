import { useEffect } from "react";
import { useAppStore } from "../stores/useAppStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";

interface ProtectedAgricolaRoutesProps {
  children: JSX.Element;
  roles: string[]
}

export default function ProtectedAgricolaRoutes({ roles, children }: ProtectedAgricolaRoutesProps) {
  const logedIn = useAppStore((state) => state.logedIn);
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRoleByToken
  });

  if (!logedIn) {
    navigate('/login');
  }

  useEffect(() => {
    if (role && !roles.includes(role)) {
      toast.error("No tienes permisos para acceder a esta sección");
      navigate("/dashboard");
    }
  }, [role]);


  if (isError) navigate('/login');
  if (isLoading) {
    return <Spinner />;
  }

  if (role) return children;
}
