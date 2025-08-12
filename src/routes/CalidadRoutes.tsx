import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("@/views/calidad/rmp/Index")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/crear", component: lazy(() => import("@/views/calidad/rmp/Boleta_form1")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/editar/:rm_reception_id", component: lazy(() => import("@/views/calidad/rmp/Edit")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/documentos/:rm_reception_id", component: lazy(() => import("@/views/calidad/rmp/Show")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },

  { path: "/productores", component: lazy(() => import("@/views/calidad/producers/Index")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productores/crear", component: lazy(() => import("@/views/calidad/producers/Create")), roles: ['admin', 'admincalidad', 'auxcalidad'] },

  { path: "/productos", component: lazy(() => import("@/views/calidad/products/Index")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/crear", component: lazy(() => import("@/views/calidad/products/Create")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/:product_id/editar", component: lazy(() => import("@/views/calidad/products/Edit")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/variedades", component: lazy(() => import("@/views/calidad/product-varieties/Index")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/variedades/crear", component: lazy(() => import("@/views/calidad/product-varieties/Create")), roles: ['admin', 'admincalidad', 'auxcalidad'] },

  { path: "/transporte-boleta", component: lazy(() => import("@/views/calidad/transport/Index")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/crear", component: lazy(() => import("@/views/calidad/transport/Create")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/condiciones", component: lazy(() => import("@/views/calidad/conditions-transport/Index")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/condiciones/crear", component: lazy(() => import("@/views/calidad/conditions-transport/Create")), roles: ['admin', 'admincalidad', 'auxcalidad'] },


  { path: "/transportistas", component: lazy(() => import("@/views/calidad/carriers/Index")), roles: ['admin'] },
  { path: "/transportistas/crear", component: lazy(() => import("@/views/calidad/carriers/Create")), roles: ['admin'] },

  { path: "/transportistas/pilotos", component: lazy(() => import("@/views/calidad/pilots/Index")), roles: ['admin'] },
  { path: "/transportistas/pilotos/crear", component: lazy(() => import("@/views/calidad/pilots/Create")), roles: ['admin'] },

  { path: "/transportistas/placas", component: lazy(() => import("@/views/calidad/plates/Index")), roles: ['admin'] },
  { path: "/transportistas/placas/crear", component: lazy(() => import("@/views/calidad/plates/Create")), roles: ['admin'] },

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
