import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("../views/calidad/rmp/IndexRMP")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/rmp/crear", component: lazy(() => import("../views/calidad/rmp/CampoFieldRMP")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/rmp-produccion", component: lazy(() => import("../views/calidad/rmp/rmp-produccion/ProductionFieldRMP")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/rmp-produccion/grn", component: lazy(() => import("../views/calidad/rmp/rmp-produccion/ProductionGRN")), roles: ['admin','axucalidad','pcampo'] },


];

export default function CalidadRoutes() {
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
