import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/planes-produccion/crear", component: lazy(() => import("@/views/produccion/planes_semanales/CreatePlanSemanal")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega'] },
  { path: "/planes-produccion", component: lazy(() => import("@/views/produccion/planes_semanales/IndexPlanSemanalProduccion")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics', 'adminprod', 'adminbodega', 'auxbodega', 'exportuser', 'costosuser', 'adminagricola', 'pcalidad', 'gerencia', 'admincalidad'] },

  { path: "/planes-produccion/:plan_id", component: lazy(() => import("@/views/produccion/planes_semanales/ShowPlanSemanalProduccion")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics', 'adminprod', 'adminbodega', 'adminagricola', 'pcalidad', 'gerencia', 'admincalidad'] },
  { path: "/planes-produccion/calendario/:plan_id", component: lazy(() => import("@/views/produccion/planes_semanales/PlanificacionTareasProduccion")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'auxbodega', 'exportuser', 'costosuser', 'adminagricola', 'pcalidad', 'gerencia', 'auxrrhh', 'admincalidad'] },
  { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("@/views/produccion/planes_semanales/ShowLineaDetalles")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'gerencia'] },
  { path: "/planes-produccion/asignacion/:plan_id/:linea_id/:task_p_id", component: lazy(() => import("@/views/produccion/planes_semanales/AsignarEmpleadosTareaProduccion")), roles: ['admin', 'audiproceso'] },
  { path: "/planes-produccion/informacion/:task_p_id", component: lazy(() => import("@/views/produccion/planes_semanales/TaskProductionPlanDetails")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'costosuser', 'adminagricola', 'exportuser', 'gerencia', 'auxrrhh'] },
  { path: "/planes-produccion/tarea-produccion/:task_p_id", component: lazy(() => import("@/views/produccion/planes_semanales/FinishedTaskProductionDetails")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'costosuser', 'adminagricola', 'exportuser', 'gerencia', 'auxrrhh','auxbodega'] },

  { path: "/skus", component: lazy(() => import("@/views/produccion/sku/IndexSKU")), roles: ['admin', 'pcostos'] },
  { path: "/skus/:id", component: lazy(() => import("@/views/produccion/sku/ShowSku")), roles: ['admin', 'pcostos'] },
  { path: "/skus/crear", component: lazy(() => import("@/views/produccion/sku/CreateSKU")), roles: ['admin', 'pcostos'] },

  { path: "/lineas", component: lazy(() => import("@/views/produccion/lineas/IndexLines")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/posiciones/:id", component: lazy(() => import("@/views/produccion/lineas/PosicionesLinea")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/crear", component: lazy(() => import("@/views/produccion/lineas/CrearLinea")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("@/views/produccion/lineas/EditarLinea")), roles: ['admin', 'pcostos'] },

  { path: "/lineas-skus", component: lazy(() => import("@/views/produccion/lineas_skus/IndexLineasSku")), roles: ['admin', 'pcostos'] },
  { path: "/lineas-skus/crear", component: lazy(() => import("@/views/produccion/lineas_skus/CrearLineaSku")), roles: ['admin', 'pcostos'] },

  { path: "/tiempos-muertos", component: lazy(() => import("@/views/produccion/tiempos_muertos/IndexTiemposMuertos")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/crear", component: lazy(() => import("@/views/produccion/tiempos_muertos/CrearTiempoMuerto")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/editar/:id", component: lazy(() => import("@/views/produccion/tiempos_muertos/EditarTiempoMuerto")), roles: ['admin', 'pcostos'] },

  { path: "/graficas-diarias", component: lazy(() => import("@/views/produccion/graficasDiarias/IndexDailyGraphs")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola'] },

  { path: "/planificador-produccion", component: lazy(() => import("@/views/produccion/planificador/Index")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola'] },
  { path: "/planificador-produccion/:id", component: lazy(() => import("@/views/produccion/planificador/ShowPlanification")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola'] },

  { path: "/materia-prima", component: lazy(() => import("@/views/produccion/materia_prima/IndexMateriaPrima")), roles: ['admin'] },
  { path: "/materia-prima/crear", component: lazy(() => import("@/views/produccion/materia_prima/CreateMateriaPrima")), roles: ['admin'] },
  { path: "/materia-prima/:id/editar", component: lazy(() => import("@/views/produccion/materia_prima/EditMateriaPrima")), roles: ['admin'] },
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
