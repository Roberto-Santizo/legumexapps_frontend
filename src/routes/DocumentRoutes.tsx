import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedAgricolaRoutes from "../components/middlewares/ProtectedRoutes";
import DocumentLayout from "../layouts/DocumentLayout";

const routes = [
  { path: "/recepciones-insumos/:id", component: lazy(() => import("@/views/bodega/recepcion-insumos/ShowReceptionInsumosDetails")), roles: ['admin'] },
  { path: "/recepciones-material-empaque/:id", component: lazy(() => import("@/views/bodega/recepcion-material-empaque/ShowReceptionPackingMaterial")), roles: ['admin'] },

];

export default function DocumentRoutes() {
  return (
    <Route element={<DocumentLayout />}>
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
