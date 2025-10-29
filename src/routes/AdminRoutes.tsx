import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/dashboard", component: lazy(() => import("@/components/Dashboard")), roles: [] },
  { path: "/usuarios", component: lazy(() => import("@/views/admin/users/views/IndexUsers")), roles: ['admin'] },
  { path: "/usuarios/crear", component: lazy(() => import("@/views/admin/users/views/CreateUser")), roles: ['admin'] },
  { path: "/usuarios/editar/:id", component: lazy(() => import("@/views/admin/users/views/EditUser")), roles: ['admin'] },


  { path: "/roles", component: lazy(() => import("@/views/admin/roles/views/IndexRoles")), roles: ['admin'] },
  { path: "/roles/crear", component: lazy(() => import("@/views/admin/roles/views/CreateRole")), roles: ['admin'] },

  { path: "/permisos", component: lazy(() => import("@/views/admin/permisos/views/IndexPermisos")), roles: ['admin'] },
  { path: "/permisos/crear", component: lazy(() => import("@/views/admin/permisos/views/CreatePermiso")), roles: ['admin'] },
];


export default function AgricolaRoutes() {
  return (
    <Route element={<Layout />}>
      {routes.map(({ path, component: Component, roles }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoutes roles={roles}>
                <Component />
              </ProtectedRoutes>
            </Suspense>
          }
        />
      ))}
    </Route>
  );
}
