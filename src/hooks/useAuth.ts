import { getUser } from "@/api/AuthAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isError, isLoading } = useQuery({
        queryKey: ['authenticate'],
        queryFn: getUser,
        retry: 1,
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    useEffect(() => {
        if (isError) {
            localStorage.removeItem('AUTH_TOKEN');
            toast.error('Tu sesión ha expirado');
            navigate('/login');
        }
    }, [isError]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                queryClient.invalidateQueries({ queryKey: ['authenticate'] });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        toast.success('Sesión Cerrada Correctamente');
        navigate('/login');
    };

    return { data, isLoading, logout, isError };
};
