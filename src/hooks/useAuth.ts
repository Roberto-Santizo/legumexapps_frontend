import { getUser } from "@/api/AuthAPI";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
    const navigate = useNavigate();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['authenticate'],
        queryFn: getUser,
        retry: 1,
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 60 * 2 
    });

    if (isError) {
        localStorage.removeItem('AUTH_TOKEN');
    }

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        toast.success('Sesión Cerrada Correctamente');
        navigate('/login');
    }

    return { data, isError, isLoading, logout }
}