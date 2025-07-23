import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import { taskReport } from "@/api/dashboardProductionAPI/taskReport";

export default function TasksControl() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["taskReport"],
    queryFn: taskReport,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <div className="flex flex-col items-center shadow-xl row-start-1 col-start-1 col-span-12 rounded-xl gap-10 p-10">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        Control de Tareas Producción
      </p>

      <div className="w-full overflow-x-auto">
        <div className="flex flex-nowrap gap-10 p-10">
          {data?.map((item) => (
            <div
              key={item.line}
              className="flex flex-col justify-between items-center gap-3"
            >
              <CircularProgressbar
                className="w-32"
                value={item.percentage * 100}
                text={`${item.finished_tasks}/${item.total_tasks}`}
                styles={buildStyles({
                  pathColor: "#3B82F6",
                  trailColor: "#F5F5F5",
                  textSize: 15,
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
