import { Route } from "react-router-dom";
import AdminDashboard from "../views/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import IndexUsers from "../views/admin/users/IndexUsers";

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminLayout />}>
        <Route path="/dashboard/administracion" element={<AdminDashboard />} index />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/administracion/usuarios" element={<IndexUsers />} index />
      </Route>
    </>
  )
}
