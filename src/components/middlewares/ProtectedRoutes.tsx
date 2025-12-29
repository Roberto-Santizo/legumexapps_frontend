import { Navigate } from "react-router-dom";
import Spinner from "../utilities-components/Spinner";
import { useRole } from "@/hooks/useRole";
import { useNotification } from "../../core/notifications/NotificationContext";

type Props = {
  children: JSX.Element;
  roles: string[];
}

export default function ProtectedRoutes({ children, roles }: Props) {
  const { data: role, isLoading } = useRole();
  const notify = useNotification();

  if (isLoading) return <Spinner />;

  if (role && roles.length > 0 && !roles.includes(role)) {
    notify.error('No tienes acceso a este contenido', { toastId: 'noAccessError' });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
