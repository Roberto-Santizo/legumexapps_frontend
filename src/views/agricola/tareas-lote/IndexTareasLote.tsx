import { useParams } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { getTasks } from "@/api/TasksWeeklyPlanAPI";
import { TasksWeeklyPlan } from "@/types";
import Task from "@/components/Task";
import Spinner from "@/components/Spinner";

export default function IndexTareasLote() {
  const params = useParams();
  const lote_plantation_control_id = params.lote_plantation_control_id!!;
  const weekly_plan_id = params.weekly_plan_id!!;
  const [role, setRole] = useState<string>("");
  const [tasks, setTasks] = useState<TasksWeeklyPlan>({} as TasksWeeklyPlan);
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const results = useQueries({
    queries: [
      { queryKey: ['getUserRoleByToken'], queryFn: getUserRoleByToken },
      { queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id], queryFn: () => getTasks(lote_plantation_control_id, weekly_plan_id) },
    ]
  });

  const isLoading = results.some(result => result.isLoading);

  useEffect(() => {
    if (results[0].data) setRole(results[0].data);
    if (results[1].data) setTasks(results[1].data);
  }, [results]);

  if (isLoading) return <Spinner />
  
  if(tasks.data) return (
    <>
      <h2 className="font-bold text-3xl">
        Plan Semanal Semana {tasks.week} - FINCA {tasks.finca} - LOTE{" "}
        {tasks.lote}
      </h2>
      <div className="flex flex-col gap-10 mt-10">
        {tasks.data.map((task) => <Task key={task.id} task={task} role={role} getTasks={() => results[1].refetch()}/>)}
      </div>
    </>
  );
}
