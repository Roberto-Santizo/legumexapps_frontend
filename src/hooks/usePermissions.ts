import { useQuery } from '@tanstack/react-query';
import { getPermissionsByUser } from '@/api/PermissionsAPI';

export function usePermissions() {
  const { data } = useQuery({
    queryKey: ['getPermissionsByUser'],
    queryFn: getPermissionsByUser
  });

  const permissions = data?.map((perm) => perm.name) ?? [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  return { permissions, hasPermission };
}
