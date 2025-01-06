import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import IndexUsers from "../views/admin/users/IndexUsers";
import CreateUser from "../views/admin/users/CreateUser";
import ProtectedRoute from "../components/ProtectedRoutes";
import IndexRoles from "../views/admin/roles/IndexRoles";
import Dashboard from "../components/Dashboard";
import IndexPermisos from "../views/admin/permisos/IndexPermisos";
import CreateRole from "../views/admin/roles/CreateRole";
import CreatePermiso from "../views/admin/permisos/CreatePermiso";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <IndexUsers />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/usuarios/crear"
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <IndexRoles />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/roles/crear"
          element={
            <ProtectedRoute>
              <CreateRole />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/permisos"
          element={
            <ProtectedRoute>
              <IndexPermisos />
            </ProtectedRoute>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/permisos/crear"
          element={
            <ProtectedRoute>
              <CreatePermiso />
            </ProtectedRoute>
          }
          index
        />
      </Route>
    </>
  );
}
