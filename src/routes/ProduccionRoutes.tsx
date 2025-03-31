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
  { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowLineaDetalles")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion/asignacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/AsignarEmpleadosTareaProduccion")), roles: ['admin','audiproceso'] },
  { path: "/planes-produccion/informacion/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/TaskProductionPlanDetails")), roles: ['admin','audiproceso'] },

  { path: "/skus", component: lazy(() => import("../views/produccion/sku/IndexSKU")), roles: ['admin','audiproceso'] },
  { path: "/skus/crear", component: lazy(() => import("../views/produccion/sku/CreateSKU")), roles: ['admin','audiproceso'] },
  
  { path: "/productos-sku", component: lazy(() => import("../views/produccion/productos/IndexProductosSku")), roles: ['admin'] },
  { path: "/productos-sku/crear", component: lazy(() => import("../views/produccion/productos/CrearProductoSku")), roles: ['admin'] },
  
  { path: "/clientes", component: lazy(() => import("../views/produccion/clientes/IndexClientes")), roles: ['admin'] },
  { path: "/clientes/crear", component: lazy(() => import("../views/produccion/clientes/CrearCliente")), roles: ['admin'] },
  
  { path: "/lineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin','audiproceso'] },
  { path: "/lineas/crear", component: lazy(() => import("../views/produccion/lineas/CrearLinea")), roles: ['admin','audiproceso'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin','audiproceso'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin','audiproceso'] },
  
  { path: "/lineas-skus", component: lazy(() => import("../views/produccion/lineas_skus/IndexLineasSku")), roles: ['admin'] },
  { path: "/lineas-skus/crear", component: lazy(() => import("../views/produccion/lineas_skus/CrearLineaSku")), roles: ['admin'] },
  
  { path: "/tiempos-muertos", component: lazy(() => import("../views/produccion/tiempos_muertos/IndexTiemposMuertos")), roles: ['admin','audiproceso'] },
  { path: "/tiempos-muertos/crear", component: lazy(() => import("../views/produccion/tiempos_muertos/CrearTiempoMuerto")), roles: ['admin','audiproceso'] },
  { path: "/tiempos-muertos/editar/:id", component: lazy(() => import("../views/produccion/tiempos_muertos/EditarTiempoMuerto")), roles: ['admin','audiproceso'] },


  { path: "/graficas-diarias", component: lazy(() => import("../views/produccion/graficasDiarias/DailyGraphs")), roles: ['admin','audiproceso'] },


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
