import DronHours from "@/components/dashboard-agricola-components/DronHours";
import SummaryHoursEmployees from "@/components/dashboard-agricola-components/SummaryHoursEmployees";
import TasksInProgress from "@/components/dashboard-agricola-components/TasksInProgress";
import FinishedTasks from "@/components/dashboard-agricola-components/FinishedTasks";
import TasksCropInProgress from "@/components/dashboard-agricola-components/TasksCropInProgress";
import FinishedTasksCrop from "@/components/dashboard-agricola-components/FinishedTasksCrop";
import { useAppStore } from "@/stores/useAppStore";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import SummaryTasksFincas from "@/components/dashboard-agricola-components/SummaryTasksFincas";
import { useQuery } from "@tanstack/react-query";

export default function AgricolaDashboard() {
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const { data: role, isLoading, isError } = useQuery<string>({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRoleByToken
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
