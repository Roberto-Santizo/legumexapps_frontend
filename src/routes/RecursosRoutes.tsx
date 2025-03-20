import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/permisos-empleados", component: lazy(() => import("../views/rrhh/permisos/IndexPermisosEmpleados")), roles: ['admin'] },
  { path: "/permisos-empleados/:id", component: lazy(() => import("../views/rrhh/permisos/ShowPermisoEmpleado")), roles: ['admin'] },
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
              <ProtectedAgricolaRoutes roles={roles}>
                <Component />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
        />
      ))}
    </Route>

  );
}
