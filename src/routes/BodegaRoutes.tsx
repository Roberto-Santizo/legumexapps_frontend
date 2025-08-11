import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Spinner from "../components/utilities-components/Spinner";
import ProtectedRoutes from "../components/middlewares/ProtectedRoutes";

const routes = [
  { path: "/form/entrega-material", component: lazy(() => import("@/views/bodega/formularios/MaterialEmpaqueSalida")), roles: ['admin','adminbodega','auxbodega'] },

  { path: "/material-empaque", component: lazy(() => import("@/views/bodega/material-empaque/IndexPackingMaterialItems")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque/crear", component: lazy(() => import("@/views/bodega/material-empaque/CrearRegistroMaterial")), roles: ['admin','adminbodega','auxbodega'] },


  { path: "/recepciones-mp", component: lazy(() => import("@/views/bodega/recepcion-material-empaque/IndexRecepcionMaterial")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/recepciones-mp/crear", component: lazy(() => import("@/views/bodega/recepcion-material-empaque/CrearRecepcionMaterial")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/recepciones-mp/:id", component: lazy(() => import("@/views/bodega/recepcion-material-empaque/ShowReceptionPackingMaterial")), roles: ['admin','adminbodega','auxbodega'] },

  { path: "/recepciones-insumos", component: lazy(() => import("@/views/bodega/recepcion-insumos/IndexRecepcionInsumos")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/recepciones-insumos/crear", component: lazy(() => import("@/views/bodega/recepcion-insumos/CrearRecepcionInsumos")), roles: ['admin','adminbodega','auxbodega'] },

  { path: "/proveedores", component: lazy(() => import("@/views/bodega/proveedores/IndexProveedores")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/proveedores/crear", component: lazy(() => import("@/views/bodega/proveedores/CrearProveedor")), roles: ['admin','adminbodega','auxbodega'] },

  { path: "/material-empaque-transacciones", component: lazy(() => import("@/views/bodega/transacciones-matrial-empaque/IndexPackingMaterialTransaction")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque-transacciones/crear", component: lazy(() => import("@/views/bodega/transacciones-matrial-empaque/CreatePackingMaterialTransaction")), roles: ['admin','adminbodega','auxbodega'] },
  { path: "/material-empaque-transacciones/:id", component: lazy(() => import("@/views/bodega/transacciones-matrial-empaque/PackingMaterialTransactionDetails")), roles: ['admin','adminbodega','auxbodega'] }
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
