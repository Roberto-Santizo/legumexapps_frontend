import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import Spinner from "../utilities-components/Spinner";
import TasksControl from '@/components/dashboard-production/TasksControl';
import TasksInProgress from '@/components/dashboard-production/TasksInProgress';
import DownTimeReport from '@/components/dashboard-production/DownTimeReport';
import CompletedTasksProduction from '@/components/dashboard-production/CompletedTasksProduction';


export default function ProductionDashboard() {
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useRole();

  if (isError) navigate('/login');
  if (isLoading) return <Spinner />
  if (role) return (
    <div className="mb-10 space-y-5">
      <h1 className="text-center text-xl xl:text-left xl:text-5xl font-bold mb-10">Dashboard Producción</h1>

      <TasksControl />
      <TasksInProgress />
      <CompletedTasksProduction/>
      <DownTimeReport/>
    </div>
  );
}
