import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";
import ProtectedRoute from "../components/ProtectedRoutes";

//PLANES SEMANALES
const IndexPlanSemanal = lazy(() => import("../views/agricola/planes-semanales/IndexPlanSemanal"));

//TAREAS
const IndexTareas = lazy(() => import("../views/agricola/tareas/IndexTareas"));
const CreateTarea = lazy(() => import("../views/agricola/tareas/CreateTarea"));
const EditTarea = lazy(() => import("../views/agricola/tareas/EditTarea"));

//CDPS
const IndexCdps = lazy(() => import("../views/agricola/cdps/IndexCdps"));
const CreateCdp = lazy(() => import("../views/agricola/cdps/CreateCdp"));

//LOTES
const IndexLotes = lazy(() => import("../views/agricola/lotes/IndexLotes"));

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
    </>
  );
}
