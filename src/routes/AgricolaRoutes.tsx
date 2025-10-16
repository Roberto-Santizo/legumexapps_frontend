import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/planes-semanales", component: lazy(() => import("@/views/agricola/plans/Index")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya', 'auxrrhh'] },
  { path: "/planes-semanales/crear", component: lazy(() => import("@/views/agricola/plans/Create")), roles: ['admin', 'adminagricola'] },
  { path: "/planes-semanales/:finca/:id", component: lazy(() => import("@/views/agricola/plans/Show")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/planificacion-tareas/:plan_id/:finca_id", component: lazy(() => import("@/views/agricola/plans/Calendar")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },

  { path: "/tareas", component: lazy(() => import("@/views/agricola/tasks/Index")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/crear", component: lazy(() => import("@/views/agricola/tasks/Create")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/carga-masiva", component: lazy(() => import("@/views/agricola/tasks/Upload")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/edit/:id", component: lazy(() => import("@/views/agricola/tasks/Edit")), roles: ['admin', 'adminagricola'] },

  { path: "/cdps", component: lazy(() => import("@/views/agricola/cdps/Index")), roles: ['admin', 'adminagricola'] },
  { path: "/cdps/crear", component: lazy(() => import("@/views/agricola/cdps/Create")), roles: ['admin', 'adminagricola'] },
  { path: "/cdps/carga-masiva", component: lazy(() => import("@/views/agricola/cdps/Upload")), roles: ['admin', 'adminagricola'] },


  { path: "/lotes", component: lazy(() => import("@/views/agricola/lotes/Index")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/crear", component: lazy(() => import("@/views/agricola/lotes/Create")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/consulta", component: lazy(() => import("@/views/agricola/lotes/Details")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/actualizacion", component: lazy(() => import("@/views/agricola/lotes/Update")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/historial/:lote_id", component: lazy(() => import("@/views/agricola/lotes/History")), roles: ['admin', 'adminagricola'] },

  { path: "/planes-semanales/tareas-lote/:weekly_plan_id/:lote_plantation_control_id", component: lazy(() => import("@/views/agricola/lote-tasks/Index")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/asignar/:finca_id/:task_id", component: lazy(() => import("@/views/agricola/lote-tasks/Assign")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/informacion/:id", component: lazy(() => import("@/views/agricola/lote-tasks/Details")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/editar/:id", component: lazy(() => import("@/views/agricola/lote-tasks/Edit")), roles: ['admin', 'adminagricola'] },
  { path: "/planes-semanales/tareas-lote/crear", component: lazy(() => import("@/views/agricola/lote-tasks/Create")), roles: ['admin', 'adminagricola'] },

  { path: "/planes-semanales/tareas-cosecha-lote/:weekly_plan_id/:lote_plantation_control_id", component: lazy(() => import("@/views/agricola/harvest-tasks/Index")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/asignar/:task_crop_id/:finca_id", component: lazy(() => import("@/views/agricola/harvest-tasks/Assign")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/toma-rendimiento/:task_crop_id", component: lazy(() => import("@/views/agricola/harvest-tasks/PersonalPerformance")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/resumen/:task_crop_id", component: lazy(() => import("@/views/agricola/harvest-tasks/Details")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/informacion/:task_crop_id", component: lazy(() => import("@/views/agricola/harvest-tasks/Show")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },

  { path: "/insumos", component: lazy(() => import("@/views/agricola/supplies/Index")), roles: ['admin', 'adminagricola'] },
  { path: "/insumos/crear", component: lazy(() => import("@/views/agricola/supplies/Create")), roles: ['admin', 'adminagricola'] },
  { path: "/insumos/carga-masiva", component: lazy(() => import("@/views/agricola/supplies/Upload")), roles: ['admin', 'adminagricola'] },

  { path: "/planificador-fincas", component: lazy(() => import("@/views/agricola/planner/views/Index")), roles: ['admin'] },
  { path: "/planificador-fincas/:id", component: lazy(() => import("@/views/agricola/planner/views/Show")), roles: ['admin'] },

  { path: "/maestro-tareas-fincas", component: lazy(() => import("@/views/agricola/tasks-master/views/Index")), roles: ['admin'] },
  { path: "/maestro-tareas-fincas/recetas", component: lazy(() => import("@/views/agricola/tasks-master/views/Recipes")), roles: ['admin'] },
  { path: "/maestro-tareas-fincas/recetas/crear", component: lazy(() => import("@/views/agricola/tasks-master/views/CreateRecipe")), roles: ['admin'] },
  { path: "/maestro-tareas-fincas/cultivos", component: lazy(() => import("@/views/agricola/tasks-master/views/Crops")), roles: ['admin'] },
  { path: "/maestro-tareas-fincas/cultivos/crear", component: lazy(() => import("@/views/agricola/tasks-master/views/CreateCrop")), roles: ['admin'] },
];

export default function AgricolaRoutes() {
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
