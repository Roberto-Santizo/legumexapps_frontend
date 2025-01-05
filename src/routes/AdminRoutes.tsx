import { Route } from "react-router-dom";
import AdminDashboard from "../views/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import IndexUsers from "../views/admin/users/IndexUsers";
import CreateUser from "../views/admin/users/CreateUser";
import ProtectedRoute from "../components/ProtectedRoutes";
import IndexRoles from "../views/admin/roles/IndexRoles";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminLayout />}>
        <Route
          path="/dashboard/administracion"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path="/administracion/usuarios"
          element={
            <ProtectedRoute>
              <IndexUsers />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path="/administracion/usuarios/crear"
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path="/administracion/roles"
          element={
            <ProtectedRoute>
              <IndexRoles />
            </ProtectedRoute>
          }
          index
        />
      </Route>
    </>
  );
}
