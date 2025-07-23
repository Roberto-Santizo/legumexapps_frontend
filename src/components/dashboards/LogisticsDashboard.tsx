import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
// import FinishedTasks from "@/components/dashboard-agricola/FinishedTasks";
// import TasksCropInProgress from "@/components/dashboard-agricola/TasksCropInProgress";
// import FinishedTasksCrop from "@/components/dashboard-agricola/FinishedTasksCrop";
import Spinner from "../utilities-components/Spinner";

import TasksControl from '@/components/dashboard-production/TasksControl';
import TasksInProgress from '@/components/dashboard-production/TasksInProgress'
import CompletedTasks from '@/components/dashboard-production/CompletedTasks'


export default function AgricolaDashboard() {
  const navigate = useNavigate();

  const { data: role, isLoading, isError } = useRole();

  if (isError) navigate('/login');
  if (isLoading) return <Spinner />
  if (role) return (
    <div>
      <h1 className="text-5xl font-bold mb-10">Dashboard Producción</h1>

      <div className="mt-10 grid grid-cols-12 gap-5">
        {['admin', 'adminagricola'].includes(role) && (
          <>
            <TasksControl />
          </>
        )}
        <TasksInProgress />
         <CompletedTasks />
        {/* <TasksCropInProgress />
        <FinishedTasksCrop /> */} 
      </div>
    </div>
  );
}
