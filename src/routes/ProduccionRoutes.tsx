import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/planes-produccion/crear", component: lazy(() => import("../views/produccion/planes_semanales/CreatePlanSemanal")), roles: ['admin', 'audiproceso', 'logistics'] },
  { path: "/planes-produccion", component: lazy(() => import("../views/produccion/planes_semanales/IndexPlanSemanalProduccion")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics'] },

  { path: "/planes-produccion/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowPlanSemanalProduccion")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics'] },
  { path: "/planes-produccion/calendario/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/CalendarTasks")), roles: ['admin', 'audiproceso', 'logistics'] },
  { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowLineaDetalles")), roles: ['admin', 'audiproceso', 'logistics'] },
  { path: "/planes-produccion/asignacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/AsignarEmpleadosTareaProduccion")), roles: ['admin', 'audiproceso'] },
  { path: "/planes-produccion/informacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/TaskProductionPlanDetails")), roles: ['admin', 'audiproceso', 'logistics'] },
  { path: "/planes-produccion/tarea-produccion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/FinishedTaskProductionDetails")), roles: ['admin', 'audiproceso', 'logistics'] },

  { path: "/skus", component: lazy(() => import("../views/produccion/sku/IndexSKU")), roles: ['admin', 'pcostos'] },
  { path: "/skus/crear", component: lazy(() => import("../views/produccion/sku/CreateSKU")), roles: ['admin', 'pcostos'] },

  { path: "/lineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/posiciones/:id", component: lazy(() => import("../views/produccion/lineas/PosicionesLinea")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/crear", component: lazy(() => import("../views/produccion/lineas/CrearLinea")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin', 'pcostos'] },

  { path: "/lineas-skus", component: lazy(() => import("../views/produccion/lineas_skus/IndexLineasSku")), roles: ['admin', 'pcostos'] },
  { path: "/lineas-skus/crear", component: lazy(() => import("../views/produccion/lineas_skus/CrearLineaSku")), roles: ['admin', 'pcostos'] },

  { path: "/tiempos-muertos", component: lazy(() => import("../views/produccion/tiempos_muertos/IndexTiemposMuertos")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/crear", component: lazy(() => import("../views/produccion/tiempos_muertos/CrearTiempoMuerto")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/editar/:id", component: lazy(() => import("../views/produccion/tiempos_muertos/EditarTiempoMuerto")), roles: ['admin', 'pcostos'] },

  { path: "/graficas-diarias", component: lazy(() => import("../views/produccion/graficasDiarias/DailyGraphs")), roles: ['admin', 'logistics','audiproceso','gerencia'] },

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
