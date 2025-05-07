import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedAgricolaRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/boleta-empaque/salida", component: lazy(() => import("@/components/boleta-bodega/ComponentePrincipalBoletas")), roles: ['admin'] },

  { path: "/form/entrega-material", component: lazy(() => import("@/views/bodega/formularios/MaterialEmpaqueSalida")), roles: ['admin'] },//Este es el formulario para registrar las entregas de material de empaque
  
  { path: "/material-empaque", component: lazy(() => import("@/views/bodega/index/IndexRegistro-MaterialEmpaque")), roles: ['admin'] },
  { path: "/material-empaque/registro", component: lazy(() => import("@/views/bodega/formularios/CrearRegistroMaterial")), roles: ['admin'] },

  { path: "/form/material-empaque", component: lazy(() => import("@/views/bodega/index/IndexRecepcionMaterial")), roles: ['admin'] },
  { path: "/form/material-empaque/ingreso", component: lazy(() => import("@/views/bodega/formularios/CrearRecepcionMaterial")), roles: ['admin'] },

  { path: "/form/insumos", component: lazy(() => import("@/views/bodega/index/IndexInsumos")), roles: ['admin'] },
  { path: "/form/insumos/crear", component: lazy(() => import("@/views/bodega/formularios/CrearInsumo")), roles: ['admin'] },

  { path: "/proveedor", component: lazy(() => import("@/views/bodega/index/IndexProveedores")), roles: ['admin'] },
  { path: "/proveedor/ingreso", component: lazy(() => import("@/views/bodega/formularios/CrearProveedor")), roles: ['admin'] },
  { path: "/proveedor/editar/:id", component: lazy(() => import("@/views/bodega/editar/EditarProveedores")), roles: ['admin'] },

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
