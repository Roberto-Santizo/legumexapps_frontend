import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/Spinner";

//PLANES SEMANALES
const IndexPlanSemanal = lazy(() => import("../views/agricola/planes-semanales/IndexPlanSemanal"));

//TAREAS
const IndexTareas = lazy(() => import("../views/agricola/tareas/IndexTareas"));
const CreateTarea = lazy(() => import("../views/agricola/tareas/CreateTarea"));
const EditTarea = lazy(() => import("../views/agricola/tareas/EditTarea"));

export default function AgricolaRoutes() {
  return (
    <>
      <Route element={<Layout />}>
        <Route path="/planes-semanales" element={
            <Suspense fallback={<Spinner />}>
                <IndexPlanSemanal />
            </Suspense>
        } index />
      </Route>

      <Route element={<Layout />}>
        <Route path="/tareas" element={
            <Suspense fallback={<Spinner />}>
                <IndexTareas />
            </Suspense>
        } index />
      </Route>

      <Route element={<Layout />}>
        <Route path="/tareas/crear" element={
            <Suspense fallback={<Spinner />}>
                <CreateTarea />
            </Suspense>
        } index />
      </Route>

      <Route element={<Layout />}>
        <Route path="/tareas/edit/:id" element={
            <Suspense fallback={<Spinner />}>
                <EditTarea />
            </Suspense>
        } index />
      </Route>
    </>
  );
}
