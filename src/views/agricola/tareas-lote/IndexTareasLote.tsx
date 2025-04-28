import { useParams } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { getTasks } from "@/api/TasksWeeklyPlanAPI";
import { TasksWeeklyPlan } from "@/types";
import { Bars3Icon } from "@heroicons/react/16/solid";
import Task from "@/components/tareas-lote-plan/Task";
import Spinner from "@/components/utilities-components/Spinner";
import FiltersTareasLote from "@/components/filters/FiltersTareasLote";

export type FiltersTareasLoteType = {
  name: string;
  code: string;
  task_type: string;
}

const initialValues = {
  name: "",
  code: "",
  task_type: "",
}

export default function IndexTareasLote() {
  const params = useParams();
  const lote_plantation_control_id = params.lote_plantation_control_id!!;
  const weekly_plan_id = params.weekly_plan_id!!;
  const [role, setRole] = useState<string>("");
  const [tasks, setTasks] = useState<TasksWeeklyPlan>({} as TasksWeeklyPlan);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersTareasLoteType>(initialValues);
  const [tempFilters, setTempFilters] = useState<FiltersTareasLoteType>(initialValues);
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const results = useQueries({
    queries: [
      { queryKey: ['getUserRoleByToken'], queryFn: getUserRoleByToken },
      { queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id,filters], queryFn: () => getTasks({ cdp: lote_plantation_control_id, weekly_plan_id, filters}) },
    ]
  });

  const isLoading = results.some(result => result.isLoading);

  useEffect(() => {
    if (results[0].data) setRole(results[0].data);
    if (results[1].data) setTasks(results[1].data);
  }, [results]);

  if (isLoading) return <Spinner />

  if (tasks.data) return (
    <>
      <div className="flex justify-between">
        <h2 className="font-bold text-3xl">
          Plan Semanal Semana {tasks.week} - FINCA {tasks.finca} - LOTE{" "}
          {tasks.lote}
        </h2>

        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />

      </div>
      {tasks.data.length === 0 ? (
        <p className="text-center text-xl mt-5">No hay tareas pendientes</p>
      ) : (
        <div className="flex flex-col gap-10 mt-10">
          {tasks.data.map((task) => <Task key={task.id} task={task} role={role} getTasks={() => results[1].refetch()} />)}
        </div >
      )
      }

      {isOpen && (
        <FiltersTareasLote isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} setTempFilters={setTempFilters} tempFilters={tempFilters}/>
      )}

    </>
  );
}
