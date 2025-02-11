import { useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore"; 
interface ProtectedCalidadRoutesProps {
  children: JSX.Element;
}

export default function ProtectedCalidadRoutes({ children }: ProtectedCalidadRoutesProps) {
    const [loading, setLoading] = useState<boolean>(true); 
    const logedIn = useAppStore((state) => state.logedIn);
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();
    const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);
  
    if(!logedIn){
      navigate('/login');
    }
  
    const handleGetUserRoleByToken = async () => {
      try {
        const userRole = await getUserRoleByToken();
        setRole(userRole);
      } catch (error) {
        toast.error("Hubo un error al cargar el contenido");
        navigate("/login"); 
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      handleGetUserRoleByToken();
    }, []);
  
    useEffect(() => {
      if (role && !roles.includes(role)) {
        toast.error("No tienes permisos para acceder a esta sección");
        navigate("/dashboard");
      }
    }, [role]);
  
    if (loading) {
      return <Spinner />; 
    }
  
    return children; 
}
