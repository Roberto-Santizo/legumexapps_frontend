import { userSchema } from "@/views/admin/users/schemas";
export const AuthenticatedUser = userSchema.pick({ id: true, name: true, email: true, role: true });