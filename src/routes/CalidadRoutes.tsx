import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("../views/calidad/rmp/IndexRMP")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/rmp/crearBoleta", component: lazy(() => import("../views/calidad/rmp/CampoFormRMP")), roles: ['admin','axucalidad','pcampo'] },


  { path: "/calidad/producers", component: lazy(() => import("../views/calidad/Producers")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/calidad/inspectors", component: lazy(() => import("../views/calidad/Inspectors")), roles: ['admin','axucalidad','pcampo'] },
  

  { path: "/products-info/index", component: lazy(() => import("../views/calidad/products-info/IndexVarieties")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/products-info/varieties", component: lazy(() => import("../views/calidad/products-info/Varieties")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/products-info/varietiesDefects", component: lazy(() => import("../views/calidad/products-info/VarietiesDefects")), roles: ['admin','axucalidad','pcampo'] },
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
