import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedAgricolaRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/rmp", component: lazy(() => import("@/views/calidad/rmp/IndexRMP")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/crear", component: lazy(() => import("@/views/calidad/rmp/Boleta_form1")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/editar/:rm_reception_id", component: lazy(() => import("@/views/calidad/rmp/EditRMP")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },
  { path: "/rmp/documentos/:rm_reception_id", component: lazy(() => import("@/views/calidad/rmp/ShowRMP")), roles: ['admin', 'pprod', 'pcampo', 'pcalidad', 'pcostos', 'admincalidad', 'auxcalidad'] },

  { path: "/productores", component: lazy(() => import("@/views/calidad/productores/IndexProducers")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productores/crear", component: lazy(() => import("@/views/calidad/productores/CreateProducer")), roles: ['admin', 'admincalidad', 'auxcalidad'] },

  { path: "/productos", component: lazy(() => import("@/views/calidad/productos/IndexProducts")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/crear", component: lazy(() => import("@/views/calidad/productos/CrearProduct")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/:product_id/editar", component: lazy(() => import("@/views/calidad/productos/EditProduct")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/variedades", component: lazy(() => import("@/views/calidad/variedades/IndexVariedades")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/productos/variedades/crear", component: lazy(() => import("@/views/calidad/variedades/CrearVariedad")), roles: ['admin', 'admincalidad', 'auxcalidad'] },

  { path: "/transporte-boleta", component: lazy(() => import("@/views/calidad/transporte/IndexCamion")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/crear", component: lazy(() => import("@/views/calidad/transporte/CreateBoletaCamion")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/condiciones", component: lazy(() => import("@/views/calidad/transporte-condiciones/IndexTransporteCondiciones")), roles: ['admin', 'admincalidad', 'auxcalidad'] },
  { path: "/transporte-boleta/condiciones/crear", component: lazy(() => import("@/views/calidad/transporte-condiciones/CreateTransporteCondicion")), roles: ['admin', 'admincalidad', 'auxcalidad'] },


  { path: "/transportistas", component: lazy(() => import("@/views/calidad/transportistas/IndexTransportistas")), roles: ['admin'] },
  { path: "/transportistas/crear", component: lazy(() => import("@/views/calidad/transportistas/CrearTransportista")), roles: ['admin'] },

  { path: "/transportistas/pilotos", component: lazy(() => import("@/views/calidad/pilotos/IndexPilotos")), roles: ['admin'] },
  { path: "/transportistas/pilotos/crear", component: lazy(() => import("@/views/calidad/pilotos/CrearPiloto")), roles: ['admin'] },

  { path: "/transportistas/placas", component: lazy(() => import("@/views/calidad/placas/IndexPlacas")), roles: ['admin'] },
  { path: "/transportistas/placas/crear", component: lazy(() => import("@/views/calidad/placas/CrearPlaca")), roles: ['admin'] },

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
