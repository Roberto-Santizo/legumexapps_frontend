import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/permisos-empleados", component: lazy(() => import("@/views/rrhh/permisos/IndexPermisosEmpleados")), roles: ['admin', 'auxrrhh'] },
  { path: "/permisos-empleados/:id", component: lazy(() => import("@/views/rrhh/permisos/ShowPermisoEmpleado")), roles: ['admin', 'auxrrhh'] },
];

export default function RecursosRoutes() {
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
