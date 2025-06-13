import { getUserRoleByToken } from "@/api/LoginAPI";
import { useQuery } from "@tanstack/react-query";

export const useRole = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['userRole'],
        queryFn: getUserRoleByToken,
        retry: false,
        refetchOnWindowFocus: false
    });

    if (isError) {
        localStorage.removeItem('AUTH_TOKEN');
    }

    return { data, isError, isLoading }
}