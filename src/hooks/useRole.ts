import { getUserRoleByToken } from "@/api/LoginAPI";
import { useQuery } from "@tanstack/react-query";

export const useRole = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['userRole'],
        queryFn: getUserRoleByToken,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { data, isError, isLoading }
}