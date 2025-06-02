import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserRole } from "@/api/UserAPI";
import SummaryTasksFincas from "@/components/dashboard-agricola/SummaryTasksFincas";
import DronHours from "@/components/dashboard-agricola/DronHours";
import SummaryHoursEmployees from "@/components/dashboard-agricola/SummaryHoursEmployees";
import TasksInProgress from "@/components/dashboard-agricola/TasksInProgress";
import FinishedTasks from "@/components/dashboard-agricola/FinishedTasks";
import TasksCropInProgress from "@/components/dashboard-agricola/TasksCropInProgress";
import FinishedTasksCrop from "@/components/dashboard-agricola/FinishedTasksCrop";
import Spinner from "../utilities-components/Spinner";

export default function AgricolaDashboard() {
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['getUserRole'],
    queryFn: getUserRole
  });

  if (isError) navigate('/login');
  if (isLoading) return <Spinner />
  if (role) return (
    <div>
      <h1 className="text-5xl font-bold mb-10">Dashboard Agricola</h1>

      <div className="mt-10 grid grid-cols-12 gap-5">
        {['admin', 'adminagricola'].includes(role) && (
          <>
            <SummaryTasksFincas />
            <SummaryHoursEmployees />
          </>
        )}

        <DronHours />
        <TasksInProgress />
        <FinishedTasks />
        <TasksCropInProgress />
        <FinishedTasksCrop />
      </div>
    </div>
  );
}
