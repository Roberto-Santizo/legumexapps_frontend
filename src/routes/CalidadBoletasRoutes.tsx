import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Spinner from "../components/Spinner";
import ProtectedAgricolaRoutes from "../components/ProtectedAgricolaRoutes";

const routes = [
  { path: "/boletas/calidad", component: lazy(() => import("../views/calidad/boletas/BoletasCalidad")), roles: ['admin','pprod','pcampo','pcalidad'] },

  { path: "/boletas/campo", component: lazy(() => import("../views/calidad/boletas/BoletaCampoRMP")), roles: ['admin','pprod','pcampo','pcalidad'] },

];

export default function CalidadBoletasRoutes() {
  return (
    <>
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
    </>
  );
}
