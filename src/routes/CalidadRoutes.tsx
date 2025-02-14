import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("../views/calidad/rmp/IndexRMP")), roles: ['admin','pprod','pcampo','pcalidad'] },
  { path: "/rmp/crear", component: lazy(() => import("../views/calidad/rmp/Boleta_form1")), roles: ['admin','pcampo'] },
  { path: "/rmp/editar/:rm_reception_id", component: lazy(() => import("../views/calidad/rmp/EditRMP")), roles: ['admin','pprod','pcalidad'] },

  { path: "/calidad/producers", component: lazy(() => import("../views/calidad/Producers")), roles: ['admin','axucalidad','pcampo'] },
  { path: "/calidad/inspectors", component: lazy(() => import("../views/calidad/Inspectors")), roles: ['admin','axucalidad','pcampo'] },

  { path: "/variedades", component: lazy(() => import("../views/calidad/variedades/IndexVarieties")), roles: ['admin','pcalidad'] },
  { path: "/variedades/crear", component: lazy(() => import("../views/calidad/variedades/CrearVariedad")), roles: ['admin','pcalidad'] },
  
  { path: "/defectos", component: lazy(() => import("../views/calidad/defectos/IndexDefectos")), roles: ['admin','pcalidad'] },
  { path: "/defectos/crear", component: lazy(() => import("../views/calidad/defectos/CreateDefecto")), roles: ['admin','pcalidad'] },
  // { path: "/products-info/varieties", component: lazy(() => import("../views/calidad/products-info/Varieties")), roles: ['admin','axucalidad','pcampo'] },
  // { path: "/products-info/varietiesDefects", component: lazy(() => import("../views/calidad/products-info/VarietiesDefects")), roles: ['admin','axucalidad','pcampo'] },

  { path: "/transporte/boleta", component: lazy(() => import("../views/calidad/transporte/BoletaCamion")), roles: ['admin','pcalidad'] },
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
