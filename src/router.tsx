import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import IndexPublic from "./views/IndexPublic";
import Login from "./views/auth/Login";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path='/' element={
                        <IndexPublic />
                    } index />
                </Route>

                <Route element={<PublicLayout />}>
                    <Route path='/login' element={
                        <Login />
                    }/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
