import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/planes-produccion", component: lazy(() => import("../views/produccion/planes_semanales/IndexPlanSemanalProduccion")), roles: ['admin'] },
  { path: "/planes-produccion/crear", component: lazy(() => import("../views/produccion/planes_semanales/CreatePlanSemanal")), roles: ['admin'] },

  { path: "/planes-produccion/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowPlanSemanalProduccion")), roles: ['admin'] },
  { path: "/planes-produccion/:plan_id/:linea_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowLineaDetalles")), roles: ['admin'] },
  { path: "/planes-produccion/:plan_id/:linea_id/:task_p_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowTaskProductionDetails")), roles: ['admin'] },

  { path: "/skus", component: lazy(() => import("../views/produccion/sku/IndexSKU")), roles: ['admin'] },
  { path: "/skus/crear", component: lazy(() => import("../views/produccion/sku/CreateSKU")), roles: ['admin'] },
  // { path: "/skus/ModalSku", component: lazy(() => import("../views/produccion/sku/ModalSku")), roles: ['admin'] },

  { path: "/lineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin'] },
  { path: "/lineas/crear", component: lazy(() => import("../views/produccion/lineas/CrearLinea")), roles: ['admin'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin'] },
  { path: "/lineas/editar/:id", component: lazy(() => import("../views/produccion/lineas/EditarLinea")), roles: ['admin'] },

  { path: "/tareas/TaskPeople/:id", component: lazy(() => import("../views/produccion/Tareas/TaskPeople")), roles: ['admin'] },
  
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
