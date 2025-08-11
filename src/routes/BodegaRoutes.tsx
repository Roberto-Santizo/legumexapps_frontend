import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/material-empaque", component: lazy(() => import("@/views/bodega/packing-material-item/Index")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque/crear", component: lazy(() => import("@/views/bodega/packing-material-item/Create")), roles: ['admin','adminbodega','auxbodega'] },

  { path: "/material-empaque-transacciones", component: lazy(() => import("@/views/bodega/transactions/Index")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque-transacciones/crear", component: lazy(() => import("@/views/bodega/transactions/Create")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque-transacciones/:id", component: lazy(() => import("@/views/bodega/transactions/Show")), roles: ['admin','adminbodega','auxbodega'] }
];

export default function BodegaRoutes() {
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
