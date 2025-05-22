import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserRole } from "@/api/UserAPI";
import Spinner from "../utilities-components/Spinner";

interface ProtectedRoutesProps {
  children: JSX.Element;
  roles: string[];
}

export default function ProtectedRoutes({ roles, children }: ProtectedRoutesProps) {
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRole
  });

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role]);

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

