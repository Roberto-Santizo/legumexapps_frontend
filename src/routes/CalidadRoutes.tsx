import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("../views/calidad/rmp/IndexRMP")), roles: ['admin','pprod','pcampo'] },
  { path: "/rmp/crear", component: lazy(() => import("../views/calidad/rmp/Boleta_form1")), roles: ['admin','pcampo'] },
  { path: "/rmp/editar/:rm_reception_id", component: lazy(() => import("../views/calidad/rmp/EditRMP")), roles: ['admin','pprod','pcalidad'] },


  { path: "/calidad/producers", component: lazy(() => import("../views/calidad/Producers")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/calidad/inspectors", component: lazy(() => import("../views/calidad/Inspectors")), roles: ['admin','axucalidad','pcampo'] },
  

  { path: "/products-info/index", component: lazy(() => import("../views/calidad/products-info/IndexVarieties")), roles: ['admin','axucalidad','pcampo'] },

  { path: "/products-info/varieties", component: lazy(() => import("../views/calidad/products-info/Varieties")), roles: ['admin','axucalidad','pcampo'] },

  { path: "/products-info/defects", component: lazy(() => import("../views/calidad/products-info/ProductsDefects")), roles: ['admin','axucalidad','pcampo'] },

  { path: "/products-info/control", component: lazy(() => import("../views/calidad/rmp/control-quality/FormControlQuality")), roles: ['admin','axucalidad','pcampo'] },
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
