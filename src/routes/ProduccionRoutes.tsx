import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/plan-semana-produccion", component: lazy(() => import("../views/produccion/planes_semanales/IndexPlanSemanalProduccion")), roles: ['admin'] },
  { path: "/plan-semana-produccion/crear", component: lazy(() => import("../views/produccion/planes_semanales/CreatePlanSemanal")), roles: ['admin'] },

  { path: "/plan-semana-produccion/:plan_id", component: lazy(() => import("../views/produccion/planes_semanales/ShowPlanSemanalProduccion")), roles: ['admin'] },

  { path: "/sku/createSKU", component: lazy(() => import("../views/produccion/sku/CreateSKU")), roles: ['admin'] },
  { path: "/sku/IndexSKU", component: lazy(() => import("../views/produccion/sku/IndexSKU")), roles: ['admin'] },
  { path: "/sku/ModalSku", component: lazy(() => import("../views/produccion/sku/ModalSku")), roles: ['admin'] },

  { path: "/lineas/CrearLinea", component: lazy(() => import("../views/produccion/lineas/CrearLinea")), roles: ['admin'] },
  { path: "/lineas/IndexLineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin'] },
  { path: "/lineas/EditarLineas", component: lazy(() => import("../views/produccion/lineas/IndexLineas")), roles: ['admin'] },


  { path: "/tareas/TaskPeople", component: lazy(() => import("../views/produccion/Tareas/TaskPeople")), roles: ['admin'] },
  
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
