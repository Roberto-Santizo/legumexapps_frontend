import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import Spinner from "../utilities-components/Spinner";
import TasksControl from '@/components/dashboard-production/TasksControl';
import TasksInProgress from '@/components/dashboard-production/TasksInProgress';


export default function ProductionDashboard() {
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useRole();

  if (isError) navigate('/login');
  if (isLoading) return <Spinner />
  if (role) return (
    <div className="mb-10">
      <h1 className="text-5xl font-bold mb-10">Dashboard Producción</h1>

      <div className="mt-10 grid grid-cols-12 gap-5">
        {['admin', 'adminagricola'].includes(role) && (
          <>
            <TasksControl />
          </>
        )}
        <TasksInProgress />
        {/* <CompletedTasks /> */}
      </div>
    </div>
  );
}
