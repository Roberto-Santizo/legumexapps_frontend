import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "@/components/utilities-components/Spinner";
import ProtectedAgricolaRoutes from "@/components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/planes-semanales", component: lazy(() => import("@/views/agricola/planes-semanales/IndexPlanSemanal")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya', 'auxrrhh'] },
  { path: "/planes-semanales/crear", component: lazy(() => import("@/views/agricola/planes-semanales/CreatePlanSemanal")), roles: ['admin', 'adminagricola'] },
  { path: "/planes-semanales/:finca/:id", component: lazy(() => import("@/views/agricola/planes-semanales/ShowPlanSemanal")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },

  { path: "/planificacion-finca", component: lazy(() => import("@/views/agricola/planes-semanales/PlanificacionPlanSemanal")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },

  { path: "/tareas", component: lazy(() => import("@/views/agricola/tareas/IndexTareas")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/crear", component: lazy(() => import("@/views/agricola/tareas/CreateTarea")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/carga-masiva", component: lazy(() => import("@/views/agricola/tareas/CargaMasivaTareas")), roles: ['admin', 'adminagricola'] },
  { path: "/tareas/edit/:id", component: lazy(() => import("@/views/agricola/tareas/EditTarea")), roles: ['admin', 'adminagricola'] },

  { path: "/cdps", component: lazy(() => import("@/views/agricola/cdps/IndexCdps")), roles: ['admin', 'adminagricola'] },
  { path: "/cdps/crear", component: lazy(() => import("@/views/agricola/cdps/CreateCdp")), roles: ['admin', 'adminagricola'] },
  { path: "/cdps/carga-masiva", component: lazy(() => import("@/views/agricola/cdps/CargaMasivaCDPs")), roles: ['admin', 'adminagricola'] },


  { path: "/lotes", component: lazy(() => import("@/views/agricola/lotes/IndexLotes")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/crear", component: lazy(() => import("@/views/agricola/lotes/CreateLote")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/consulta", component: lazy(() => import("@/views/agricola/lotes/ConsultaLote")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/actualizacion", component: lazy(() => import("@/views/agricola/lotes/ActualizacionMasiva")), roles: ['admin', 'adminagricola'] },
  { path: "/lotes/historial/:lote_id", component: lazy(() => import("@/views/agricola/lotes/HistorialLote")), roles: ['admin', 'adminagricola'] },

  { path: "/planes-semanales/tareas-lote/:weekly_plan_id/:lote_plantation_control_id", component: lazy(() => import("@/views/agricola/tareas-lote/IndexTareasLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/asignar/:finca_id/:task_id", component: lazy(() => import("@/views/agricola/tareas-lote/AsignarTareaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/informacion/:id", component: lazy(() => import("@/views/agricola/tareas-lote/InfoTareaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-lote/editar/:id", component: lazy(() => import("@/views/agricola/tareas-lote/EditarTareaLote")), roles: ['admin', 'adminagricola'] },
  { path: "/planes-semanales/tareas-lote/crear", component: lazy(() => import("@/views/agricola/planes-semanales/CreateTaskWeeklyPlan")), roles: ['admin', 'adminagricola'] },

  { path: "/planes-semanales/tareas-cosecha-lote/:weekly_plan_id/:lote_plantation_control_id", component: lazy(() => import("@/views/agricola/tareas-cosecha/IndexTareasCosechaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/asignar/:task_crop_id/:finca_id", component: lazy(() => import("@/views/agricola/tareas-cosecha/AsignarTareaCosechaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/toma-rendimiento/:task_crop_id", component: lazy(() => import("@/views/agricola/tareas-cosecha/TomarLibrasPersonal")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/resumen/:task_crop_id", component: lazy(() => import("@/views/agricola/tareas-cosecha/ResumenTareaCosechaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },
  { path: "/planes-semanales/tareas-cosecha-lote/informacion/:task_crop_id", component: lazy(() => import("@/views/agricola/tareas-cosecha/InformacionTareaCosechaLote")), roles: ['admin', 'adminagricola', 'alameda', 'linda', 'tehuya'] },

  { path: "/insumos", component: lazy(() => import("@/views/agricola/insumos/IndexInsumos")), roles: ['admin', 'adminagricola'] },
  { path: "/insumos/crear", component: lazy(() => import("@/views/agricola/insumos/CrearInsumo")), roles: ['admin', 'adminagricola'] },
  { path: "/insumos/carga-masiva", component: lazy(() => import("@/views/agricola/insumos/CargaMasivaInsumos")), roles: ['admin', 'adminagricola'] },
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
