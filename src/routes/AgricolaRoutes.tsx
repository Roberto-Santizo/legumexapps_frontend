import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

//PLANES SEMANALES
const IndexPlanSemanal = lazy(
  () => import("../views/agricola/planes-semanales/IndexPlanSemanal")
);

const CreatePlanSemanal  = lazy(() => import( "../views/agricola/planes-semanales/CreatePlanSemanal"));
const ShowPlanSemanal = lazy(() => import( "../views/agricola/planes-semanales/ShowPlanSemanal"));

//TAREAS
const IndexTareas = lazy(() => import("../views/agricola/tareas/IndexTareas"));
const CreateTarea = lazy(() => import("../views/agricola/tareas/CreateTarea"));
const EditTarea = lazy(() => import("../views/agricola/tareas/EditTarea"));

//CDPS
const IndexCdps = lazy(() => import("../views/agricola/cdps/IndexCdps"));
const CreateCdp = lazy(() => import("../views/agricola/cdps/CreateCdp"));

//LOTES
const IndexLotes = lazy(() => import("../views/agricola/lotes/IndexLotes"));
const CreateLote = lazy(() => import("../views/agricola/lotes/CreateLote"));

//TAREAS LOTE
const IndexTareasLote = lazy(() => import( "../views/agricola/tareas-lote/IndexTareasLote"));
const AsignarTareaLote  = lazy(() => import("../views/agricola/tareas-lote/AsignarTareaLote"));
const InfoTareaLote  = lazy(() => import( "../views/agricola/tareas-lote/InfoTareaLote"));
const EditarTareaLote = lazy(() => import( "../views/agricola/tareas-lote/EditarTareaLote"));

//TAREAS COSECHA LOTE
const IndexTareasCosechaLote = lazy(() => import("../views/agricola/tareas-cosecha/IndexTareasCosechaLote"));


export default function AgricolaRoutes() {
  return (
    <>
      <Route element={<Layout />}>
        <Route
          path="/planes-semanales"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexPlanSemanal />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/crear"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <CreatePlanSemanal />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/:finca/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <ShowPlanSemanal />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/tareas"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexTareas />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/tareas/crear"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <CreateTarea />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/tareas/edit/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <EditTarea />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      {/* RUTAS DE CPS */}
      <Route element={<Layout />}>
        <Route
          path="/cdps"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexCdps />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/cdps/crear"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <CreateCdp />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      {/* RUTAS DE LOTES */}

      <Route element={<Layout />}>
        <Route
          path="/lotes"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexLotes />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/lotes/crear"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <CreateLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      {/* TAREAS LOTE */}
      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/tareas-lote/:weekly_plan_id/:lote_plantation_control_id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexTareasLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/tareas-lote/asignar/:finca_id/:task_id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <AsignarTareaLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/tareas-lote/informacion/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <InfoTareaLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/tareas-lote/editar/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <EditarTareaLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>

      {/* TAREAS COSECHA LOTE */}
      <Route element={<Layout />}>
        <Route
          path="/planes-semanales/tareas-cosecha-lote/:weekly_plan_id/:lote_plantation_control_id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedAgricolaRoutes>
                <IndexTareasCosechaLote />
              </ProtectedAgricolaRoutes>
            </Suspense>
          }
          index
        />
      </Route>
    </>
  );
}
