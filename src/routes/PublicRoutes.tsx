import { Navigate, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import NotFound from "@/views/NotFound";
import Login from "@/views/auth/views/Login";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" />} index />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  );
}
