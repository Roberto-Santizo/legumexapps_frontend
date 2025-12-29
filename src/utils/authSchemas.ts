import { userSchema } from "../views/admin/users/schemas";

export const authenticatedUser = userSchema.pick({ id: true, name: true, email: true, role: true });