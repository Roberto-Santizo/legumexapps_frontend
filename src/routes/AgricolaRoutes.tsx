import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedRoute from "../components/ProtectedRoutes";
import CreatePlanSemanal from "../views/agricola/planes-semanales/CreatePlanSemanal";
import ShowPlanSemanal from "../views/agricola/planes-semanales/ShowPlanSemanal";
import IndexTareasLote from "../views/agricola/tareas-lote/IndexTareasLote";

//PLANES SEMANALES
const IndexPlanSemanal = lazy(
  () => import("../views/agricola/planes-semanales/IndexPlanSemanal")
);

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
export default function AgricolaRoutes() {
  return (
    <>
      <Route element={<Layout />}>
        <Route
          path="/planes-semanales"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <IndexPlanSemanal />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <CreatePlanSemanal />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <ShowPlanSemanal />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <IndexTareas />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <CreateTarea />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <EditTarea />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <IndexCdps />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <CreateCdp />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <IndexLotes />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <CreateLote />
              </ProtectedRoute>
            </Suspense>
          }
          index
        />
      </Route>

      {/* TAREAS LOTE */}
      <Route element={<Layout />}>
        <Route
          path="/tareas-lote/:lote/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoute>
                <IndexTareasLote />
              </ProtectedRoute>
            </Suspense>
          }
          index
        />
      </Route>
    </>
  );
}
