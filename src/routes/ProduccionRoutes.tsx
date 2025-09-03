import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/planes-produccion/crear", component: lazy(() => import("@/views/produccion/plans/Create")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega'] },
  { path: "/planes-produccion", component: lazy(() => import("@/views/produccion/plans/Index")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics', 'adminprod', 'adminbodega', 'auxbodega', 'exportuser', 'costosuser', 'adminagricola', 'pcalidad', 'gerencia', 'admincalidad', 'auxcalidad'] },

  { path: "/planes-produccion/:plan_id", component: lazy(() => import("@/views/produccion/plans/Show")), roles: ['admin', 'audiproceso', 'auxrrhh', 'logistics', 'adminprod', 'adminbodega', 'adminagricola', 'pcalidad', 'gerencia', 'admincalidad', 'auxcalidad'] },
  { path: "/planes-produccion/calendario/:plan_id", component: lazy(() => import("@/views/produccion/plans/Calendar")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'auxbodega', 'exportuser', 'costosuser', 'adminagricola', 'pcalidad', 'gerencia', 'auxrrhh', 'admincalidad', 'auxcalidad'] },
  { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("@/views/produccion/plans/ShowLineaDetalles")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'gerencia'] },
  { path: "/planes-produccion/asignacion/:plan_id/:linea_id/:task_p_id", component: lazy(() => import("@/views/produccion/plans/AsignarEmpleadosTareaProduccion")), roles: ['admin', 'audiproceso'] },
  { path: "/planes-produccion/informacion/:task_p_id", component: lazy(() => import("@/views/produccion/production-tasks/Details")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'costosuser', 'adminagricola', 'exportuser', 'gerencia', 'auxrrhh'] },
  { path: "/planes-produccion/tarea-produccion/:task_p_id", component: lazy(() => import("@/views/produccion/production-tasks/Show")), roles: ['admin', 'audiproceso', 'logistics', 'adminprod', 'adminbodega', 'costosuser', 'adminagricola', 'exportuser', 'gerencia', 'auxrrhh', 'auxbodega'] },

  { path: "/skus", component: lazy(() => import("@/views/produccion/stock-keeping-units/Index")), roles: ['admin', 'pcostos'] },
  { path: "/skus/:id", component: lazy(() => import("@/views/produccion/stock-keeping-units/Show")), roles: ['admin', 'pcostos'] },
  { path: "/skus/crear", component: lazy(() => import("@/views/produccion/stock-keeping-units/Create")), roles: ['admin', 'pcostos'] },

  { path: "/lineas", component: lazy(() => import("@/views/produccion/lines/Index")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/posiciones/:id", component: lazy(() => import("@/views/produccion/lines/Show")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/crear", component: lazy(() => import("@/views/produccion/lines/Create")), roles: ['admin', 'pcostos'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("@/views/produccion/lines/Edit")), roles: ['admin', 'pcostos'] },

  { path: "/lineas-skus", component: lazy(() => import("@/views/produccion/lines-performances/Index")), roles: ['admin', 'pcostos'] },
  { path: "/lineas-skus/crear", component: lazy(() => import("@/views/produccion/lines-performances/Create")), roles: ['admin', 'pcostos'] },

  { path: "/tiempos-muertos", component: lazy(() => import("@/views/produccion/timeouts/Index")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/crear", component: lazy(() => import("@/views/produccion/timeouts/Create")), roles: ['admin', 'pcostos'] },
  { path: "/tiempos-muertos/editar/:id", component: lazy(() => import("@/views/produccion/timeouts/Edit")), roles: ['admin', 'pcostos'] },

  { path: "/graficas-diarias", component: lazy(() => import("@/views/produccion/daily-charts/Index")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola'] },

  { path: "/planificador-produccion", component: lazy(() => import("@/views/produccion/production-planner/Index")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola', 'adminbodega'] },
  { path: "/planificador-produccion/:id", component: lazy(() => import("@/views/produccion/production-planner/Show")), roles: ['admin', 'logistics', 'adminprod', 'audiproceso', 'gerencia', 'costosuser', 'adminagricola', 'adminbodega'] },

  { path: "/materia-prima", component: lazy(() => import("@/views/produccion/raw_material/Index")), roles: ['admin'] },
  { path: "/materia-prima/crear", component: lazy(() => import("@/views/produccion/raw_material/Create")), roles: ['admin'] },
  { path: "/materia-prima/:id/editar", component: lazy(() => import("@/views/produccion/raw_material/Edit")), roles: ['admin'] },
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
