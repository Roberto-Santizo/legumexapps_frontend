import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/api/TasksWeeklyPlanAPI";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useRole } from "@/hooks/useRole";
import Task from "@/components/tareas-lote-plan/Task";
import Spinner from "@/components/utilities-components/Spinner";
import FiltersTareasLote from "@/components/filters/FiltersTareasLote";
import InsumosModal from "@/components/modals/InsumosModal";

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

export default function Index() {
  const params = useParams();
  const lote_plantation_control_id = params.lote_plantation_control_id!;
  const weekly_plan_id = params.weekly_plan_id!;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersTareasLoteType>(initialValues);
  const [tempFilters, setTempFilters] = useState<FiltersTareasLoteType>(initialValues);

  const { data: role, isLoading: loadingRole } = useRole();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters],
    queryFn: () => getTasks({ lote: lote_plantation_control_id, weekly_plan_id, filters })
  });

  const isAdmin = useMemo(() => role === 'admin' || role === 'adminagricola', [role]);

  if (isLoading && loadingRole) return <Spinner />

  if (tasks && role) return (
    <>
      <div className="flex flex-col xl:flex-row justify-between">
        <h2 className="font-bold xl:text-left text-xl text-center xl:text-3xl">
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
          {tasks.data.map((task) => <Task key={task.id} task={task} filters={filters} isAdmin={isAdmin} />)}
        </div >
      )
      }

      {isOpen && (
        <FiltersTareasLote isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} setTempFilters={setTempFilters} tempFilters={tempFilters} />
      )}

      <InsumosModal filters={filters} />
    </>
  );
}
