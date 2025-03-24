import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/planes-produccion/crear", component: lazy(() => import("../views/produccion/planes_semanales/CreatePlanSemanal")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion", component: lazy(() => import("../views/produccion/planes_semanales/IndexPlanSemanalProduccion")), roles: ['admin','audiproceso'] },

  { path: "/planes-produccion/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowPlanSemanalProduccion")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion/calendario/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/CalendarTasks")), roles: ['admin','audiproceso'] },
  // { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowLineaDetalles")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion/asignacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/AsignarEmpleadosTareaProduccion")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion/informacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/TaskProductionPlanDetails")), roles: ['admin','audiproceso'] },

  { path: "/skus", component: lazy(() => import("../views/produccion/sku/IndexSKU")), roles: ['admin','audiproceso'] },
  { path: "/skus/crear", component: lazy(() => import("../views/produccion/sku/CreateSKU")), roles: ['admin','audiproceso'] },
  // { path: "/skus/ModalSku", component: lazy(() => import("../views/produccion/sku/ModalSku")), roles: ['admin','audiproceso'] },

  { path: "/lineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin','audiproceso'] },
  { path: "/lineas/crear", component: lazy(() => import("../views/produccion/lineas/CrearLinea")), roles: ['admin','audiproceso'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin','audiproceso'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin','audiproceso'] },

  
];

export default function ProduccionRoutes() {
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
