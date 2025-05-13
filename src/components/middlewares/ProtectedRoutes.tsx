import { useEffect } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";

interface ProtectedRoutesProps {
  children: JSX.Element;
  roles: string[];
}

export default function ProtectedRoutes({ roles, children }: ProtectedRoutesProps) {
  const logedIn = useAppStore((state) => state.logedIn);
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRoleByToken
  });

  useEffect(() => {
    if (!logedIn) {
      navigate("/login");
    }
  }, [logedIn, navigate]);

  useEffect(() => {
    if (role && roles.length > 0 && !roles.includes(role)) {
      toast.error("No tienes permisos para acceder a esta sección");
      navigate("/dashboard");
    }
  }, [role, roles, navigate]);

  if (isError) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (role && (roles.length === 0 || roles.includes(role))) {
    return children;
  }

  return null;
}

