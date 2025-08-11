import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AgricolaRoutes from "./routes/AgricolaRoutes";
import CalidadRoutes from "./routes/CalidadRoutes";
import ProduccionRoutes from "./routes/ProduccionRoutes";
import RecursosRoutes from "./routes/RecursosRoutes";
import BodegaRoutes from "./routes/BodegaRoutes"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {PublicRoutes()}
                {AdminRoutes()}
                {AgricolaRoutes()}
                {CalidadRoutes()}
                {ProduccionRoutes()}
                {RecursosRoutes()}
                {BodegaRoutes()}
            </Routes>
        </BrowserRouter>
    )
}
