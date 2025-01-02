import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {PublicRoutes()}
                {AdminRoutes()}
            </Routes>
        </BrowserRouter>
    )
}
