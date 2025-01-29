import { Navigate, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Login from "../views/auth/Login";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" />} index />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </>
  );
}
