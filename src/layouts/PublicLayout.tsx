import { Outlet } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

export default function Layout() {
  return (
    <>
      <PublicHeader />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  )
}
