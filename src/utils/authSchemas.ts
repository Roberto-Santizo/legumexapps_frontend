import { userSchema } from "./usersSchemas";

export const authenticatedUser = userSchema.pick({ id: true, name: true, email: true, role: true });