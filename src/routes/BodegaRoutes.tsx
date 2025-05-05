import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedAgricolaRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/boleta-empaque/salida", component: lazy(() => import("@/components/boleta-bodega/ComponentePrincipalBoletas")), roles: ['admin'] },
  { path: "/material-empaque/salida", component: lazy(() => import("@/views/bodega/formularios/MaterialEmpaqueSalida")), roles: ['admin'] },
  
  { path: "/material-empaque/crear", component: lazy(() => import("@/views/bodega/material-empaque/CreateItemMaterialEmpaque")), roles: ['admin'] },
  { path: "/material-empaque", component: lazy(() => import("@/views/bodega/material-empaque/IndexMaterialEmpaque")), roles: ['admin'] },

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
