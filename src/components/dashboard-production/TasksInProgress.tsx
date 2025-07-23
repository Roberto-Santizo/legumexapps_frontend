import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle } from "lucide-react";
import { DashboardProduction } from "@/utils/utilsProductionDashboard/tasksInProgress";
import { tasksInProgress } from "@/api/dashboardProductionAPI/tasksInProgress";
import Spinner from "../utilities-components/Spinner";

const TasksInProgress = () => {
  const { data: tasks, isLoading, isError } = useQuery<DashboardProduction[]>({
    queryKey: ["tasks-in-tasksInProgress"],
    queryFn: tasksInProgress,
  });

  const getStatusColor = (status: string) =>
    status === "completed" ? "text-emerald-600" : "text-amber-600";

  const getStatusIcon = (status: string) =>
    status === "completed" ? CheckCircle : Clock;

  if(isLoading) return <Spinner />
  if (tasks) return (
    <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        CONTROL DE TAREAS EN PROCESO
      </p>
      <div className="w-full">
        <div className="bg-white rounded-b-lg shadow-sm">
          {isLoading ? (
            <div className="text-center py-6 text-gray-500">Cargando tareas...</div>
          ) : isError ? (
            <div className="text-center py-6 text-red-500">Error al cargar tareas.</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No hay tareas en proceso.</div>
          ) : (
            tasks.map((task, index) => {
              const StatusIcon = getStatusIcon("in-progress");
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-6 hover:bg-gray-100 transition-colors duration-200 ${index !== tasks.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 rounded-full bg-amber-50">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor("in-progress")}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center space-x-3 text-gray-700 justify-between">
                        <span className="font-medium text-gray-800">{task.product}</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-600">{task.line}</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-600 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {task.sku}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default TasksInProgress;
