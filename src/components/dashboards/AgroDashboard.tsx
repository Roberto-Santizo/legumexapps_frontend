import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import Spinner from "../utilities-components/Spinner";

export default function AgroDashboard() {
    const navigate = useNavigate();
    const { data: role, isLoading, isError } = useRole();

    if (isError) navigate('/login');
    if (isLoading) return <Spinner />
    if (role) return (
        <div>
            <h1 className="text-xl xl:text-5xl font-bold mb-10 text-center xl:text-left">Dashboard Agronomo</h1>
        </div>

    );
}
