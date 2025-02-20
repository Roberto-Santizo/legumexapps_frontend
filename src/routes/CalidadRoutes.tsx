import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("../views/calidad/rmp/IndexRMP")), roles: ['admin','pprod','pcampo','pcalidad'] },
  { path: "/rmp/crear", component: lazy(() => import("../views/calidad/rmp/Boleta_form1")), roles: ['admin','pcampo','pcalidad'] },
  { path: "/rmp/editar/:rm_reception_id", component: lazy(() => import("../views/calidad/rmp/EditRMP")), roles: ['admin','pprod','pcalidad'] },
  { path: "/rmp/documentos/:rm_reception_id", component: lazy(() => import("../views/calidad/rmp/ShowRMP")), roles: ['admin','pprod','pcalidad'] },

  { path: "/productores", component: lazy(() => import("../views/calidad/productores/IndexProducers")), roles: ['admin','pcalidad'] },
  { path: "/productores/crear", component: lazy(() => import("../views/calidad/productores/CreateProducer")), roles: ['admin','pcalidad'] },

  { path: "/productos", component: lazy(() => import("../views/calidad/productos/IndexProducts")), roles: ['admin','pcalidad'] },
  { path: "/productos/crear", component: lazy(() => import("../views/calidad/productos/CrearProduct")), roles: ['admin','pcalidad'] },
  { path: "/productos/:product_id/editar", component: lazy(() => import("../views/calidad/productos/EditProduct")), roles: ['admin','pcalidad'] },
  { path: "/productos/variedades", component: lazy(() => import("../views/calidad/variedades/IndexVariedades")), roles: ['admin','pcalidad'] },
  { path: "/productos/variedades/crear", component: lazy(() => import("../views/calidad/variedades/CrearVariedad")), roles: ['admin','pcalidad'] },

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
